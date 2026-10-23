import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getReactions = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query('reactions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .collect();

    const counts: Record<string, number> = {
      fire: 0,
      love: 0,
      brain: 0,
      clap: 0,
      wow: 0,
    };
    for (const r of reactions) {
      if (r.emoji in counts) counts[r.emoji]++;
    }
    return counts;
  },
});

export const addReaction = mutation({
  args: {
    secret: v.string(),
    profileId: v.id('profiles'),
    emoji: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const expected = process.env.ONEQUESTION_STREAM_SECRET;
    if (!expected || args.secret !== expected) throw new Error('Not authorized');
    const allowedEmojis = new Set(['fire', 'love', 'brain', 'clap', 'wow']);
    if (!allowedEmojis.has(args.emoji)) throw new Error('Invalid reaction');
    const visitorId = args.visitorId.trim().slice(0, 120);
    if (!visitorId) throw new Error('Invalid visitor ID');
    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error('Profile not found');
    const existing = await ctx.db
      .query('reactions')
      .withIndex('by_profileId_emoji', (q) =>
        q.eq('profileId', args.profileId).eq('emoji', args.emoji)
      )
      .filter((q) => q.eq(q.field('visitorId'), visitorId))
      .first();

    if (existing) return { alreadyReacted: true };

    await ctx.db.insert('reactions', {
      profileId: args.profileId,
      emoji: args.emoji,
      visitorId,
      createdAt: Date.now(),
    });
    return { alreadyReacted: false };
  },
});
