const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const CHAT_MODEL = 'gemini-2.5-flash';
const EMBED_MODEL = 'gemini-embedding-001';

// Chunk by WORDS not characters — more accurate for semantic search
export function chunkText(text: string, wordSize = 200, overlap = 50): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= wordSize) return [words.join(' ')];

  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + wordSize).join(' ');
    if (chunk.trim().length > 20) chunks.push(chunk);
    if (i + wordSize >= words.length) break;
    i += wordSize - overlap;
  }
  return chunks;
}

export async function generateEmbeddings(content: string): Promise<number[]> {
  if (!GEMINI_API_KEY) return [];
  try {
    const res = await fetch(`${GEMINI_BASE}/${EMBED_MODEL}:embedContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text: content }] },
        taskType: 'RETRIEVAL_QUERY',
      }),
    });
    const data = await res.json();
    return data.embedding?.values || [];
  } catch (error) {
    console.error('Gemini embedding error:', error);
    return [];
  }
}

export interface ProfileContext {
  displayName?: string;
  bio?: string;
  welcomeMessage?: string;
  username?: string;
}

export async function generateAnswer(
  question: string,
  chunks: string[],
  profile?: ProfileContext
): Promise<string> {

  // Try Groq first — it is free and fast
  if (GROQ_API_KEY) {
    try {
      return await generateAnswerGroq(question, chunks, profile);
    } catch (groqError) {
      console.error('Groq primary failed, falling back to Gemini:', groqError);
    }
  }

  if (!GEMINI_API_KEY) return 'AI is not configured yet.';

  try {
    const name = profile?.displayName || profile?.username || 'the owner';
    const bio = profile?.bio || '';
    const welcome = profile?.welcomeMessage || '';

    const context = chunks.length > 0
      ? chunks.join('\n\n---\n\n')
      : '';

    // Dynamic token limit
    const wordCount = question.split(' ').length;
    const maxTokens = wordCount > 15 ? 250 : wordCount > 8 ? 180 : 120;

    const prompt = `You are ${name}. A visitor is asking you a question on your personal AI space. Answer as yourself — in your own voice, naturally, like you are personally replying.

${bio ? `About you: ${bio}` : ''}
${welcome ? `Your usual tone: ${welcome}` : ''}

Rules:
- Speak in first person as ${name} — say "I", "my", "me"
- Be warm, direct and specific — reference real details from your knowledge
- No markdown — no bold, no bullet points, no headers
- Write like a real person texting back, not a report
- If the answer is not in your knowledge, say exactly: "I don't have details on that yet — feel free to reach out to me directly"
- Never say "based on the knowledge" or "according to the information" — just answer naturally
- Keep it focused, 2 to 4 sentences unless the question needs more

${context ? `Your knowledge:\n${context}` : 'You have no knowledge uploaded yet — tell the visitor to check back soon.'}

Visitor asks: ${question}

Reply as ${name}:`;

    const res = await fetch(`${GEMINI_BASE}/${CHAT_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
      }),
    });

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const raw = candidate?.content?.parts?.[0]?.text || '';
    const finishReason = candidate?.finishReason;
    const tokenCount = data.usageMetadata?.candidatesTokenCount ?? 0;

    if (!raw) throw new Error('Gemini empty response');
    if (finishReason === 'MAX_TOKENS' && tokenCount < 50) throw new Error('Gemini rate limited');

    const cleaned = raw
      .replace(/\*\*/g, '')
      .replace(/^#{1,6}\s/gm, '')
      .replace(/^\*\s/gm, '')
      .replace(/^-\s/gm, '')
      .replace(/__/g, '')
      .trim();

    // Quality check — retry with Groq if answer is too short
    if (cleaned.split(' ').length < 15) throw new Error('Answer too short');

    return cleaned;

  } catch (error) {
    console.error('Gemini answer error:', error);
    try {
      return await generateAnswerGroq(question, chunks, profile);
    } catch (groqError) {
      console.error('Groq fallback error:', groqError);
      return "Sorry, I could not generate an answer right now.";
    }
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ── Groq fallback ────────────────────────────────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateAnswerGroq(
  question: string,
  chunks: string[],
  profile?: ProfileContext
): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('No Groq key');

  const name = profile?.displayName || profile?.username || 'the owner';
  const bio = profile?.bio || '';
  const welcome = profile?.welcomeMessage || '';
  const context = chunks.length > 0 ? chunks.join('\n\n---\n\n') : '';

  const systemPrompt = `You are ${name}. A visitor is asking you a question on your personal AI space. Answer as yourself — in your own voice, naturally, like you are personally replying.

${bio ? `About you: ${bio}` : ''}
${welcome ? `Your usual tone: ${welcome}` : ''}

Rules:
- Speak in first person as ${name} — say "I", "my", "me"
- Be warm, direct and specific — reference real details from your knowledge
- No markdown — no bold, no bullet points, no headers
- Write like a real person texting back, not a report
- If the answer is not in your knowledge, say exactly: "I don't have details on that yet — feel free to reach out to me directly"
- Never say "based on the knowledge" or "according to the information" — just answer naturally
- Keep it focused, 2 to 4 sentences unless the question needs more

${context ? `Your knowledge:\n${context}` : 'You have no knowledge uploaded yet.'}`;

  const res = await fetch(GROQ_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '';

  return raw
    .replace(/\*\*/g, '')
    .replace(/^#{1,6}\s/gm, '')
    .replace(/^\*\s/gm, '')
    .replace(/^-\s/gm, '')
    .replace(/__/g, '')
    .trim();
}

// ── Generic completion (used by tools like the post generator) ─────────────
export async function generateCompletionGroq(prompt: string, maxTokens = 700): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('No Groq key');

  const res = await fetch(GROQ_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function generateCompletion(prompt: string): Promise<string> {
  if (GROQ_API_KEY) {
    try {
      return await generateCompletionGroq(prompt);
    } catch (groqError) {
      console.error('Groq completion failed, falling back to Gemini:', groqError);
    }
  }

  if (!GEMINI_API_KEY) throw new Error('No AI provider configured');

  const res = await fetch(`${GEMINI_BASE}/${CHAT_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 700, temperature: 0.8 },
    }),
  });

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!raw) throw new Error('Gemini empty response');
  return raw;
}
