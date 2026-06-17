const fs = require('fs');

let route = fs.readFileSync('app/api/explore/route.ts', 'utf8');

// Replace the broken systemPrompt line entirely
const oldPrompt = /const systemPrompt = `.*?`;/s;

const newPrompt = `const systemPrompt = demoMode
      ? \`You are the Knowledge Explorer AI for One Question. Answer questions using the knowledge below. Be energetic and direct. Keep your answer to 1-2 sentences max — sharp and punchy.\\n\\nKNOWLEDGE BASE:\\n\${activeKnowledge}\`
      : \`You are the Knowledge Explorer AI for One Question. Answer questions about One Question, bootstrapping, building in public, AI, and startup building using the knowledge below. Be insightful, energetic and direct. You can go beyond the knowledge base for general startup and AI questions but always tie it back to One Question story.\\n\\nKNOWLEDGE BASE:\\n\${activeKnowledge}\`;`;

route = route.replace(oldPrompt, newPrompt);

fs.writeFileSync('app/api/explore/route.ts', route);
console.log('✅ Explore route — syntax fixed');
