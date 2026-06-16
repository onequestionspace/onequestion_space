const fs = require('fs');

fs.mkdirSync('app/api/dashboard-ai', { recursive: true });

const route = [
  "import { NextRequest, NextResponse } from 'next/server';",
  "import { auth } from '@clerk/nextjs/server';",
  "",
  "const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;",
  "const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';",
  "const MODEL = 'gemini-2.5-flash';",
  "",
  "export async function POST(req: NextRequest) {",
  "  try {",
  "    const { userId } = await auth();",
  "    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });",
  "",
  "    const { messages, system } = await req.json();",
  "",
  "    const contents = messages.map((m: any) => ({",
  "      role: m.role === 'assistant' ? 'model' : 'user',",
  "      parts: [{ text: m.content }],",
  "    }));",
  "",
  "    const res = await fetch(GEMINI_BASE + '/' + MODEL + ':generateContent?key=' + GEMINI_API_KEY, {",
  "      method: 'POST',",
  "      headers: { 'Content-Type': 'application/json' },",
  "      body: JSON.stringify({",
  "        system_instruction: { parts: [{ text: system }] },",
  "        contents,",
  "        generationConfig: { maxOutputTokens: 500, temperature: 0.7 },",
  "      }),",
  "    });",
  "",
  "    const data = await res.json();",
  "    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry I could not generate a response.';",
  "",
  "    return NextResponse.json({ content });",
  "  } catch (error) {",
  "    console.error('Dashboard AI error:', error);",
  "    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });",
  "  }",
  "}",
].join('\n');

fs.writeFileSync('app/api/dashboard-ai/route.ts', route);
console.log('done');
