import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { isAdminUser } from './userIds';

export const addToWaitlist = mutation({
  args: {
    email: v.string(),
    role: v.optional(v.string()),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('waitlist')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
    if (existing) return { position: null, alreadyJoined: true };

    await ctx.db.insert("waitlist", {
      email: args.email,
      role: args.role,
      name: args.name,
      username: args.username,
      createdAt: Date.now(),
    });

    const all = await ctx.db.query("waitlist").collect();
    const position = all.length;
    return { position, alreadyJoined: false };
  },
});

export const getWaitlistCount = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("waitlist").collect();
    return { count: all.length };
  },
});

export const getWaitlist = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !isAdminUser(identity.subject)) throw new Error('Unauthorized');
    return await ctx.db.query('waitlist').order('desc').collect();
  },
});
