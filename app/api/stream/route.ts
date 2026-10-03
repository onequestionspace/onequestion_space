import { NextRequest } from 'next/server';
import { generateEmbeddings, cosineSimilarity, ProfileContext } from '@/lib/gemini';
import { isAdmin as checkIsAdmin } from '@/lib/identities';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

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

async function streamGemini(prompt: string): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        }),
      }
    );
    if (!res.ok || !res.body) return null;
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    const reader = res.body.getReader();
    let firstChunks = '';
    let totalText = '';
    let isRateLimited = false;
    let eventCount = 0;
    while (eventCount < 3) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      firstChunks += chunk;
      const lines = firstChunks.split('\n');
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6).trim();
        if (json === '[DONE]') continue;
        try {
          const parsed = JSON.parse(json);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
          const tokenCount = parsed.usageMetadata?.candidatesTokenCount ?? 0;
          const finishReason = parsed.candidates?.[0]?.finishReason;
          if (finishReason === 'MAX_TOKENS' && tokenCount < 50) { isRateLimited = true; break; }
          totalText += text;
          eventCount++;
        } catch {}
      }
      if (isRateLimited) break;
    }
    if (isRateLimited || totalText.trim().length === 0) {
      reader.releaseLock();
      return null;
    }
    return new ReadableStream({
      async start(controller) {
        if (totalText) controller.enqueue(encoder.encode(totalText));
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const json = line.slice(6).trim();
              if (json === '[DONE]') continue;
              try {
                const text = JSON.parse(json).candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                if (text) controller.enqueue(encoder.encode(text));
              } catch {}
            }
          }
        } finally { controller.close(); reader.releaseLock(); }
      },
    });
  } catch { return null; }
}

async function streamGroq(prompt: string): Promise<ReadableStream<Uint8Array> | null> {
  if (!GROQ_API_KEY) return null;
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7, max_tokens: 800, stream: true,
      }),
    });
    if (!res.ok || !res.body) return null;
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();
        let buffer = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const json = line.slice(6).trim();
              if (json === '[DONE]') continue;
              try {
                const text = JSON.parse(json).choices?.[0]?.delta?.content ?? '';
                if (text) controller.enqueue(encoder.encode(text.replace(/\*\*/g, '')));
              } catch {}
            }
          }
        } finally { controller.close(); reader.releaseLock(); }
      },
    });
  } catch { return null; }
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

    let stream = await streamGemini(prompt);
    if (!stream) stream = await streamGroq(prompt);
    if (!stream) return new Response('Could not generate answer right now.', { headers: { 'Content-Type': 'text/plain' } });

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
