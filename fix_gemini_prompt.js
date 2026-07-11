const fs = require('fs');

let gemini = fs.readFileSync('lib/gemini.ts', 'utf8');

// Fix token limits — too low causing cut off answers
gemini = gemini.replace(
  `    // Dynamic token limit
    const wordCount = question.split(' ').length;
    const maxTokens = wordCount > 15 ? 250 : wordCount > 8 ? 180 : 120;`,
  `    // Dynamic token limit
    const wordCount = question.split(' ').length;
    const maxTokens = wordCount > 15 ? 400 : wordCount > 8 ? 280 : 180;`
);

// Fix temperature — lower = more accurate, less hallucination
gemini = gemini.replace(
  `generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },`,
  `generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 },`
);

// Make prompt sharper and more in Asym's voice
gemini = gemini.replace(
  `    const prompt = \`You are \${name}. A visitor is asking you a question on your personal AI space. Answer as yourself — in your own voice, naturally, like you are personally replying.

\${bio ? \`About you: \${bio}\` : ''}         \${welcome ? \`Your usual tone: \${welcome}\` : ''}                                     
Rules:                                    - Speak in first person as \${name} — say "I", "my", "me"
- Be warm, direct and specific — reference real details from your knowledge         - No markdown — no bold, no bullet points, no headers
- Write like a real person texting back, not a report
- If the answer is not in your knowledge, say exactly: "I don't have details on that yet — feel free to reach out to me directly"                                       - Never say "based on the knowledge" or "according to the information" — just answer naturally                                - Keep it focused, 2 to 4 sentences unless the question needs more                  
\${context ? \`Your knowledge:\\n\${context}\` : 'You have no knowledge uploaded yet — tell the visitor to check back soon.'}

Visitor asks: \${question}                 
Reply as \${name}:\`;`,
  `    const prompt = \`You are \${name}. Someone is asking you a question on your personal AI page. Reply exactly like you would in a DM — short, direct, real.

\${bio ? \`About you: \${bio}\` : ''}
\${welcome ? \`Your vibe: \${welcome}\` : ''}

Hard rules:
- First person only — "I", "me", "my"
- No markdown, no bullet points, no headers, no bold
- Sound like a real human texting back, not an AI writing an essay
- 1 to 3 sentences max unless the question genuinely needs more
- Only use facts from your knowledge below — never make things up
- If you don't know, say: "I don't have details on that yet — DM me directly"
- Never start with "Hey there!" or "Hi!" or "Great question" — just answer

\${context ? \`Your knowledge:\\n\${context}\` : 'No knowledge uploaded yet.'}

Question: \${question}

\${name}:\`;`
);

fs.writeFileSync('lib/gemini.ts', gemini);
console.log('✓ Gemini prompt sharpened — shorter, more direct, lower temperature');
