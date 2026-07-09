import { NextRequest } from 'next/server';
import { generateEmbeddings, cosineSimilarity } from '@/lib/gemini';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

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

async function streamGemini(prompt: string): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
        }),
      }
    );
    if (!res.ok || !res.body) return null;
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();
        let buffer = '';
        let tokenCount = 0;
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
                const parsed = JSON.parse(json);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                tokenCount += parsed.usageMetadata?.candidatesTokenCount ?? 0;
                const finishReason = parsed.candidates?.[0]?.finishReason;
                if (finishReason === 'MAX_TOKENS' && tokenCount < 50) { controller.close(); reader.releaseLock(); return; }
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
        temperature: 0.7, max_tokens: 2048, stream: true,
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
                if (text) controller.enqueue(encoder.encode(text));
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
    const { question, userId } = await request.json();
    if (!question?.trim() || !userId?.trim()) return new Response('Missing params', { status: 400 });

    const knowledgeChunks = await convex.query(api.knowledge.getKnowledgeByUserId, { userId });
    const hasKnowledge = knowledgeChunks && knowledgeChunks.length > 0;

    // Memory Dump mode
    if (isMemoryDump(question)) {
      const prompt = buildDumpPrompt(question);
      let stream = await streamGemini(prompt);
      if (!stream) stream = await streamGroq(prompt);
      if (!stream) return new Response('Could not process memory dump.', { status: 500 });

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

    let stream = await streamGemini(prompt);
    if (!stream) stream = await streamGroq(prompt);
    if (!stream) return new Response('Could not generate answer right now.', { status: 500 });

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
