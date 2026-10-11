import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateEmbeddings, cosineSimilarity } from '@/lib/gemini';
import { streamAIResponse } from '@/lib/ai-stream';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function isMemoryDump(question: string): boolean {
  const lower = question.trim().toLowerCase();
  return lower.startsWith('/dump') || lower.startsWith('dump my memory') || lower.startsWith('brain dump');
}

function buildDumpPrompt(content: string): string {
  const dumpContent = content.replace(/^\/dump\s*/i, '').replace(/^(dump my memory|brain dump)\s*/i, '').trim();
  return `You are the user's personal knowledge operating system. The user has just dumped raw thoughts, notes, or memories.

Your job is to organize this dump automatically.

1. First, acknowledge what they shared.
2. CATEGORIZE the content into logical sections (Projects, Ideas, Tasks, Links, People, Questions, etc.)
3. For each item, suggest how it could be turned into knowledge — e.g., "Turn this into a knowledge article", "Create a FAQ from this question", "Save as a project note"
4. Extract any action items, dates, names, or links.
5. Group related items together.
6. Suggest a title for this knowledge collection.
7. Use markdown with clear sections.

User's dump:
"""
${dumpContent || '(No content — user wants to know how to use the memory dump feature)'}
"

If no content was provided, explain how the memory dump feature works:
- Paste any amount of text (thoughts, notes, transcripts, links, ideas)
- The AI will automatically organize everything into categories
- Extract action items and links
- Suggest knowledge articles to create
- Remove duplicates
- The goal: users should never manually organize knowledge again.`;
}

function buildAgentPrompt(
  question: string,
  chunks: { title: string; content: string; score: number }[],
  hasKnowledge: boolean,
  knowledgeCount: number,
): string {
  const context = chunks.length > 0
    ? chunks.map((c, i) => `[Source ${i + 1}: "${c.title}"]\n${c.content}`).join('\n\n---\n\n')
    : '';

  const isAgentAction = /^(create|rename|edit|update|delete|organize|generate|summarize|find|search|explain|suggest|improve|draft|write|make)/i.test(question.trim());

  let prompt = `You are an AI operating system for the user's personal knowledge. You are NOT a generic chatbot — you ONLY use the knowledge provided below.

## Core Identity
- You are an expert knowledge curator, analyst, and content strategist
- You speak directly and conversationally — like a brilliant colleague, not a robot
- You are specific, detailed, and grounded in the user's actual content
- You NEVER hallucinate. If information is missing, say so clearly and suggest what the user should upload

## Response Rules
1. Answer based ONLY on the user's knowledge below
2. Use **markdown** formatting: **bold**, bullet points, headings, code blocks as needed
3. Cite sources inline like [Source 1] when referencing specific items
4. Be thorough — explore the knowledge deeply, connect related ideas
5. If the knowledge is missing or incomplete:
   - Say "I don't have information about that in your knowledge base"
   - Suggest specific things the user could upload to fill the gap
6. Always reference sources and explain your reasoning
7. Prioritize the user's knowledge over any general knowledge
8. Keep your tone warm, specific, and personal — never generic`;

  if (isAgentAction) {
    prompt += `\n\n## Agent Mode
The user is asking you to perform an action. Based on your analysis of their knowledge:

- **Create/Suggest**: Propose specific content with clear structure
- **Organize**: Group related items, suggest categories and tags
- **Analyze**: Identify patterns, gaps, duplicates, outdated info
- **Generate**: Draft the content directly using their knowledge and voice
- **Improve**: Give actionable suggestions with examples

Always explain WHY you recommend something. Connect it back to their actual knowledge.`;
  }

  if (context) {
    prompt += `\n\n## User's Knowledge Base (${knowledgeCount} items total, showing ${chunks.length} most relevant)\n\n${context}`;
  } else {
    prompt += `\n\n## Knowledge Status\nNo knowledge has been uploaded yet. Explain that you need content to work with, and suggest what they can upload (documents, notes, PDFs, URLs, text).`;
  }

  prompt += `\n\n## Question\n${question}\n\n## Response`;

  return prompt;
}

