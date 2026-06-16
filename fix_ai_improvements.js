const fs = require('fs');

// 1. Fix gemini.ts — dynamic tokens + better prompt
let gemini = fs.readFileSync('lib/gemini.ts', 'utf8');

gemini = gemini.replace(
  `export async function generateAnswer(question: string, chunks: string[], profile?: ProfileContext): Promise<string> {
  if (!GEMINI_API_KEY) return 'AI is not configured yet.';
  try {
    const context = chunks.length > 0
      ? chunks.join('\\n\\n---\\n\\n')
      : 'No knowledge base uploaded yet.';

    const name = profile?.displayName || profile?.username || 'the owner';
    const bio = profile?.bio ? \`Bio: \${profile.bio}\` : '';
    const tone = profile?.welcomeMessage ? \`Tone guidance: \${profile.welcomeMessage}\` : '';

    const prompt = \`You are an AI assistant for \${name}. Answer questions on their behalf using ONLY the knowledge base below.

Rules:
- Answer in 2-4 sentences. Be informative but concise.
- Never exceed 120 words.
- If the answer is not in the knowledge base, say exactly: "I don't have information about that yet."
- Do not make up information.
- Speak as if you represent \${name} directly.
\${bio}
\${tone}

Knowledge Base:
\${context}

Question: \${question}

Answer (max 120 words):\`;

    const res = await fetch(\`\${GEMINI_BASE}/\${CHAT_MODEL}:generateContent?key=\${GEMINI_API_KEY}\`, {
      method: 'POST',`,
  `export async function generateAnswer(question: string, chunks: string[], profile?: ProfileContext): Promise<string> {
  if (!GEMINI_API_KEY) return 'AI is not configured yet.';
  try {
    const context = chunks.length > 0
      ? chunks.join('\\n\\n---\\n\\n')
      : 'No knowledge base uploaded yet.';

    const name = profile?.displayName || profile?.username || 'the owner';
    const bio = profile?.bio ? \`About them: \${profile.bio}\` : '';
    const tone = profile?.welcomeMessage ? \`Their style: \${profile.welcomeMessage}\` : '';

    // Dynamic token limit based on question complexity
    const wordCount = question.split(' ').length;
    const maxTokens = wordCount > 15 ? 600 : wordCount > 8 ? 400 : 250;

    const prompt = \`You are the personal AI for \${name}. Your job is to answer visitor questions on their behalf, using only what you know from their knowledge base.

Personality:
- Speak in first person as if you are \${name}
- Be warm, direct and helpful
- Match the tone of their bio and welcome message
\${bio}
\${tone}

Rules:
- Only use information from the knowledge base below
- If the answer is not in the knowledge base, say: "I don't have details on that yet — feel free to reach out to me directly."
- Never make up facts or invent details
- Keep answers focused and natural — not robotic

Knowledge Base:
\${context}

Visitor question: \${question}

Reply as \${name}:\`;

    const res = await fetch(\`\${GEMINI_BASE}/\${CHAT_MODEL}:generateContent?key=\${GEMINI_API_KEY}\`, {
      method: 'POST',`
);

// Update generationConfig to use dynamic maxTokens
gemini = gemini.replace(
  "        generationConfig: { maxOutputTokens: 400, temperature: 0.3 }",
  "        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 }"
);

fs.writeFileSync('lib/gemini.ts', gemini);
console.log('1 gemini.ts improved — dynamic tokens + better prompt');

// 2. Fix Knowledge Explorer — dedicated API route
fs.mkdirSync('app/api/explore', { recursive: true });

