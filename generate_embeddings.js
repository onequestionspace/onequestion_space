const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const GEMINI_KEY = env.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
const CONVEX_URL = env.match(/NEXT_PUBLIC_CONVEX_URL=(.+)/)?.[1]?.trim();
const USER_ID = 'user_3F118mAkXaQli58Mzi4mEaWoxLG';

function post(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function getEmbedding(text) {
  const res = await post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_KEY}`,
    { model: 'models/gemini-embedding-001', content: { parts: [{ text }] } }
  );
  if (res.error) { console.error('Embedding error:', res.error.message); return []; }
  return res.embedding?.values || [];
}

async function main() {
  console.log('Fetching knowledge...');
  const result = await post(`${CONVEX_URL}/api/query`, {
    path: 'knowledge:getKnowledgeByUserId',
    args: { userId: USER_ID },
  });

  const items = result.value || [];
  console.log(`Found ${items.length} knowledge items`);

  for (const item of items) {
    console.log(`Processing: ${item.title}`);
    const embeddings = await getEmbedding(item.content);
    if (embeddings.length === 0) { console.log('Skipping - no embedding'); continue; }

    await post(`${CONVEX_URL}/api/mutation`, {
      path: 'knowledge:updateKnowledge',
      args: { id: item._id, embeddings },
    });

    console.log(`Done: ${item.title} - ${embeddings.length} dims`);
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('All embeddings generated!');
}

main().catch(console.error);
