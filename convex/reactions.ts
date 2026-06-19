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
    profileId: v.id('profiles'),
    emoji: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('reactions')
      .withIndex('by_profileId_emoji', (q) =>
        q.eq('profileId', args.profileId).eq('emoji', args.emoji)
      )
      .filter((q) => q.eq(q.field('visitorId'), args.visitorId))
      .first();

    if (existing) return { alreadyReacted: true };

    await ctx.db.insert('reactions', {
      profileId: args.profileId,
      emoji: args.emoji,
      visitorId: args.visitorId,
      createdAt: Date.now(),
    });
    return { alreadyReacted: false };
  },
});
