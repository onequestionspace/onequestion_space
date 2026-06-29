import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const ADMIN_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu', // Asym Alwali @Asym_Alwali (dev)
  'user_3Fmuk2jHEa5seXKEzewhWlA9yQs', // Asym Alwali @Asym_Alwali (prod)
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz', // Paraja @MuhammadParaja
];

const checkAdmin = (userId: string) => {
  if (!ADMIN_IDS.includes(userId)) throw new Error('Unauthorized');
};

export const getAllProfiles = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    checkAdmin(args.adminId);
    return await ctx.db.query('profiles').order('desc').collect();
  },
});

export const getAllFoundingMembers = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    checkAdmin(args.adminId);
    return await ctx.db.query('founding').order('asc').collect();
  },
});

export const getAllEarlyAdopters = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    checkAdmin(args.adminId);
    return await ctx.db.query('earlyAdopters').order('asc').collect();
  },
});

export const grantFoundingBadge = mutation({
  args: { adminId: v.string(), userId: v.string(), username: v.string(), displayName: v.string() },
  handler: async (ctx, args) => {
    checkAdmin(args.adminId);
    const existing = await ctx.db
      .query('founding')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();
    if (existing) return { success: false, reason: 'already_has_badge' };
    const members = await ctx.db.query('founding').collect();
    await ctx.db.insert('founding', {
      userId: args.userId,
      username: args.username,
      displayName: args.displayName,
      claimedAt: Date.now(),
      spotNumber: members.length + 1,
    });
    return { success: true };
  },
});

export const grantEarlyAdopterBadge = mutation({
  args: { adminId: v.string(), userId: v.string(), username: v.string(), displayName: v.string() },
  handler: async (ctx, args) => {
    checkAdmin(args.adminId);
    const existing = await ctx.db
      .query('earlyAdopters')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();
    if (existing) return { success: false, reason: 'already_has_badge' };
    const members = await ctx.db.query('earlyAdopters').collect();
    await ctx.db.insert('earlyAdopters', {
      userId: args.userId,
      username: args.username,
      displayName: args.displayName,
      claimedAt: Date.now(),
      spotNumber: members.length + 1,
    });
    return { success: true };
  },
});

export const removeBadge = mutation({
  args: { adminId: v.string(), userId: v.string(), type: v.union(v.literal('founding'), v.literal('earlyAdopter')) },
  handler: async (ctx, args) => {
    checkAdmin(args.adminId);
    if (args.type === 'founding') {
      const member = await ctx.db
        .query('founding')
        .withIndex('by_userId', (q) => q.eq('userId', args.userId))
        .first();
      if (member) await ctx.db.delete(member._id);
    } else {
      const member = await ctx.db
        .query('earlyAdopters')
        .withIndex('by_userId', (q) => q.eq('userId', args.userId))
        .first();
      if (member) await ctx.db.delete(member._id);
    }
    return { success: true };
  },
});

export const deleteProfile = mutation({
  args: { adminId: v.string(), profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    checkAdmin(args.adminId);
    await ctx.db.delete(args.profileId);
    return { success: true };
  },
});

export const getAllProfilesWithStats = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    checkAdmin(args.adminId);
    const profiles = await ctx.db.query('profiles').order('desc').collect();
    // Lightweight — only fetch subscription per profile, no nested queries
    const result = [];
    for (const p of profiles) {
      const subscription = await ctx.db
        .query('subscriptions')
        .withIndex('by_userId', (q) => q.eq('userId', p.userId))
        .unique();
      result.push({
        ...p,
        plan: subscription?.plan ?? 'free',
        messagesUsed: subscription?.messagesUsed ?? 0,
        messagesLimit: subscription?.messagesLimit ?? 50,
        totalQuestions: 0,
        totalVisitors: 0,
        knowledgeCount: 0,
      });
    }
    return result;
  },
});
