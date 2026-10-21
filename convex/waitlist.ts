import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { isAdminUser } from './userIds';

export const addToWaitlist = mutation({
  args: {
    secret: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const expected = process.env.ONEQUESTION_STREAM_SECRET;
    if (!expected || args.secret !== expected) throw new Error('Not authorized');
    const email = args.email.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email');
    }
    const role = args.role?.trim().slice(0, 80);
    const name = args.name?.trim().slice(0, 120);
    const username = args.username?.trim().slice(0, 40);
    const existing = await ctx.db
      .query('waitlist')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();
    if (existing) return { position: null, alreadyJoined: true };

    await ctx.db.insert("waitlist", {
      email,
      role,
      name,
      username,
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
