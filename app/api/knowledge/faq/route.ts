import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.5-flash';


async function callGemini(system: string, prompt: string) {
  const res = await fetch(`${GEMINI_BASE}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 2000, temperature: 0.3 },
    }),
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { getToken } = await auth();
    const token = await getToken({ template: 'convex' });
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    convex.setAuth(token);

    const { save } = await req.json().catch(() => ({ save: false }));

    const knowledge = await convex.query(api.knowledge.getKnowledgeByUserId, { userId });
    if (!knowledge || knowledge.length === 0) {
      return NextResponse.json({ success: true, data: { faqs: [], message: 'No knowledge to generate FAQs from.' } });
    }

    const allContent = knowledge.map(k => `Title: ${k.title}\nContent: ${k.content}`).join('\n\n---\n\n');
    const truncated = allContent.slice(0, 30000);

    const system = 'You are an expert at analyzing knowledge bases and generating helpful FAQ pairs. Return ONLY valid JSON.';
    const prompt = `Analyze this knowledge base content and generate the top 10 most likely questions visitors would ask, with clear answers based ONLY on the content provided.

Format your response as a JSON array of objects with "question" and "answer" fields. Keep answers concise (2-4 sentences). Only include questions that can be confidently answered from the content.

Knowledge Content:
${truncated}`;

    const raw = await callGemini(system, prompt);
    let faqs: { question: string; answer: string }[] = [];

    try {
      const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      faqs = JSON.parse(cleaned);
      if (!Array.isArray(faqs)) throw new Error('Not an array');
    } catch {
      const matches = raw.match(/"question"\s*:\s*"([^"]+)"\s*,\s*"answer"\s*:\s*"([^"]+)"/g);
      if (matches) {
        faqs = matches.map((m: string) => {
          const q = m.match(/"question"\s*:\s*"([^"]+)"/)?.[1] || '';
          const a = m.match(/"answer"\s*:\s*"([^"]+)"/)?.[1] || '';
          return { question: q, answer: a };
        });
      }
    }

    if (save && faqs.length > 0) {
      const faqContent = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
      await convex.mutation(api.knowledge.createKnowledge, {
        userId,
        title: 'Auto-generated FAQ',
        content: faqContent,
        sourceType: 'personal',
      });
    }

    return NextResponse.json({ success: true, data: { faqs, count: faqs.length, saved: save } });
  } catch (error) {
    console.error('FAQ generator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
