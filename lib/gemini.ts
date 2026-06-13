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

export async function generateAnswer(question: string, chunks: string[]): Promise<string> {
  if (!GEMINI_API_KEY) return 'AI is not configured yet.';
  try {
    const context = chunks.length > 0
      ? chunks.join('\n\n---\n\n')
      : 'No knowledge base uploaded yet.';

    const prompt = `You are a helpful AI assistant representing the owner of this page. Answer the question using ONLY the knowledge provided below. If the answer is not in the knowledge base say "I don't have information about that yet."

Knowledge Base:
${context}

Question: ${question}

Answer concisely in 2-3 sentences:`;

    const res = await fetch(`${GEMINI_BASE}/${CHAT_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
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
