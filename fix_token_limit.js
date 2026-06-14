const fs = require('fs');

let gemini = fs.readFileSync('lib/gemini.ts', 'utf8');

gemini = gemini.replace(
  'generationConfig: { maxOutputTokens: 120, temperature: 0.3 }',
  'generationConfig: { maxOutputTokens: 250, temperature: 0.3 }'
);

fs.writeFileSync('lib/gemini.ts', gemini);
console.log('token limit increased to 250');
