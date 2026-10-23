import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { MutationCtx, QueryCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';

async function assertProfileOwner(ctx: QueryCtx | MutationCtx, profileId: Id<'profiles'>) {
  const identity = await ctx.auth.getUserIdentity();
  const profile = await ctx.db.get(profileId);
  if (!identity || !profile || profile.userId !== identity.subject) {
    throw new Error('Not authorized to view these analytics');
  }
}

export const getAnalytics = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await assertProfileOwner(ctx, args.profileId);
    return await ctx.db
      .query('analytics')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
  },
});

export const getOrCreateAnalytics = mutation({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await assertProfileOwner(ctx, args.profileId);
    const existing = await ctx.db
      .query('analytics')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (existing) return existing;
    const now = Date.now();
    const id = await ctx.db.insert('analytics', {
      profileId: args.profileId,
      totalQuestions: 0,
      totalAnswers: 0,
      totalVisitors: 0,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const incrementQuestionCount = mutation({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await assertProfileOwner(ctx, args.profileId);
    const record = await ctx.db
      .query('analytics')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (!record) return;
    await ctx.db.patch(record._id, {
      totalQuestions: record.totalQuestions + 1,
      updatedAt: Date.now(),
    });
  },
});

export const incrementAnswerCount = mutation({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await assertProfileOwner(ctx, args.profileId);
    const record = await ctx.db
      .query('analytics')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (!record) return;
    await ctx.db.patch(record._id, {
      totalAnswers: record.totalAnswers + 1,
      updatedAt: Date.now(),
    });
  },
});

export const incrementVisitorCount = mutation({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await assertProfileOwner(ctx, args.profileId);
    const record = await ctx.db
      .query('analytics')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (!record) return;
    await ctx.db.patch(record._id, {
      totalVisitors: record.totalVisitors + 1,
      updatedAt: Date.now(),
    });
  },
});

export const updateAnalytics = mutation({
  args: {
    profileId: v.id('profiles'),
    totalQuestions: v.optional(v.number()),
    totalAnswers: v.optional(v.number()),
    totalVisitors: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertProfileOwner(ctx, args.profileId);
    const record = await ctx.db
      .query('analytics')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (!record) return;
    await ctx.db.patch(record._id, {
      ...(args.totalQuestions !== undefined && { totalQuestions: args.totalQuestions }),
      ...(args.totalAnswers !== undefined && { totalAnswers: args.totalAnswers }),
      ...(args.totalVisitors !== undefined && { totalVisitors: args.totalVisitors }),
      updatedAt: Date.now(),
    });
  },
});


export const recordPublicVisitor = mutation({
  args: { secret: v.string(), profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    const expected = process.env.ONEQUESTION_STREAM_SECRET;
    if (!expected || args.secret !== expected) throw new Error('Not authorized');
    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error('Profile not found');
    const record = await ctx.db.query('analytics')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (!record) return;
    await ctx.db.patch(record._id, {
      totalVisitors: record.totalVisitors + 1,
      updatedAt: Date.now(),
    });
  },
});
