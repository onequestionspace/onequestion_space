import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateCompletion } from "@/lib/gemini";
import { enforceRateLimit } from '@/lib/server-rate-limit';

const VOICE_GUIDE = `
You write build-in-public posts for a 19-year-old solo founder from Kaduna, Nigeria
building "One Question" — an AI-powered personal Q&A platform — entirely from an
Android phone using Termux. His voice on X (@Asym_Alwali) is:
- Short sentences. Plain, direct, no fluff.
- Honest about the grind — no fake hype, no inflated metrics.
- Occasionally uses line breaks for rhythm/emphasis, like a manifesto.
- Talks about building solo, AI as a tool (Claude for code, Groq/Gemini for the product),
  and the $0 to $10k MRR journey in public.
- Avoids corny startup-bro language. Sounds like a real person typing from their phone,
  not a marketing team.
`;

function buildSinglePrompt(input: { work: string; metric: string; mood: string }) {
  return `${VOICE_GUIDE}

Task: Write 4 short X (Twitter) post drafts based on today's update below.
Return ONLY valid JSON, no markdown, no preamble, in this exact shape:
{"drafts":[{"label":"Reflection","body":"..."},{"label":"Process honesty","body":"..."},{"label":"Engagement hook","body":"..."},{"label":"Dev log","body":"..."}]}

Today's update: ${input.work}
${input.metric ? `Result/metric: ${input.metric}` : ""}
Mood/time of day: ${input.mood}

Each draft should be 2-5 short lines, in his voice. The "Engagement hook" draft should end
with a short question to the audience. Keep it real — no hashtags, no emojis unless it fits naturally.`;
}

function buildThreadPrompt(input: { work: string; metric: string; mood: string }) {
  return `${VOICE_GUIDE}

Task: Write a 4-5 tweet thread about today's update below.
Return ONLY valid JSON, no markdown, no preamble, in this exact shape:
{"thread":["tweet 1 text","tweet 2 text","tweet 3 text","tweet 4 text"]}

Today's update: ${input.work}
${input.metric ? `Result/metric: ${input.metric}` : ""}
Mood/time of day: ${input.mood}

Tweet 1 is a hook ending in "🧵". Then walk through: the problem, how it was debugged,
the fix, and the lesson learned. Keep each tweet under 280 characters, in his voice.`;
}

function summarizeCommitsPrompt(commits: string) {
  return `Below is raw git log output. Summarize it in one or two plain-English sentences
describing what was worked on, written like a developer casually describing their day —
no jargon dump, no bullet list, just plain prose.

Git log:
${commits}`;
}

function extractJson(raw: string): any {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rate = await enforceRateLimit(req, 'post-generator', 10, 60 * 1000);
    if ('unavailable' in rate) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    if (!rate.allowed) return NextResponse.json({ error: 'Too many requests' }, {
      status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) },
    });

    const body = await req.json();
    const { mode, work, commits, metric, mood, postType } = body;

    let workDescription = work;

    if (mode === "commits") {
      workDescription = await generateCompletion(summarizeCommitsPrompt(commits));
    }

    const prompt =
      postType === "thread"
        ? buildThreadPrompt({ work: workDescription, metric, mood })
        : buildSinglePrompt({ work: workDescription, metric, mood });

    const raw = await generateCompletion(prompt);
    const parsed = extractJson(raw);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("post-generator error:", err);
    return NextResponse.json({ error: "Failed to generate posts" }, { status: 500 });
  }
}
