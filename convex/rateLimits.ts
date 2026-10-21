import { mutation } from './_generated/server';
import { v } from 'convex/values';

// Only trusted server routes may consume rate-limit buckets.
export const consume = mutation({
  args: {
    secret: v.string(),
    key: v.string(),
    limit: v.number(),
    windowMs: v.number(),
  },
  handler: async (ctx, args) => {
    const expected = process.env.ONEQUESTION_STREAM_SECRET;
    if (!expected || args.secret !== expected) throw new Error('Not authorized');
    if (!args.key || args.key.length > 160) throw new Error('Invalid rate-limit key');

    const limit = Math.max(1, Math.min(1000, Math.floor(args.limit)));
    const windowMs = Math.max(1000, Math.min(24 * 60 * 60 * 1000, Math.floor(args.windowMs)));
    const now = Date.now();
    const existing = await ctx.db.query('rateLimitBuckets')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .unique();

    if (!existing || now - existing.windowStartedAt >= windowMs || now < existing.windowStartedAt) {
      if (existing) {
        await ctx.db.patch(existing._id, { count: 1, windowStartedAt: now, updatedAt: now });
      } else {
        await ctx.db.insert('rateLimitBuckets', {
          key: args.key,
          count: 1,
          windowStartedAt: now,
          updatedAt: now,
        });
      }
      return { allowed: true, remaining: limit - 1, retryAfterMs: windowMs };
    }

    const nextCount = Math.min(existing.count + 1, limit + 1);
    await ctx.db.patch(existing._id, { count: nextCount, updatedAt: now });
    const retryAfterMs = Math.max(0, existing.windowStartedAt + windowMs - now);
    return {
      allowed: nextCount <= limit,
      remaining: Math.max(0, limit - nextCount),
      retryAfterMs,
    };
  },
});
