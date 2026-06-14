const fs = require('fs');

// 1. Update lib/gemini.ts — dynamic prompt + token limit
let gemini = fs.readFileSync('lib/gemini.ts', 'utf8');

gemini = gemini.replace(
  'export async function generateAnswer(question: string, chunks: string[]): Promise<string> {\n  if (!GEMINI_API_KEY) return \'AI is not configured yet.\';\n  try {\n    const context = chunks.length > 0\n      ? chunks.join(\'\\n\\n---\\n\\n\')\n      : \'No knowledge base uploaded yet.\';\n\n    const prompt = `You are a helpful AI assistant representing the owner of this page. Answer the question using ONLY the knowledge provided below. If the answer is not in the knowledge base say "I don\'t have information about that yet."\n\nKnowledge Base:\n${context}\n\nQuestion: ${question}\n\nAnswer concisely in 2-3 sentences:`;',
  `export interface ProfileContext {
  displayName?: string;
  bio?: string;
  welcomeMessage?: string;
  username?: string;
}

export async function generateAnswer(question: string, chunks: string[], profile?: ProfileContext): Promise<string> {
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
- Answer in 1-2 sentences maximum. Be direct and concise.
- Never exceed 50 words.
- If the answer is not in the knowledge base, say exactly: "I don't have information about that yet."
- Do not make up information.
- Speak as if you represent \${name} directly.
\${bio}
\${tone}

Knowledge Base:
\${context}

Question: \${question}

Answer (max 50 words):\`;`
);

// Fix closing of generateAnswer to add maxOutputTokens
gemini = gemini.replace(
  "      body: JSON.stringify({\n        contents: [{ parts: [{ text: prompt }] }]\n      }),",
  "      body: JSON.stringify({\n        contents: [{ parts: [{ text: prompt }] }],\n        generationConfig: { maxOutputTokens: 120, temperature: 0.3 }\n      }),"
);

fs.writeFileSync('lib/gemini.ts', gemini);
console.log('1 gemini.ts updated with dynamic prompt + token limit');

// 2. Update ask route to pass profile context
let ask = fs.readFileSync('app/api/ask/route.ts', 'utf8');

ask = ask.replace(
  "import { generateEmbeddings, generateAnswer, cosineSimilarity } from '@/lib/gemini';",
  "import { generateEmbeddings, generateAnswer, cosineSimilarity, ProfileContext } from '@/lib/gemini';"
);

ask = ask.replace(
  '    // 4. Generate answer with Gemini using context\n    const answer = await generateAnswer(question, topChunks);',
  `    // 4. Generate answer with Gemini using context + profile personality
    const profileContext: ProfileContext = {
      displayName: profile.displayName,
      bio: profile.bio,
      welcomeMessage: profile.welcomeMessage,
      username: profile.username,
    };
    const answer = await generateAnswer(question, topChunks, profileContext);`
);

fs.writeFileSync('app/api/ask/route.ts', ask);
console.log('2 ask route passes profile context to AI');
