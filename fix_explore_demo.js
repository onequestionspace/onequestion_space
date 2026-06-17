const fs = require('fs');

let route = fs.readFileSync('app/api/explore/route.ts', 'utf8');

route = route.replace(
  `const { question, history, knowledgeOverride } = await req.json();`,
  `const { question, history, knowledgeOverride, demoMode } = await req.json();`
);

route = route.replace(
  `const wordCount = question.split(' ').length;
    const maxTokens = wordCount > 15 ? 600 : 350;`,
  `const wordCount = question.split(' ').length;
    const maxTokens = demoMode ? 60 : wordCount > 15 ? 600 : 350;`
);

route = route.replace(
  `const systemPrompt = \`You are the Knowledge Explorer AI for One Question. Answer questions about One Question, bootstrapping, building in public, AI, and startup building using the knowledge below. Be insightful, energetic and direct. You can go beyond the knowledge base for general startup/AI questions but always tie it back to One Question's story.`,
  `const systemPrompt = \`You are the Knowledge Explorer AI for One Question. Answer questions about One Question, bootstrapping, building in public, AI, and startup building using the knowledge below. Be insightful, energetic and direct.\${demoMode ? ' Keep your answer to 1-2 sentences max — sharp and punchy.' : ' You can go beyond the knowledge base for general startup/AI questions but always tie it back to One Question\'s story.'}`
);

fs.writeFileSync('app/api/explore/route.ts', route);
console.log('✅ Explore route — demoMode short answers');
