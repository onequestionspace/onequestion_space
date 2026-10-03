import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import {
  generateAnswer,
  generateEmbeddings,
  cosineSimilarity,
  ProfileContext,
} from '@/lib/gemini';

export const runtime = 'nodejs';
export const maxDuration = 300;

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/** Never answer more than this in one request — keeps us inside function limits. */
const MAX_QUESTIONS = 10;
/** Retrieval depth per question. */
const TOP_K = 5;
/** Sequential on purpose: parallel LLM calls trip provider rate limits. */
const THROTTLE_MS = 350;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await convex.query(api.profiles.current);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
    if (profile.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const limit = Math.min(Number(body?.limit) || MAX_QUESTIONS, MAX_QUESTIONS);

    const pending = await convex.query(api.questions.getUnansweredQuestions, {
      profileId: profile._id,
    });
    const questions = (pending ?? []).slice(0, limit);

    if (questions.length === 0) {
      return NextResponse.json({ success: true, processed: 0, skipped: 0, failed: 0 });
    }

    const knowledge =
      (await convex.query(api.knowledge.getKnowledgeByUserId, { userId: profile.userId })) ?? [];

    const context: ProfileContext = {
      displayName: profile.displayName,
      bio: profile.bio,
      welcomeMessage: profile.welcomeMessage,
      username: profile.username,
    };

    let processed = 0;
    let failed = 0;

    for (const question of questions) {
      try {
        const chunks: string[] = [];

        if (knowledge.length > 0) {
          const embedding = await generateEmbeddings(question.question).catch(() => []);
          if (embedding.length > 0) {
            chunks.push(
              ...knowledge
                .flatMap((k) =>
                  Array.isArray(k.embeddings) && k.embeddings.length > 0
                    ? [{ text: k.content, score: cosineSimilarity(embedding, k.embeddings) }]
                    : []
                )
                .sort((a, b) => b.score - a.score)
                .slice(0, TOP_K)
                .map((k) => k.text)
            );
          } else {
            // No embeddings available — fall back to the most recent knowledge.
            chunks.push(...knowledge.slice(0, TOP_K).map((k) => k.content));
          }
        }

        const answer = await generateAnswer(question.question, chunks, context);
        const trimmed = answer?.trim();

        // Treat the model's "I don't know" and placeholder replies as failures
        // so they are not written to the knowledge base as real answers.
        const unusable =
          !trimmed ||
          trimmed === "Sorry, I could not generate an answer right now." ||
          trimmed === 'AI is not configured yet.' ||
          trimmed.includes('generated an answer right now') ||
          trimmed.includes('not configured yet');

        if (unusable) {
          failed += 1;
          continue;
        }

        await convex.mutation(api.questions.answerQuestion, {
          id: question._id,
          answer: trimmed,
        });
        processed += 1;
      } catch (error) {
        console.error(`answer-all: failed for question ${question._id}:`, error);
        failed += 1;
      }

      await sleep(THROTTLE_MS);
    }

    const skipped = questions.length - processed - failed;

    return NextResponse.json({ success: true, processed, skipped, failed });
  } catch (error) {
    console.error('Error in POST /api/inbox/answer-all:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}