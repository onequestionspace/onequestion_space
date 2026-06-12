import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const embedModel = genAI?.getGenerativeModel({ model: 'text-embedding-004' });
const chatModel = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk.trim());
    i += chunkSize - overlap;
  }
  return chunks.filter(c => c.length > 20);
}

export async function generateEmbeddings(content: string): Promise<number[]> {
  if (!embedModel) return [];
  try {
    const result = await embedModel.embedContent(content);
    return result.embedding.values;
  } catch (error) {
    console.error('Gemini embedding error:', error);
    return [];
  }
}

export async function generateAnswer(question: string, chunks: string[]): Promise<string> {
  if (!chatModel) return "AI is not configured yet. Please check back soon.";
  try {
    const context = chunks.join('\n\n---\n\n');
    const prompt = `You are a helpful AI assistant. Answer the question using ONLY the knowledge provided below. If the answer is not in the knowledge, say "I don't have information about that in my knowledge base."

Knowledge Base:
${context}

Question: ${question}

Answer concisely in 2-3 sentences:`;

    const result = await chatModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini answer error:', error);
    return "Sorry, I couldn't generate an answer right now.";
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
