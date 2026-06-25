const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const key = env.match(/GROQ_API_KEY=(.+)/)[1].trim();

fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + key,
  },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
    max_tokens: 50,
  }),
})
.then(r => r.json())
.then(d => console.log(d.choices?.[0]?.message?.content))
.catch(e => console.error('Error:', e));
