import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY not found in environment');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embedModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
const chatModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
  try {
    const result = await embedModel.embedContent(content);
    return result.embedding.values;
  } catch (error) {
    console.error('Gemini embedding error:', error);
    throw new Error('Failed to generate embeddings');
  }
}

export async function generateAnswer(question: string, chunks: string[]): Promise<string> {
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
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * b[i], 0));
  return dot / (magA * magB);
}
