import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateEmbeddings, chunkText } from '@/lib/gemini';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.5-flash';
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function callGemini(system: string, messages: any[], maxTokens = 500) {
  const contents = messages.map((m: any) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch(`${GEMINI_BASE}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
    }),
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { messages, system, mode, saveAnswer, question, answer } = await req.json();

    // Mode: save a Q&A pair as knowledge
    if (mode === 'save' && question && answer) {
      const content = `Q: ${question}\nA: ${answer}`;
      let embeddings: number[] = [];
      try {
        const chunks = chunkText(content);
        embeddings = await generateEmbeddings(chunks.join(' '));
      } catch {}

      await convex.mutation(api.knowledge.createKnowledge, {
        userId,
        title: `Interview: ${question.slice(0, 60)}`,
        content,
        embeddings: embeddings.length > 0 ? embeddings : undefined,
      });

      return NextResponse.json({ saved: true });
    }

    // Mode: interview — AI asks smart follow-up questions
    if (mode === 'interview') {
      const QUESTIONS = [
        "What is your name, what do you do, and where are you based?",
        "What are you currently building or working on?",
        "What problems do you solve for people and who is your ideal audience?",
        "What are your top skills or areas of expertise?",
        "How can people contact you or work with you?",
      ];
      const ACKS = [
        "Got it!",
        "Nice!",
        "Love that.",
        "Great to know!",
        "Perfect.",
      ];
      const exchangeCount = messages.filter((m) => m.role === 'user').length;

      if (messages.length === 0) {
        return NextResponse.json({ content: 'Hi! I will ask you 5 quick questions to train your AI. ' + QUESTIONS[0] });
      }

      if (exchangeCount >= QUESTIONS.length) {
        return NextResponse.json({ content: 'SAVE_READY Amazing! I have everything I need. Tap Save to train your AI now.' });
      }

      const ack = ACKS[exchangeCount - 1] || 'Got it!';
      const nextQ = QUESTIONS[exchangeCount];
      const content = ack + ' ' + nextQ;
      return NextResponse.json({ content });
    }

    // Mode: second brain — save any thought/note as knowledge
    if (mode === 'brain') {
      const { thought } = await req.json().catch(() => ({ thought: '' }));
      const textToSave = thought || (messages[messages.length - 1]?.content ?? '');
      if (!textToSave) return NextResponse.json({ content: 'Nothing to save.' });

      let embeddings: number[] = [];
      try {
        const chunks = chunkText(textToSave);
        embeddings = await generateEmbeddings(chunks.join(' '));
      } catch {}

      await convex.mutation(api.knowledge.createKnowledge, {
        userId,
        title: 'Brain Dump: ' + textToSave.slice(0, 60),
        content: textToSave,
        embeddings: embeddings.length > 0 ? embeddings : undefined,
      });

      // Ask AI to acknowledge and suggest a follow-up
      const brainSystem = 'The user just saved a note to their personal knowledge base. Acknowledge it in one warm sentence and ask one smart question to help them expand on this thought. Be brief and curious.';
      const content = await callGemini(brainSystem, messages, 150);
      return NextResponse.json({ content, saved: true });
    }

    // Default: general dashboard assistant
    const content = await callGemini(system, messages, 500);
    return NextResponse.json({ content });

  } catch (error) {
    console.error('Dashboard AI error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
