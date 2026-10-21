import { action, internalMutation, mutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

const PLAN_LIMITS: Record<string, number> = {
  free: 50,
  starter: 500,
  pro: 500,
  business: 10000,
  enterprise: -1,
};

type PaymentApplicationResult =
  | { success: false; applied: false; reason?: 'account_mismatch' }
  | { success: true; applied: boolean; userId: string; kind: 'subscription' | 'credits' };

export const getSubscription = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) throw new Error('Not authorized');
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
  },
});

export const getOrCreateSubscription = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) throw new Error('Not authorized');
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

export const applyVerifiedPayment = internalMutation({
  args: {
    userId: v.string(),
    reference: v.string(),
    kind: v.union(v.literal('subscription'), v.literal('credits')),
    credits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existingReceipt = await ctx.db.query('paidTransactions')
      .withIndex('by_reference', (q) => q.eq('reference', args.reference))
      .unique();
    if (existingReceipt) return false;

    const record = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    const now = Date.now();
    let subscription = record;
    if (!subscription) {
      const id = await ctx.db.insert('subscriptions', {
        userId: args.userId,
        plan: 'free',
        status: 'active',
        messagesUsed: 0,
        messagesLimit: 50,
        createdAt: now,
        updatedAt: now,
      });
      subscription = await ctx.db.get(id);
    }

    if (!subscription) throw new Error('Could not create subscription record');
    if (args.kind === 'subscription') {
      await ctx.db.patch(subscription._id, {
        plan: 'pro',
        status: 'active',
        messagesLimit: PLAN_LIMITS.pro,
        messagesUsed: 0,
        renewalDate: now + 30 * 24 * 60 * 60 * 1000,
        updatedAt: now,
      });
    } else {
      const credits = args.credits ?? 0;
      if (!Number.isSafeInteger(credits) || credits < 1 || credits > 100000) {
        throw new Error('Invalid purchased credit amount');
      }
      await ctx.db.patch(subscription._id, {
        messagesLimit: subscription.messagesLimit + credits,
        updatedAt: now,
      });
    }

    await ctx.db.insert('paidTransactions', {
      reference: args.reference,
      userId: args.userId,
      kind: args.kind,
      createdAt: now,
    });
    return true;
  },
});

export const verifyAndApplyPayment = action({
  args: { reference: v.string(), expectedUserId: v.optional(v.string()) },
  handler: async (ctx, args): Promise<PaymentApplicationResult> => {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw new Error('PAYSTACK_SECRET_KEY is not configured for Convex');

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(args.reference)}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    if (!response.ok) throw new Error(`Paystack verification failed (${response.status})`);
    const result = await response.json() as {
      status?: boolean;
      data?: {
        status?: string;
        reference?: string;
        metadata?: { userId?: string; type?: string; plan?: string; credits?: number };
      };
    };
    const transaction = result.data;
    if (!result.status || transaction?.status !== 'success') {
      return { success: false, applied: false };
    }

    const metadata = transaction.metadata;
    if (!metadata?.userId || transaction.reference !== args.reference) {
      throw new Error('Verified transaction is missing valid account metadata');
    }
    if (args.expectedUserId && metadata.userId !== args.expectedUserId) {
      return { success: false, applied: false, reason: 'account_mismatch' };
    }

    if (metadata.type === 'subscription' && metadata.plan === 'pro') {
      const applied: boolean = await ctx.runMutation(internal.subscriptions.applyVerifiedPayment, {
        userId: metadata.userId,
        reference: args.reference,
        kind: 'subscription',
      });
      return { success: true, applied, userId: metadata.userId, kind: 'subscription' as const };
    }
    if (metadata.type === 'credits' && Number.isSafeInteger(metadata.credits) && metadata.credits! > 0) {
      const applied: boolean = await ctx.runMutation(internal.subscriptions.applyVerifiedPayment, {
        userId: metadata.userId,
        reference: args.reference,
        kind: 'credits',
        credits: metadata.credits,
      });
      return { success: true, applied, userId: metadata.userId, kind: 'credits' as const };
    }
    throw new Error('Verified payment metadata does not match a supported product');
  },
});

export const isProPlan = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return false;
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', profile.userId))
      .unique();
    return subscription?.plan === 'pro' && subscription.status === 'active';
  },
});

export const incrementMessagesUsed = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) throw new Error('Not authorized');
    const record = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    if (!record) return;
    const now = Date.now();
    await ctx.db.patch(record._id, {
      messagesUsed: record.messagesUsed + 1,
      updatedAt: now,
    });
  },
});


export const reservePublicAnswer = mutation({
  args: { secret: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const expected = process.env.ONEQUESTION_STREAM_SECRET;
    if (!expected || args.secret !== expected) throw new Error('Not authorized');
    const existing = await ctx.db.query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    const now = Date.now();
    let record = existing;
    if (!record) {
      const id = await ctx.db.insert('subscriptions', {
        userId: args.userId, plan: 'free', status: 'active',
        messagesUsed: 0, messagesLimit: 50, createdAt: now, updatedAt: now,
      });
      record = await ctx.db.get(id);
    }
    if (!record || record.status !== 'active') return { allowed: false, reason: 'inactive' as const };
    if (record.messagesLimit !== -1 && record.messagesUsed >= record.messagesLimit) {
      return { allowed: false, reason: 'limit_reached' as const };
    }
    await ctx.db.patch(record._id, { messagesUsed: record.messagesUsed + 1, updatedAt: now });
    return { allowed: true, reason: 'ok' as const };
  },
});

export const cancelSubscription = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) throw new Error('Not authorized');
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
