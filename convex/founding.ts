import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const MAX_SPOTS = 5;

export const getFoundingMembers = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query('founding').order('asc').collect();
    return members.map(({ username, displayName, claimedAt, spotNumber }) => ({
      username, displayName, claimedAt, spotNumber,
    }));
  },
});

export const getSpotsLeft = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query('founding').collect();
    return MAX_SPOTS - members.length;
  },
});

export const isFoundingMember = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query('founding')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();
    return !!member;
  },
});

export const claimFoundingSpot = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) throw new Error('Not authorized');
    const username = args.username.trim().toLowerCase();
    const displayName = args.displayName.trim();
    if (!/^[a-z0-9_-]{3,40}$/.test(username) || !displayName || displayName.length > 120) {
      throw new Error('Invalid profile details');
    }
    // Check if already claimed
    const existing = await ctx.db
      .query('founding')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();
    if (existing) return { success: false, reason: 'already_claimed' };

    // Check spots
    const members = await ctx.db.query('founding').collect();
    if (members.length >= MAX_SPOTS) return { success: false, reason: 'full' };

    const spotNumber = members.length + 1;
    await ctx.db.insert('founding', {
      userId: args.userId,
      username,
      displayName,
      claimedAt: Date.now(),
      spotNumber,
    });

    return { success: true, spotNumber };
  },
});
