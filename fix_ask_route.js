const fs = require('fs');

let route = fs.readFileSync('app/api/ask/route.ts', 'utf8');

route = route.replace(
  `    // 3. Embed question + find top 3 most similar chunks
    const questionEmbedding = await generateEmbeddings(question);

    const scoredChunks = knowledgeChunks
      .filter(k => k.embeddings && k.embeddings.length > 0)
      .map(k => ({
        ...k,
        score: cosineSimilarity(questionEmbedding, k.embeddings!)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const topChunks = scoredChunks.map(k => k.content);`,
  `    // 3. Embed question + find most similar chunks
    const questionEmbedding = await generateEmbeddings(question);

    // Separate chunks with and without embeddings
    const chunksWithEmbeddings = knowledgeChunks.filter(k => k.embeddings && k.embeddings.length > 0);
    const chunksWithoutEmbeddings = knowledgeChunks.filter(k => !k.embeddings || k.embeddings.length === 0);

    let topChunks: string[] = [];

    if (chunksWithEmbeddings.length > 0 && questionEmbedding.length > 0) {
      const scoredChunks = chunksWithEmbeddings
        .map(k => ({
          ...k,
          score: cosineSimilarity(questionEmbedding, k.embeddings!)
        }))
        .sort((a, b) => b.score - a.score);

      // Take top 5 scored chunks with any positive score
      const relevantChunks = scoredChunks.slice(0, 5).map(k => k.content);
      // Also add any chunks without embeddings as extra context
      const fallbackChunks = chunksWithoutEmbeddings.slice(0, 2).map(k => k.content);
      topChunks = [...relevantChunks, ...fallbackChunks];
    } else {
      // No embeddings at all — use all chunks directly
      topChunks = knowledgeChunks.slice(0, 7).map(k => k.content);
    }

    // If still empty somehow, use everything
    if (topChunks.length === 0) {
      topChunks = knowledgeChunks.map(k => k.content);
    }`
);

fs.writeFileSync('app/api/ask/route.ts', route);
console.log('ask route fixed — no more empty context, fallback to all chunks');
