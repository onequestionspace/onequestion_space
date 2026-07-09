import { NextRequest } from 'next/server';
import { generateEmbeddings, cosineSimilarity } from '@/lib/gemini';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

function buildPrompt(question: string, chunks: { title: string; content: string; score: number }[]): string {
  const context = chunks.length > 0
    ? chunks.map((c, i) => `[Source ${i + 1}: ${c.title}]\n${c.content}`).join('\n\n---\n\n')
    : '';
  return `You are an AI assistant that answers questions based solely on the user's provided knowledge. 

Your goal is to be helpful, accurate, and conversational — like ChatGPT but trained only on the user's documents.

Rules:
- Answer based ONLY on the knowledge provided below. If the answer is not in the knowledge, say "I don't have information about that in your knowledge base."
- Use markdown formatting: **bold** for emphasis, bullet points for lists, headings where appropriate.
- Include inline citations like [Source 1], [Source 2] etc. when referencing specific knowledge items.
- Be thorough and detailed — the user wants to explore their knowledge deeply.
- Never mention that you're an AI or that you're pulling from knowledge — just answer naturally.
- Format code blocks with triple backticks if relevant.

${context ? `\nUser's knowledge:\n${context}\n` : '\nNo knowledge available.\n'}

User's question: ${question}

Answer:`;
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
          generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
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
        temperature: 0.7, max_tokens: 1500, stream: true,
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
          .slice(0, 8);
        topChunks = scored.filter(c => c.score > 0.45);
        if (topChunks.length === 0) {
          topChunks = scored.slice(0, 3);
        }
      } else {
        topChunks = knowledgeChunks.slice(0, 5).map(k => ({
          title: k.title,
          content: k.content,
          score: 0,
        }));
      }
    }

    const prompt = buildPrompt(question, topChunks);

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
        } catch (e) {
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
