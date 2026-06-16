import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.5-flash';

const KNOWLEDGE = `
One Question is an AI-powered personal Q&A platform built by Asym Alwali, a 19-year-old CS student from Kaduna, Nigeria. He builds entirely from an Android phone using Termux — no laptop.

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

export async function POST(req: NextRequest) {
  try {
    const { question, history, knowledgeOverride } = await req.json();
    if (!question) return NextResponse.json({ error: 'Missing question' }, { status: 400 });

    const wordCount = question.split(' ').length;
    const maxTokens = wordCount > 15 ? 600 : 350;

    const contents = [
      ...(history || []).map((m: any) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: question }] },
    ];

    const activeKnowledge = knowledgeOverride || KNOWLEDGE;
    const systemPrompt = `You are the Knowledge Explorer AI for One Question. Answer questions about One Question, bootstrapping, building in public, AI, and startup building using the knowledge below. Be insightful, energetic and direct. You can go beyond the knowledge base for general startup/AI questions but always tie it back to One Question's story.\n\nKNOWLEDGE BASE:\n${activeKnowledge}`;

    const res = await fetch(GEMINI_BASE + '/' + MODEL + ':generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
      }),
    });

    const data = await res.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate an answer. Try rephrasing.';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Explore error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}