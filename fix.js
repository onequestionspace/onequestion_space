const fs = require('fs');
let c = fs.readFileSync('app/api/chat-knowledge/route.ts', 'utf8');

// Add intent detection function after the imports
const intentDetector = `
// Intent detection — reads natural language and returns action type
function detectIntent(question: string): { intent: string; params: Record<string, string> } {
  const q = question.toLowerCase().trim();

  // Profile update intents
  if (/change my bio|update my bio|set my bio|my bio (is|should be|to)/i.test(q)) {
    const bio = question.replace(/^.*(bio|about me)[^:]*[:\-]?\s*/i, '').trim();
    return { intent: 'updateBio', params: { bio } };
  }
  if (/change my welcome|update my welcome|set my welcome|welcome message (is|should be|to)/i.test(q)) {
    const welcomeMessage = question.replace(/^.*(welcome message|greeting)[^:]*[:\-]?\s*/i, '').trim();
    return { intent: 'updateWelcome', params: { welcomeMessage } };
  }
  if (/change.*name|update.*name|my name is/i.test(q)) {
    const displayName = question.replace(/^.*(name)[^:]*[:\-]?\s*/i, '').trim();
    return { intent: 'updateName', params: { displayName } };
  }

  // Knowledge intents
  if (/save (this|it|that)|add (this|it|that) to (my )?knowledge|remember (this|that)/i.test(q)) {
    return { intent: 'saveKnowledge', params: {} };
  }
  if (/show (me )?(all )?my knowledge|list (my )?knowledge|what do (i|you) know/i.test(q)) {
    return { intent: 'listKnowledge', params: {} };
  }
  if (/what('s| is) missing|gaps? in my knowledge|what should i (add|upload)/i.test(q)) {
    return { intent: 'knowledgeGap', params: {} };
  }

  // Analytics intents
  if (/how many (questions|visitors|views)|my (stats|analytics|numbers)/i.test(q)) {
    return { intent: 'getAnalytics', params: {} };
  }
  if (/most asked|top questions|popular questions/i.test(q)) {
    return { intent: 'topQuestions', params: {} };
  }

  // Content generation intents
  if (/write (my|a|an) bio|generate (my|a) bio|create (my|a) bio/i.test(q)) {
    return { intent: 'generateBio', params: {} };
  }
  if (/write.*tweet|generate.*tweet|create.*tweet|x post|twitter post/i.test(q)) {
    return { intent: 'generateTweet', params: {} };
  }
  if (/write.*blog|generate.*blog|create.*blog post/i.test(q)) {
    return { intent: 'generateBlog', params: {} };
  }
  if (/create.*faq|generate.*faq|make.*faq/i.test(q)) {
    return { intent: 'generateFAQ', params: {} };
  }
  if (/improve.*welcome|better welcome|fix.*welcome/i.test(q)) {
    return { intent: 'improveWelcome', params: {} };
  }

  return { intent: 'chat', params: {} };
}
`;

// Insert intent detector before the POST handler
c = c.replace(
  'export async function POST(request: NextRequest) {',
  intentDetector + '\nexport async function POST(request: NextRequest) {'
);

// Add intent handling after the auth check and before knowledge fetch
c = c.replace(
  `    const knowledgeChunks = await convex.query(api.knowledge.getKnowledgeByUserId, { userId });
    const hasKnowledge = knowledgeChunks && knowledgeChunks.length > 0;

    // Memory Dump mode`,
  `    // Detect intent from natural language
    const { intent, params } = detectIntent(question || '');

    // Fetch profile + analytics for context
    const profile = await convex.query(api.profiles.byUsername, { username: '' }).catch(() => null);
    const userProfile = await convex.query(api.profiles.current).catch(() => null);

    // Handle profile update intents
    if (intent === 'updateBio' && params.bio && params.bio.length > 3) {
      await convex.mutation(api.profiles.update, { bio: params.bio }).catch(() => {});
      const stream = wrapTextAsStream(\`Done! I updated your bio to: "\${params.bio}". Your AI will now use this when answering questions about you.\`);
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
    }
    if (intent === 'updateWelcome' && params.welcomeMessage && params.welcomeMessage.length > 3) {
      await convex.mutation(api.profiles.update, { welcomeMessage: params.welcomeMessage }).catch(() => {});
      const stream = wrapTextAsStream(\`Done! Welcome message updated to: "\${params.welcomeMessage}". Visitors will see this on your space.\`);
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
    }
    if (intent === 'updateName' && params.displayName && params.displayName.length > 1) {
      await convex.mutation(api.profiles.update, { displayName: params.displayName }).catch(() => {});
      const stream = wrapTextAsStream(\`Done! Your display name is now "\${params.displayName}".\`);
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
    }

    const knowledgeChunks = await convex.query(api.knowledge.getKnowledgeByUserId, { userId });
    const hasKnowledge = knowledgeChunks && knowledgeChunks.length > 0;

    // List knowledge intent
    if (intent === 'listKnowledge') {
      const list = knowledgeChunks?.slice(0, 10).map((k, i) => \`\${i+1}. **\${k.title}** — \${k.content.slice(0,80)}...\`).join('\\n') || 'No knowledge uploaded yet.';
      const stream = wrapTextAsStream(\`Here are your knowledge items:\\n\\n\${list}\\n\\nYou have \${knowledgeChunks?.length || 0} items total.\`);
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
    }

    // Memory Dump mode`
);

// Add wrapTextAsStream helper before POST handler
c = c.replace(
  intentDetector + '\nexport async function POST(request: NextRequest) {',
  intentDetector + `
// Helper to wrap plain text as a streaming response
function wrapTextAsStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify({ type: 'content', text }) + '\\n'));
      controller.enqueue(encoder.encode(JSON.stringify({ type: 'done', sources: [] }) + '\\n'));
      controller.close();
    },
  });
}

export async function POST(request: NextRequest) {`
);

fs.writeFileSync('app/api/chat-knowledge/route.ts', c);
console.log('done');
