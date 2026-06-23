const fs = require('fs');

let gemini = fs.readFileSync('lib/gemini.ts', 'utf8');

// 1. Fix token limits
gemini = gemini.replace(
  '    const maxTokens = wordCount > 15 ? 600 : wordCount > 8 ? 400 : 250;',
  '    const maxTokens = wordCount > 15 ? 300 : wordCount > 8 ? 200 : 150;'
);

// 2. Add no-markdown instruction
gemini = gemini.replace(
  'Personality:',
  'Critical formatting rules:\n- Never use markdown — no **bold**, no ##headers, no bullet lists\n- Write in plain conversational sentences only\n- Keep it natural like a real person texting back\n\nPersonality:'
);

// 3. Fix strict rules
gemini = gemini.replace(
  '- Use the knowledge base as your primary source\n- Use relevant context even if it only partially answers the question\n- If something is genuinely not in the knowledge base, say it naturally and suggest reaching out\n- No fabrication but use reasonable inference from what you know',
  '- Use the knowledge base as your primary source\n- Use context even if it only partially answers\n- If not covered, say so naturally and suggest reaching out\n- No fabrication but use reasonable inference'
);

fs.writeFileSync('lib/gemini.ts', gemini);
console.log('done');
