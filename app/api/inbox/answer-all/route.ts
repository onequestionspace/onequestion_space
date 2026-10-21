import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { isAdminUser } from '@/convex/userIds';
import { generateAnswer, generateEmbeddings, rankKnowledge } from '@/lib/gemini';

export const maxDuration = 60;

const BATCH_SIZE = 5;

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured');

    const body: unknown = await request.json();
    const username = typeof body === 'object' && body !== null && 'username' in body
      ? body.username
      : undefined;
    if (typeof username !== 'string' || !username.trim()) {
      return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
    }

    const token = await getToken({ template: 'convex' });
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const convex = new ConvexHttpClient(convexUrl);
    convex.setAuth(token);
    const profile = await convex.query(api.profiles.byUsername, { username: username.trim() });
    if (!profile || profile.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const [unanswered, needsReview, knowledge] = await Promise.all([
      convex.query(api.questions.getUnansweredQuestions, { profileId: profile._id }),
      convex.query(api.questions.listNeedsReview, { profileId: profile._id }),
      convex.query(api.knowledge.getKnowledgeByUserId, { userId }),
    ]);
    const needsReviewIds = new Set(needsReview.map((question) => question._id));
    const pending = unanswered.filter((question) => !needsReviewIds.has(question._id));

    if (pending.length === 0) {
      return NextResponse.json({ success: true, processed: 0, remaining: 0 });
    }
    if (knowledge.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Add knowledge to your space before generating AI answers.',
      }, { status: 400 });
    }

    const isAdmin = isAdminUser(userId);
    let availableCredits = Number.POSITIVE_INFINITY;
    if (!isAdmin) {
      const subscription = await convex.mutation(api.subscriptions.getOrCreateSubscription, { userId });
      const used = subscription?.messagesUsed ?? 0;
      const limit = subscription?.messagesLimit ?? 50;
      availableCredits = limit === -1 ? Number.POSITIVE_INFINITY : Math.max(0, limit - used);
      if (availableCredits === 0) {
        return NextResponse.json({
          success: false,
          error: 'You have reached your AI answer limit. Upgrade your plan to continue.',
          code: 'limit_reached',
        }, { status: 429 });
      }
    }

    const batch = pending.slice(0, Math.min(BATCH_SIZE, availableCredits));
    let processed = 0;
    for (const question of batch) {
      const embedding = await generateEmbeddings(question.question);
      const context = rankKnowledge(question.question, embedding, knowledge)
        .map((chunk) => `[${chunk.title}]\n${chunk.content}`);

      const answer = await generateAnswer(question.question, context, {
        displayName: profile.displayName,
        bio: profile.bio,
        username: profile.username,
      });
      if (
        !answer.trim() ||
        answer === 'AI is not configured yet.' ||
        answer === 'Sorry, I could not generate an answer right now.'
      ) {
        throw new Error('AI provider did not generate an answer');
      }

      await convex.mutation(api.questions.answerQuestion, {
        id: question._id,
        answer,
      });
      await convex.mutation(api.analytics.incrementAnswerCount, { profileId: profile._id });
      if (!isAdmin) {
        await convex.mutation(api.subscriptions.incrementMessagesUsed, { userId });
      }
      processed += 1;
    }

    return NextResponse.json({
      success: true,
      processed,
      remaining: Math.max(0, pending.length - processed),
    });
  } catch (error) {
    console.error('[inbox/answer-all] error:', error);
    return NextResponse.json({ success: false, error: 'Could not answer questions right now.' }, { status: 500 });
  }
}
