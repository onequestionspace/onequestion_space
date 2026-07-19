import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getQuestionsByProfile = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    return await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .order('desc')
      .collect();
  },
});

export const getRecentQuestions = query({
  args: { profileId: v.id('profiles'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .order('desc')
      .take(args.limit ?? 5);
  },
});

export const getUnansweredQuestions = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    return await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .filter((q) => q.eq(q.field('isAnswered'), false))
      .collect();
  },
});

export const createQuestion = mutation({
  args: {
    profileId: v.id('profiles'),
    question: v.string(),
    answer: v.optional(v.string()),
    visitorId: v.optional(v.string()),
    isAnswered: v.optional(v.boolean()),
    needsReview: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    answeredAt: v.optional(v.number()),
    embeddings: v.optional(v.array(v.number())),
    goalAchieved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('questions', {
      profileId: args.profileId,
      question: args.question,
      answer: args.answer,
      visitorId: args.visitorId,
      isAnswered: args.isAnswered ?? false,
      needsReview: args.needsReview ?? false,
      createdAt: args.createdAt ?? Date.now(),
      answeredAt: args.answeredAt,
      embeddings: args.embeddings,
      goalAchieved: args.goalAchieved,
    });
  },
});

export const answerQuestion = mutation({
  args: { id: v.id('questions'), answer: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      answer: args.answer,
      isAnswered: true,
      answeredAt: Date.now(),
    });
  },
});

export const deleteQuestion = mutation({
  args: { id: v.id('questions') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const getAnsweredQuestionByText = query({
  args: { profileId: v.id('profiles'), question: v.string() },
  handler: async (ctx, args) => {
    const q = args.question.toLowerCase().trim();
    const results = await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .filter((row) => row.eq(row.field('isAnswered'), true))
      .collect();
    return results.find(r => r.question?.toLowerCase().trim() === q) || null;
  },
});

export const getSemanticMatch = query({
  args: { profileId: v.id('profiles'), embedding: v.array(v.number()) },
  handler: async (ctx, args) => {
    const results = await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .filter((row) => row.eq(row.field('isAnswered'), true))
      .collect();
    let best: typeof results[number] | null = null;
    let bestScore = 0;
    for (const r of results) {
      if (!r.answer || !r.embeddings?.length) continue;
      const a = args.embedding, b = r.embeddings;
      if (a.length !== b.length) continue;
      let dot = 0, magA = 0, magB = 0;
      for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; magA += a[i]*a[i]; magB += b[i]*b[i]; }
      const denom = Math.sqrt(magA) * Math.sqrt(magB);
      const score = denom === 0 ? 0 : dot / denom;
      if (score > bestScore) { bestScore = score; best = r; }
    }
    if (best && bestScore > 0.92) return best;
    return null;
  },
});

export const getVisitorGoalAchieved = query({
  args: { profileId: v.id('profiles'), visitorId: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .filter((row) => row.eq(row.field('visitorId'), args.visitorId))
      .collect();
    return results.some(r => r.goalAchieved === true);
  },
});

export const getVisitorEmails = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .order('desc')
      .collect();
    // Return unique emails only
    const emails = questions
      .map(q => q.visitorId)
      .filter((v): v is string => !!v && v.includes('@'));
    return Array.from(new Set(emails));
  },
});


export const listNeedsReview = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, { profileId }) => {
    return await ctx.db
      .query('questions')
      .withIndex('by_profileId_needsReview', (q) =>
        q.eq('profileId', profileId).eq('needsReview', true)
      )
      .order('desc')
      .collect();
  },
});

export const resolveQuestion = mutation({
  args: {
    id: v.id('questions'),
    correctedAnswer: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const q = await ctx.db.get(args.id);
    if (!q) return;
    await ctx.db.patch(args.id, {
      answer: args.correctedAnswer,
      isAnswered: true,
      needsReview: false,
      answeredAt: Date.now(),
    });
    await ctx.db.insert('knowledge', {
      userId: args.userId,
      title: q.question,
      content: args.correctedAnswer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
