const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const CHAT_MODEL = 'gemini-2.5-flash';
const EMBED_MODEL = 'gemini-embedding-001';

export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize).trim());
    i += chunkSize - overlap;
  }
  return chunks.filter(c => c.length > 20);
}

export async function generateEmbeddings(content: string): Promise<number[]> {
  if (!GEMINI_API_KEY) return [];
  try {
    const res = await fetch(`${GEMINI_BASE}/${EMBED_MODEL}:embedContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text: content }] }
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

export async function generateAnswer(question: string, chunks: string[], profile?: ProfileContext): Promise<string> {
  if (!GEMINI_API_KEY) return 'AI is not configured yet.';
  try {
    const context = chunks.length > 0
      ? chunks.join('\n\n---\n\n')
      : 'No knowledge base uploaded yet.';

    const name = profile?.displayName || profile?.username || 'the owner';
    const bio = profile?.bio ? `About them: ${profile.bio}` : '';
    const tone = profile?.welcomeMessage ? `Their style: ${profile.welcomeMessage}` : '';

    // Dynamic token limit based on question complexity
    const wordCount = question.split(' ').length;
    const maxTokens = wordCount > 15 ? 300 : wordCount > 8 ? 200 : 150;

    const prompt = `You are the personal AI for ${name}. Your job is to answer visitor questions on their behalf, using only what you know from their knowledge base.

Critical formatting rules:
- Never use markdown — no **bold**, no ##headers, no bullet lists
- Write in plain conversational sentences only
- Keep it natural like a real person texting back

Personality:
- Speak in first person as if you are ${name}
- Be warm, direct and helpful
- Match the tone of their bio and welcome message
${bio}
${tone}

Rules:
- Only use information from the knowledge base below
- If the answer is not in the knowledge base, say: "I don't have details on that yet — feel free to reach out to me directly."
- Never make up facts or invent details
- Keep answers focused and natural — not robotic

Knowledge Base:
${context}

Visitor question: ${question}

Reply as ${name}:`;

    const res = await fetch(`${GEMINI_BASE}/${CHAT_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 }
      }),
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry I couldn't generate an answer right now.";
  } catch (error) {
    console.error('Gemini answer error:', error);
    return "Sorry I couldn't generate an answer right now.";
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length) return 0;
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}
