const fs = require('fs');

let gemini = fs.readFileSync('lib/gemini.ts', 'utf8');

// 1. Slash token limits on Gemini
gemini = gemini.replace(
  '    const maxTokens = wordCount > 15 ? 800 : wordCount > 8 ? 600 : 400;',
  '    const maxTokens = wordCount > 15 ? 250 : wordCount > 8 ? 180 : 120;'
);

// 2. Make generateAnswer try Groq FIRST, Gemini as fallback
// Replace the entire generateAnswer function structure
gemini = gemini.replace(
  `export async function generateAnswer(
  question: string,
  chunks: string[],
  profile?: ProfileContext
): Promise<string> {
  if (!GEMINI_API_KEY) return 'AI is not configured yet.';

  try {`,
  `export async function generateAnswer(
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

  try {`
);

// 3. Fix Groq max_tokens — tighter
gemini = gemini.replace(
  '      max_tokens: 1024,',
  '      max_tokens: 300,'
);

fs.writeFileSync('lib/gemini.ts', gemini);
console.log('1 AI adapter fixed — Groq primary, Gemini fallback, embeddings only on Gemini');
console.log('2 Token limits slashed');
