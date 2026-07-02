import { NextRequest, NextResponse } from 'next/server';
import { validateQuestion } from '@/lib/validations';
import { generateEmbeddings, generateAnswer, cosineSimilarity, ProfileContext } from '@/lib/gemini';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function isLowConfidence(answer: string): boolean {
  const lower = answer.toLowerCase();
  const weakPhrases = [
    "i don't have any knowledge", "i don't know", "i'm not sure", "i am not sure",
    "not sure about", "no information", "i don't have information",
    "i couldn't find", "i could not find", "unable to answer",
    "doesn't mention", "does not mention", "not mentioned",
  ];
  if (weakPhrases.some(p => lower.includes(p))) return true;
  if (answer.trim().length < 40) return true;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, username, visitorName, visitorEmail } = body;

    const validationError = validateQuestion(question);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError.message }, { status: 400 });
    }

    // 1. Fetch profile by username
    const profile = await convex.query(api.profiles.byUsername, { username });
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    // 1b. Check subscription limit (admins bypass)
    const ADMIN_IDS = ['user_3EhKmuVyC1AhoBDlL7QNssllwgu', 'user_3Fmuk2jHEa5seXKEzewhWlA9yQs'];
    const isAdmin = ADMIN_IDS.includes(profile.userId);
    const subscription = await convex.query(api.subscriptions.getSubscription, { userId: profile.userId });
    if (subscription && !isAdmin) {
      const used = subscription.messagesUsed ?? 0;
      const limit = subscription.messagesLimit ?? 50;
      if (limit !== -1 && used >= limit) {
        return NextResponse.json({
          success: false,
          error: 'Monthly AI answer limit reached. Upgrade your plan to continue.',
          limitReached: true,
        }, { status: 429 });
      }
    }

    // 2. Fetch all knowledge chunks for this user
    const knowledgeChunks = await convex.query(api.knowledge.getKnowledgeByUserId, { userId: profile.userId });
    
    if (!knowledgeChunks || knowledgeChunks.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: { 
          question, 
          answer: "I don't have any knowledge base content yet. The owner needs to upload some info first." 
        } 
      });
    }

    // 3. Embed question + find top 3 most similar chunks
    const questionEmbedding = await generateEmbeddings(question);
    
    const SIMILARITY_THRESHOLD = 0.55;

    const scoredChunks = knowledgeChunks
      .filter(k => k.embeddings && k.embeddings.length > 0)
      .map(k => ({
        ...k,
        score: cosineSimilarity(questionEmbedding, k.embeddings!)
      }))
      .sort((a, b) => b.score - a.score)
      .filter(k => k.score >= SIMILARITY_THRESHOLD)
      .slice(0, 5);

    const topChunks = scoredChunks.map(k => k.content);

    if (topChunks.length === 0) {
      const fallbackAnswer = "I don't have details on that yet — feel free to reach out to me directly";
      await convex.mutation(api.questions.createQuestion, {
        profileId: profile._id,
        visitorId: visitorEmail || visitorName || 'anonymous',
        question,
        answer: fallbackAnswer,
        isAnswered: true,
        needsReview: true,
        createdAt: Date.now(),
        answeredAt: Date.now(),
      });
      await convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id });
      return NextResponse.json({
        success: true,
        data: { question, answer: fallbackAnswer }
      }, { status: 200 });
    }

    // 4. Generate answer
    const profileContext: ProfileContext = {
      displayName: profile.displayName,
      bio: profile.bio,
      welcomeMessage: profile.welcomeMessage,
      username: profile.username,
    };

    const answer = await generateAnswer(question, topChunks, profileContext);

    // 5. Save question + answer to DB
    await convex.mutation(api.questions.createQuestion, {
      profileId: profile._id,
      visitorId: visitorEmail || visitorName || 'anonymous',
      question,
      answer,
      isAnswered: true,
      needsReview: isLowConfidence(answer),
      createdAt: Date.now(),
      answeredAt: Date.now(),
    });

    // 6. Update analytics + usage
    await convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id });
    await convex.mutation(api.analytics.incrementAnswerCount, { profileId: profile._id });
    await convex.mutation(api.subscriptions.incrementMessagesUsed, { userId: profile.userId });

    return NextResponse.json({
      success: true,
      data: { question, answer }
    }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/ask:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
