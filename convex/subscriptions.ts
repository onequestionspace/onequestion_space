import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getSubscription = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
  },
});

export const getOrCreateSubscription = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    if (existing) return existing;
    const now = Date.now();
    const id = await ctx.db.insert('subscriptions', {
      userId: args.userId,
      plan: 'free',
      status: 'active',
      messagesUsed: 0,
      messagesLimit: 50,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const createSubscription = mutation({
  args: {
    userId: v.string(),
    plan: v.union(
      v.literal('free'),
      v.literal('starter'),
      v.literal('pro'),
      v.literal('business'),
      v.literal('enterprise')
    ),
    paymentReference: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limits: Record<string, number> = {
      free: 50,
      starter: 500,
      pro: 2000,
      business: 10000,
      enterprise: -1,
    };
    return await ctx.db.insert('subscriptions', {
      userId: args.userId,
      plan: args.plan,
      status: 'active',
      messagesUsed: 0,
      messagesLimit: limits[args.plan] ?? 50,
      paymentReference: args.paymentReference,
      amount: args.amount,
      currency: args.currency,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateSubscription = mutation({
  args: {
    userId: v.string(),
    plan: v.optional(v.union(
      v.literal('free'),
      v.literal('starter'),
      v.literal('pro'),
      v.literal('business'),
      v.literal('enterprise')
    )),
    status: v.optional(v.union(
      v.literal('active'),
      v.literal('inactive'),
      v.literal('cancelled'),
      v.literal('trial')
    )),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    if (!record) return;
    await ctx.db.patch(record._id, {
      ...(args.plan !== undefined && { plan: args.plan }),
      ...(args.status !== undefined && { status: args.status }),
      updatedAt: Date.now(),
    });
  },
});

export const incrementMessagesUsed = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    if (!record) return;
    await ctx.db.patch(record._id, {
      messagesUsed: record.messagesUsed + 1,
      updatedAt: Date.now(),
    });
  },
});

export const cancelSubscription = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    if (!record) return;
    await ctx.db.patch(record._id, {
      status: 'cancelled',
      updatedAt: Date.now(),
    });
  },
});
