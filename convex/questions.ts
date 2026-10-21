import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { MutationCtx, QueryCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';

async function assertProfileOwner(ctx: QueryCtx | MutationCtx, profileId: Id<'profiles'>) {
  const identity = await ctx.auth.getUserIdentity();
  const profile = await ctx.db.get(profileId);
  if (!identity || !profile || profile.userId !== identity.subject) {
    throw new Error('Not authorized to view these questions');
  }
}

export const getQuestionsByProfile = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await assertProfileOwner(ctx, args.profileId);
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

export const getMostAskedQuestions = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await assertProfileOwner(ctx, args.profileId);
    const recentQuestions = await ctx.db
      .query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .order('desc')
      .take(500);

    const counts = new Map<string, { question: string; count: number }>();
    for (const item of recentQuestions) {
      const normalized = item.question.trim().toLowerCase();
      if (!normalized) continue;
      const existing = counts.get(normalized);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(normalized, { question: item.question.trim(), count: 1 });
      }
    }

    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },
});

export const getUnansweredQuestions = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await assertProfileOwner(ctx, args.profileId);
    return await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .filter((q) => q.eq(q.field('isAnswered'), false))
      .collect();
  },
});

export const createQuestion = mutation({
  // Public visitor submission only. Callers cannot submit answers, embeddings,
  // timestamps, review flags, or goal-completion state.
  args: {
    profileId: v.id('profiles'),
    question: v.string(),
    visitorId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const question = args.question.trim();
    if (!question || question.length > 2000) throw new Error('Invalid question');
    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error('Profile not found');
    return await ctx.db.insert('questions', {
      profileId: args.profileId,
      question,
      visitorId: args.visitorId?.slice(0, 254),
      isAnswered: false,
      needsReview: false,
      createdAt: Date.now(),
    });
  },
});

export const recordGeneratedAnswer = mutation({
  // Called only by the trusted Next.js streaming route. Configure the same
  // high-entropy secret in Convex and Vercel as ONEQUESTION_STREAM_SECRET.
  args: {
    secret: v.string(),
    profileId: v.id('profiles'),
    question: v.string(),
    answer: v.string(),
    visitorId: v.optional(v.string()),
    embeddings: v.optional(v.array(v.number())),
    goalAchieved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const expected = process.env.ONEQUESTION_STREAM_SECRET;
    if (!expected || args.secret !== expected) throw new Error('Not authorized');
    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error('Profile not found');
    const question = args.question.trim();
    const answer = args.answer.trim();
    if (!question || question.length > 2000 || !answer || answer.length > 10000) {
      throw new Error('Invalid question or answer');
    }
    const now = Date.now();
    const id = await ctx.db.insert('questions', {
      profileId: args.profileId,
      question,
      answer,
      visitorId: args.visitorId?.slice(0, 254),
      isAnswered: true,
      needsReview: false,
      createdAt: now,
      answeredAt: now,
      embeddings: args.embeddings,
      goalAchieved: args.goalAchieved,
    });
    const analytics = await ctx.db.query('analytics')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (analytics) await ctx.db.patch(analytics._id, {
      totalQuestions: analytics.totalQuestions + 1,
      totalAnswers: analytics.totalAnswers + 1,
      updatedAt: now,
    });
    return id;
  },
});

export const recordPublicQuestion = mutation({
  args: {
    secret: v.string(),
    profileId: v.id('profiles'),
    question: v.string(),
    visitorId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expected = process.env.ONEQUESTION_STREAM_SECRET;
    if (!expected || args.secret !== expected) throw new Error('Not authorized');
    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error('Profile not found');
    const question = args.question.trim();
    if (!question || question.length > 2000) throw new Error('Invalid question');
    const now = Date.now();
    const id = await ctx.db.insert('questions', {
      profileId: args.profileId, question, visitorId: args.visitorId?.slice(0, 254),
      isAnswered: false, needsReview: false, createdAt: now,
    });
    const analytics = await ctx.db.query('analytics')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (analytics) await ctx.db.patch(analytics._id, {
      totalQuestions: analytics.totalQuestions + 1, updatedAt: now,
    });
    return id;
  },
});

export const answerQuestion = mutation({
  args: { id: v.id('questions'), answer: v.string() },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.id);
    if (!question) throw new Error('Question not found');
    await assertProfileOwner(ctx, question.profileId);
    await ctx.db.patch(args.id, {
      answer: args.answer,
      isAnswered: true,
      answeredAt: Date.now(),
    });
    return args.id;
  },
});

export const deleteQuestion = mutation({
  args: { id: v.id('questions') },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.id);
    if (!question) return null;
    await assertProfileOwner(ctx, question.profileId);
    await ctx.db.delete(args.id);
    return args.id;
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
    await assertProfileOwner(ctx, args.profileId);
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
    await assertProfileOwner(ctx, profileId);
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
  },
  handler: async (ctx, args) => {
    const q = await ctx.db.get(args.id);
    if (!q) throw new Error('Question not found');
    await assertProfileOwner(ctx, q.profileId);
    const profile = await ctx.db.get(q.profileId);
    if (!profile) throw new Error('Profile not found');
    await ctx.db.patch(args.id, {
      answer: args.correctedAnswer,
      isAnswered: true,
      needsReview: false,
      answeredAt: Date.now(),
    });
    await ctx.db.insert('knowledge', {
      userId: profile.userId,
      title: q.question,
      content: args.correctedAnswer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