const exploreRoute = [
  "import { NextRequest, NextResponse } from 'next/server';",
  "",
  "const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;",
  "const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';",
  "const MODEL = 'gemini-2.5-flash';",
  "",
  "const KNOWLEDGE = `",
  "One Question is an AI-powered personal Q&A platform built by Asym Alwali, a 19-year-old CS student from Kaduna, Nigeria. He builds entirely from an Android phone using Termux — no laptop.",
  "",
  "HOW IT WORKS:",
  "Users claim a username at onequestion.space, upload their knowledge (bio, FAQs, projects, services), and share their space link. Visitors ask questions and the AI answers instantly using the uploaded knowledge.",
  "",
  "TECH STACK:",
  "Next.js, Convex (real-time database), Clerk (auth), Gemini AI (answers + embeddings), Tailwind CSS, Vercel.",
  "",
  "BOOTSTRAPPING PHILOSOPHY:",
  "Built under extreme constraints — phone only, limited internet, no funding. Constraints force better decisions, faster shipping, sharper focus. Distribution beats code. Timing matters more than perfection. Build in public, ship fast, charge early.",
  "",
  "PRICING:",
  "Free plan: 50 AI answers/month. Pro plan: 500 answers/month at dollar 9/month. Credits can also be purchased individually.",
  "",
  "FOUNDER:",
  "Asym Alwali (@Asym_Alwali on X). Co-founder: Paraja (@MuhammadParaja). Brand: Chimera. Building in public.",
  "",
  "USE CASES:",
  "Creators, founders, consultants, developers — anyone who wants to let AI answer questions about them 24/7 without manual effort.",
  "`;",
  "",
  "export async function POST(req: NextRequest) {",
  "  try {",
  "    const { question, history } = await req.json();",
  "    if (!question) return NextResponse.json({ error: 'Missing question' }, { status: 400 });",
  "",
  "    const wordCount = question.split(' ').length;",
  "    const maxTokens = wordCount > 15 ? 600 : 350;",
  "",
  "    const contents = [",
  "      ...(history || []).map((m: any) => ({",
  "        role: m.role === 'ai' ? 'model' : 'user',",
  "        parts: [{ text: m.text }],",
  "      })),",
  "      { role: 'user', parts: [{ text: question }] },",
  "    ];",
  "",
  "    const systemPrompt = `You are the Knowledge Explorer AI for One Question. Answer questions about One Question, bootstrapping, building in public, AI, and startup building using the knowledge below. Be insightful, energetic and direct. You can go beyond the knowledge base for general startup/AI questions but always tie it back to One Question's story.\\n\\nKNOWLEDGE BASE:\\n${KNOWLEDGE}`;",
  "",
  "    const res = await fetch(GEMINI_BASE + '/' + MODEL + ':generateContent?key=' + GEMINI_API_KEY, {",
  "      method: 'POST',",
  "      headers: { 'Content-Type': 'application/json' },",
  "      body: JSON.stringify({",
  "        system_instruction: { parts: [{ text: systemPrompt }] },",
  "        contents,",
  "        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },",
  "      }),",
  "    });",
  "",
  "    const data = await res.json();",
  "    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate an answer. Try rephrasing.';",
  "",
  "    return NextResponse.json({ answer });",
  "  } catch (error) {",
  "    console.error('Explore error:', error);",
  "    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });",
  "  }",
  "}",
].join('\n');

fs.writeFileSync('app/api/explore/route.ts', exploreRoute);
console.log('2 Knowledge Explorer API route created');

// 3. Update blog page to use /api/explore instead of /api/ask
let blog = fs.readFileSync('app/blog/page.tsx', 'utf8');
blog = blog.replace(
  "      const res = await fetch('/api/ask', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ question: q, username: 'onequestion_team', context: 'blog_knowledge_base' }),\n      });\n      const data = await res.json();\n      setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'Great question. I am still learning. Try asking something else.' }]);",
  "      const res = await fetch('/api/explore', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ question: q, history: messages }),\n      });\n      const data = await res.json();\n      setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'Great question. I am still learning. Try asking something else.' }]);"
);
fs.writeFileSync('app/blog/page.tsx', blog);
console.log('3 Blog page now uses /api/explore');
