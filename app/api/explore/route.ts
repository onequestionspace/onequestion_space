import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { generateEmbeddings, rankKnowledge } from '@/lib/gemini';
import { PRIMARY_FOUNDER_USER_ID } from '@/convex/userIds';
import { enforceRateLimit } from '@/lib/server-rate-limit';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.5-flash';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const FALLBACK_KNOWLEDGE = `
One Question is an AI-powered personal Q&A platform built by Asym Alwali, a 19-year-old CS student from Yobe, Nigeria. He builds entirely from an Android phone using Termux — no laptop.

HOW IT WORKS:
Users claim a username at onequestion.space, upload their knowledge (bio, FAQs, projects, services), and share their space link. Visitors ask questions and the AI answers instantly using the uploaded knowledge.

TECH STACK:
Next.js, Convex (real-time database), Clerk (auth), Gemini AI (answers + embeddings), Tailwind CSS, Vercel.

BOOTSTRAPPING PHILOSOPHY:
Built under extreme constraints — phone only, limited internet, no funding. Constraints force better decisions, faster shipping, sharper focus. Distribution beats code. Timing matters more than perfection. Build in public, ship fast, charge early.

PRICING:
Free plan: 50 AI answers/month. Pro plan: 500 answers/month at dollar 9/month. Credits can also be purchased individually.

FOUNDER:
Asym Alwali (@Asym_Alwali on X). Co-founder: Paraja (@MuhammadParaja). Brand: Chimera. Building in public.

USE CASES:
Creators, founders, consultants, developers — anyone who wants to let AI answer questions about them 24/7 without manual effort.
`;

async function fetchLiveKnowledge(question: string): Promise<string> {
  try {
    // Fetch founder's knowledge + published blogs in parallel
    const [knowledgeItems, blogs] = await Promise.all([
      convex.query(api.knowledge.getPublicKnowledgeByUserId, { userId: PRIMARY_FOUNDER_USER_ID }),
      convex.query(api.blogs.getPublishedBlogs, {}),
    ]);

    const questionEmbedding = await generateEmbeddings(question);
    const candidates = [
      ...knowledgeItems,
      ...blogs.map((blog) => ({
        title: `Blog: ${blog.title}`,
        content: `${blog.excerpt}\n${blog.content.slice(0, 1000)}`,
      })),
    ];
    const top = rankKnowledge(question, questionEmbedding, candidates)
      .map((chunk) => `[${chunk.title}]\n${chunk.content}`)
      .join('\n\n---\n\n');

    if (!top) return FALLBACK_KNOWLEDGE;

    return top + '\n\n---\n\n' + FALLBACK_KNOWLEDGE;
  } catch (err) {
    console.error('fetchLiveKnowledge error:', err);
    return FALLBACK_KNOWLEDGE;
  }
}

async function callGroq(systemPrompt: string, contents: any[], maxTokens: number): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('No Groq key');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...contents.map((c: any) => ({
          role: c.role === 'model' ? 'assistant' : 'user',
          content: c.parts[0].text,
        })),
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });
  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  const rate = await enforceRateLimit(req, 'explore', 20, 60 * 1000);
  if ('unavailable' in rate) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfterSeconds) },
    });
  }

  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    const input = body as Record<string, unknown>;
    const question = typeof input.question === 'string' ? input.question.trim() : '';
    const demoMode = input.demoMode === true;
    const knowledgeOverride = typeof input.knowledgeOverride === 'string' && input.knowledgeOverride.length <= 12000
      ? input.knowledgeOverride
      : undefined;
    const rawHistory = Array.isArray(input.history) ? input.history.slice(-12) : [];
    if (!question || question.length > 2000) return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    const history = rawHistory
      .filter((m): m is { role: string; text: string } => !!m && typeof m === 'object'
        && 'text' in m && typeof m.text === 'string'
        && 'role' in m && (m.role === 'ai' || m.role === 'user'))
      .map((m) => ({ role: m.role, text: m.text.slice(0, 3000) }));

    const wordCount = question.split(/\s+/).length;
    const maxTokens = demoMode ? 80 : wordCount > 15 ? 600 : 350;

    const contents = [
      ...history.map((m) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: question }] },
    ];

    // Use live knowledge unless a bounded demo override was supplied.
    const activeKnowledge = knowledgeOverride || await fetchLiveKnowledge(question);

    const systemPrompt = demoMode
      ? `You are the Knowledge Explorer AI for One Question. Answer questions using the knowledge below. Be energetic and direct. Keep your answer to 1-2 sentences max — sharp and punchy.\n\nKNOWLEDGE BASE:\n${activeKnowledge}`
      : `You are the Knowledge Explorer AI for One Question. Answer questions about One Question, bootstrapping, building in public, AI, and startup building using the knowledge below. Be insightful, energetic and direct. You can go beyond the knowledge base for general startup and AI questions but always tie it back to the One Question story.\n\nKNOWLEDGE BASE:\n${activeKnowledge}`;

    // Try Gemini first, fall back to Groq
    let answer = '';
    try {
      const res = await fetch(`${GEMINI_BASE}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
        }),
      });
      const data = await res.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const tokenCount = data.usageMetadata?.candidatesTokenCount ?? 0;
      const finishReason = data.candidates?.[0]?.finishReason;
      if (!raw || (finishReason === 'MAX_TOKENS' && tokenCount < 50)) throw new Error('Gemini limited');
      answer = raw;
    } catch {
      try {
        answer = await callGroq(systemPrompt, contents, maxTokens);
      } catch {
        answer = 'I could not generate an answer right now. Try rephrasing.';
      }
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Explore error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
