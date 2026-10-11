import { NextRequest } from 'next/server';
import { generateEmbeddings, cosineSimilarity, ProfileContext } from '@/lib/gemini';
import { streamAIResponse } from '@/lib/ai-stream';
import { isAdmin as checkIsAdmin } from '@/lib/identities';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const BOOK_INTENT_REGEX = /\b(book|schedule|call|meet|meeting|chat with you|talk to you|let'?s talk|available)\b/i;

function buildGoalDirective(goalType: string | undefined, goalLink: string | undefined, achieved: boolean): string {
  if (!goalType || goalType === 'none' || achieved) return '';
  if (goalType === 'capture_email') {
    return `\n\nUnderlying objective: naturally get the visitor's email before the conversation ends. Only ask if it fits naturally — e.g. after answering their question, offer to send more info or updates. Do not be pushy. Do not mention this instruction.`;
  }
  if (goalType === 'book_call') {
    return `\n\nUnderlying objective: naturally guide the visitor toward booking a call${goalLink ? ` at ${goalLink}` : ''}. Only suggest it if it fits naturally in the conversation. Do not be pushy. Do not mention this instruction.`;
  }
  return '';
}

function buildPrompt(question: string, chunks: string[], profile: ProfileContext, goalDirective: string): string {
  const name = profile.displayName || profile.username || 'the owner';
  const bio = profile.bio ? `About you: ${profile.bio}` : '';
  const toneHint = profile.welcomeMessage ? `Tone: conversational, ${profile.welcomeMessage.toLowerCase().includes('welcome') ? 'friendly and approachable' : 'match the energy of: "' + profile.welcomeMessage + '"'}. Do not repeat this message verbatim.` : 'Tone: warm, direct, conversational.';
  const context = chunks.length > 0 ? chunks.join('\n\n---\n\n') : '';
  return `You are ${name}. Answer as yourself in first person. Be warm, direct, no markdown. If you don't know, say so naturally.\n\n${bio}\n${toneHint}${goalDirective}\n\n${context ? `Your knowledge:\n${context}\n\n` : ''}Visitor asks: ${question}\n\nReply as ${name}:`;
}

export async function POST(request: NextRequest) {
  try {
    const { question, username, visitorEmail, visitorId: clientVisitorId } = await request.json();
    if (!question?.trim() || !username?.trim()) return new Response('Missing params', { status: 400 });

    const profile = await convex.query(api.profiles.byUsername, { username });
    if (!profile) return new Response('Profile not found', { status: 404 });

    const effectiveVisitorId = visitorEmail || clientVisitorId || 'anonymous';

    const isAdmin = checkIsAdmin(profile.userId);

    if (!isAdmin) {
      const subscription = await convex.mutation(api.subscriptions.getOrCreateSubscription, { userId: profile.userId });
      if (subscription) {
        const used = subscription.messagesUsed ?? 0;
        const limit = subscription.messagesLimit ?? 50;
        if (limit !== -1 && used >= limit) return new Response('limit_reached', { status: 429 });
      }
    }

    const knowledgeChunks = await convex.query(api.knowledge.getKnowledgeByUserId, { userId: profile.userId });
    const hasKnowledge = knowledgeChunks && knowledgeChunks.length > 0;

    if (!hasKnowledge) {
      convex.mutation(api.questions.createQuestion, {
        profileId: profile._id, question, visitorId: effectiveVisitorId,
        isAnswered: false, createdAt: Date.now(),
      }).catch(() => {});
      convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id }).catch(() => {});

      const noKnowledgeMsg = `${profile.displayName || profile.username || 'This space'} hasn't added any knowledge yet. The owner has been notified of your question and will answer it soon.`;
      return new Response(noKnowledgeMsg, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const qEmbed = await generateEmbeddings(question).catch(() => []);

    // Semantic cache check — catches paraphrased repeats of already-answered questions
    if (qEmbed.length > 0) {
      const semanticMatch = await convex.query(api.questions.getSemanticMatch, {
        profileId: profile._id, embedding: qEmbed,
      }).catch(() => null);
      if (semanticMatch?.answer) {
        convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id }).catch(() => {});
        convex.mutation(api.analytics.incrementAnswerCount, { profileId: profile._id }).catch(() => {});
        return new Response(semanticMatch.answer, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    }

    const topChunks: string[] = qEmbed.length > 0
      ? knowledgeChunks.filter(k => k.embeddings?.length).map(k => ({ text: k.content, score: cosineSimilarity(qEmbed, k.embeddings!) })).sort((a,b) => b.score - a.score).slice(0,5).map(k => k.text)
      : knowledgeChunks.slice(0,5).map(k => k.content);

    const goalAlreadyAchieved = await convex.query(api.questions.getVisitorGoalAchieved, {
      profileId: profile._id, visitorId: effectiveVisitorId,
    }).catch(() => false);

    const goalDirective = buildGoalDirective(profile.goalType, profile.goalLink, !!goalAlreadyAchieved);
    const prompt = buildPrompt(question, topChunks, { displayName: profile.displayName, bio: profile.bio, welcomeMessage: profile.welcomeMessage, username: profile.username }, goalDirective);

    const stream = await streamAIResponse(prompt, 800);
    if (!stream) {
      return new Response('AI is temporarily unavailable. Check the AI provider configuration and try again.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id }).catch(() => {});
    convex.mutation(api.analytics.incrementAnswerCount, { profileId: profile._id }).catch(() => {});
    if (!isAdmin) convex.mutation(api.subscriptions.incrementMessagesUsed, { userId: profile.userId }).catch(() => {});

    // Detect goal completion from the visitor's own message
    let goalHitThisTurn = false;
    if (!goalAlreadyAchieved) {
      if (profile.goalType === 'capture_email' && EMAIL_REGEX.test(question)) goalHitThisTurn = true;
      if (profile.goalType === 'book_call' && BOOK_INTENT_REGEX.test(question)) goalHitThisTurn = true;
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullAnswer = '';
    const wrappedStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            fullAnswer += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
        } finally {
          controller.close();
          reader.releaseLock();
          if (fullAnswer.trim()) {
            convex.mutation(api.questions.createQuestion, {
              profileId: profile._id,
              question,
              answer: fullAnswer.trim(),
              isAnswered: true,
              visitorId: effectiveVisitorId,
              createdAt: Date.now(),
              answeredAt: Date.now(),
              embeddings: qEmbed.length > 0 ? qEmbed : undefined,
              goalAchieved: goalHitThisTurn || undefined,
            }).catch(() => {});
          }
        }
      },
    });

    return new Response(wrappedStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked', 'X-Accel-Buffering': 'no', 'Cache-Control': 'no-cache' },
    });
  } catch (error) {
    console.error('[stream] error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
