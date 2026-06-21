import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const MAX_SPOTS = 50;

export const getEarlyAdopters = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('earlyAdopters').order('asc').collect();
  },
});

export const getSpotsLeft = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query('earlyAdopters').collect();
    return MAX_SPOTS - members.length;
  },
});

export const isEarlyAdopter = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query('earlyAdopters')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();
    return !!member;
  },
});

export const claimEarlyAdopterSpot = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('earlyAdopters')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();
    if (existing) return { success: false, reason: 'already_claimed' };

    const members = await ctx.db.query('earlyAdopters').collect();
    if (members.length >= MAX_SPOTS) return { success: false, reason: 'full' };

    const spotNumber = members.length + 1;
    await ctx.db.insert('earlyAdopters', {
      userId: args.userId,
      username: args.username,
      displayName: args.displayName,
      claimedAt: Date.now(),
      spotNumber,
    });

    return { success: true, spotNumber };
  },
});
