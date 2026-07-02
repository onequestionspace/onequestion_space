const fs = require('fs');
const path = 'app/api/ask/route.ts';
let content = fs.readFileSync(path, 'utf8');

// Patch 1: similarity threshold
const old1 = `    const scoredChunks = knowledgeChunks
      .filter(k => k.embeddings && k.embeddings.length > 0)
      .map(k => ({
        ...k,
        score: cosineSimilarity(questionEmbedding, k.embeddings!)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const topChunks = scoredChunks.map(k => k.content);`;

const next1 = `    const SIMILARITY_THRESHOLD = 0.55;

    const scoredChunks = knowledgeChunks
      .filter(k => k.embeddings && k.embeddings.length > 0)
      .map(k => ({
        ...k,
        score: cosineSimilarity(questionEmbedding, k.embeddings!)
      }))
      .sort((a, b) => b.score - a.score)
      .filter(k => k.score >= SIMILARITY_THRESHOLD)
      .slice(0, 5);

    const topChunks = scoredChunks.map(k => k.content);

    if (topChunks.length === 0) {
      const fallbackAnswer = "I don't have details on that yet — feel free to reach out to me directly";
      await convex.mutation(api.questions.createQuestion, {
        profileId: profile._id,
        visitorId: visitorEmail || visitorName || 'anonymous',
        question,
        answer: fallbackAnswer,
        isAnswered: true,
        needsReview: true,
        createdAt: Date.now(),
        answeredAt: Date.now(),
      });
      await convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id });
      return NextResponse.json({
        success: true,
        data: { question, answer: fallbackAnswer }
      }, { status: 200 });
    }`;

if (!content.includes(old1)) {
  console.error('❌ Pattern 1 not found — aborting.');
  process.exit(1);
}
if (content.includes('SIMILARITY_THRESHOLD')) {
  console.log('⚠️ Already patched — skipping.');
  process.exit(0);
}
content = content.replace(old1, next1);
fs.writeFileSync(path, content);
console.log('✅ Similarity threshold + empty-fallback (auto-flagged for review) patched.');