// Intent detection — reads natural language and returns action type
function detectIntent(question: string): { intent: string; params: Record<string, string> } {
  const q = question.toLowerCase().trim();

  // Profile update intents
  if (/change my bio|update my bio|set my bio|my bio (is|should be|to)/i.test(q)) {
    const bio = question.replace(/^.*(bio|about me)[^:]*[:-]?s*/i, '').trim();
    return { intent: 'updateBio', params: { bio } };
  }
  if (/change my welcome|update my welcome|set my welcome|welcome message (is|should be|to)/i.test(q)) {
    const welcomeMessage = question.replace(/^.*(welcome message|greeting)[^:]*[:-]?s*/i, '').trim();
    return { intent: 'updateWelcome', params: { welcomeMessage } };
  }
  if (/change.*name|update.*name|my name is/i.test(q)) {
    const displayName = question.replace(/^.*(name)[^:]*[:-]?s*/i, '').trim();
    return { intent: 'updateName', params: { displayName } };
  }

  // Knowledge intents
  if (/save (this|it|that)|add (this|it|that) to (my )?knowledge|remember (this|that)/i.test(q)) {
    return { intent: 'saveKnowledge', params: {} };
  }
  if (/show (me )?(all )?my knowledge|list (my )?knowledge|what do (i|you) know/i.test(q)) {
    return { intent: 'listKnowledge', params: {} };
  }
  if (/what('s| is) missing|gaps? in my knowledge|what should i (add|upload)/i.test(q)) {
    return { intent: 'knowledgeGap', params: {} };
  }

  // Analytics intents
  if (/how many (questions|visitors|views)|my (stats|analytics|numbers)/i.test(q)) {
    return { intent: 'getAnalytics', params: {} };
  }
  if (/most asked|top questions|popular questions/i.test(q)) {
    return { intent: 'topQuestions', params: {} };
  }

  // Content generation intents
  if (/write (my|a|an) bio|generate (my|a) bio|create (my|a) bio/i.test(q)) {
    return { intent: 'generateBio', params: {} };
  }
  if (/write.*tweet|generate.*tweet|create.*tweet|x post|twitter post/i.test(q)) {
    return { intent: 'generateTweet', params: {} };
  }
  if (/write.*blog|generate.*blog|create.*blog post/i.test(q)) {
    return { intent: 'generateBlog', params: {} };
  }
  if (/create.*faq|generate.*faq|make.*faq/i.test(q)) {
    return { intent: 'generateFAQ', params: {} };
  }
  if (/improve.*welcome|better welcome|fix.*welcome/i.test(q)) {
    return { intent: 'improveWelcome', params: {} };
  }

  return { intent: 'chat', params: {} };
}

// Helper to wrap plain text as a streaming response
function wrapTextAsStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify({ type: 'content', text }) + '\n'));
      controller.enqueue(encoder.encode(JSON.stringify({ type: 'done', sources: [] }) + '\n'));
      controller.close();
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { userId: sessionUserId } = await auth();
    if (!sessionUserId) return new Response('Unauthorized', { status: 401 });

    const { question, userId, action, actionData } = await request.json();
    if (!userId?.trim()) return new Response('Missing params', { status: 400 });
    if (userId !== sessionUserId) return new Response('Forbidden', { status: 403 });

    if (action === 'updateProfile' && actionData) {
      await convex.mutation(api.profiles.update, { ...actionData });
      return new Response(JSON.stringify({ type: 'action', result: 'Profile updated!' }) + '\n', {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    if (action === 'saveKnowledge' && actionData?.content) {
      const { generateEmbeddings: genEmbed } = await import('@/lib/gemini');
      let embeddings: number[] = [];
      try { embeddings = await genEmbed(actionData.content); } catch {}
      await convex.mutation(api.knowledge.createKnowledge, {
        userId,
        title: actionData.title || 'Chat Note',
        content: actionData.content,
        embeddings: embeddings.length > 0 ? embeddings : undefined,
      });
      return new Response(JSON.stringify({ type: 'action', result: 'Saved to knowledge base!' }) + '\n', {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    // Detect intent from natural language
    const { intent, params } = detectIntent(question || '');

    // Handle profile update intents
    if (intent === 'updateBio' && params.bio && params.bio.length > 3) {
      await convex.mutation(api.profiles.update, { bio: params.bio }).catch(() => {});
      const stream = wrapTextAsStream(`Done! I updated your bio to: "${params.bio}". Your AI will now use this when answering questions about you.`);
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
    }
    if (intent === 'updateWelcome' && params.welcomeMessage && params.welcomeMessage.length > 3) {
      await convex.mutation(api.profiles.update, { welcomeMessage: params.welcomeMessage }).catch(() => {});
      const stream = wrapTextAsStream(`Done! Welcome message updated to: "${params.welcomeMessage}". Visitors will see this on your space.`);
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
    }
    if (intent === 'updateName' && params.displayName && params.displayName.length > 1) {
      await convex.mutation(api.profiles.update, { displayName: params.displayName }).catch(() => {});
      const stream = wrapTextAsStream(`Done! Your display name is now "${params.displayName}".`);
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
    }

    const knowledgeChunks = await convex.query(api.knowledge.getKnowledgeByUserId, { userId });
    const hasKnowledge = knowledgeChunks && knowledgeChunks.length > 0;

    // List knowledge intent
    if (intent === 'listKnowledge') {
      const list = knowledgeChunks?.slice(0, 10).map((k, i) => `${i+1}. **${k.title}** — ${k.content.slice(0,80)}...`).join('\n') || 'No knowledge uploaded yet.';
      const stream = wrapTextAsStream(`Here are your knowledge items:\n\n${list}\n\nYou have ${knowledgeChunks?.length || 0} items total.`);
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
    }

    // Memory Dump mode
    if (isMemoryDump(question)) {
      const prompt = buildDumpPrompt(question);
      const stream = await streamAIResponse(prompt, 2048);
      if (!stream) {
        return new Response('AI is temporarily unavailable. Check your AI provider configuration and try again.', { status: 503 });
      }

      const responseStream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const reader = stream!.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = new TextDecoder().decode(value);
              controller.enqueue(encoder.encode(JSON.stringify({ type: 'content', text: chunk }) + '\n'));
            }
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'done', sources: [] }) + '\n'));
          } catch {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'error' }) + '\n'));
          } finally {
            controller.close();
            reader.releaseLock();
          }
        },
      });

      return new Response(responseStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // Normal RAG mode
    let topChunks: { title: string; content: string; score: number }[] = [];

    if (hasKnowledge) {
      const qEmbed = await generateEmbeddings(question).catch(() => []);
      if (qEmbed.length > 0) {
        const scored = knowledgeChunks
          .filter(k => k.embeddings?.length)
          .map(k => ({
            title: k.title,
            content: k.content,
            score: cosineSimilarity(qEmbed, k.embeddings!),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        topChunks = scored.filter(c => c.score > 0.40);
        if (topChunks.length === 0) topChunks = scored.slice(0, 3);
      } else {
        topChunks = knowledgeChunks.slice(0, 5).map(k => ({
          title: k.title,
          content: k.content,
          score: 0,
        }));
      }
    }

    const prompt = buildAgentPrompt(question, topChunks, hasKnowledge, knowledgeChunks?.length || 0);

    const stream = await streamAIResponse(prompt, 2048);
    if (!stream) {
      return new Response('AI is temporarily unavailable. Check your AI provider configuration and try again.', { status: 503 });
    }

    const responseStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const reader = stream!.getReader();
        let fullContent = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            fullContent += chunk;
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'content', text: chunk }) + '\n'));
          }
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'done',
            sources: topChunks.map(c => ({
              title: c.title,
              content: c.content.slice(0, 200),
              score: c.score,
            })),
          }) + '\n'));
        } catch {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error' }) + '\n'));
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('[chat-knowledge] error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
