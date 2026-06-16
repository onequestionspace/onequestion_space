const fs = require('fs');
let gemini = fs.readFileSync('lib/gemini.ts', 'utf8');

gemini = gemini.replace(
  '- Answer in 1-2 sentences maximum. Be direct and concise.\n- Never exceed 50 words.',
  '- Answer in 2-4 sentences. Be informative but concise.\n- Never exceed 120 words.'
);

gemini = gemini.replace(
  'Answer (max 50 words):',
  'Answer (max 120 words):'
);

fs.writeFileSync('lib/gemini.ts', gemini);
console.log('prompt updated to 120 words');
