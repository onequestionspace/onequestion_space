const fs = require('fs');

// ── 1. Add reactions table to schema ────────────────────────────────────────
let schema = fs.readFileSync('convex/schema.ts', 'utf8');

if (!schema.includes('reactions:')) {
  schema = schema.replace(
    `  waitlist: defineTable({`,
    `  reactions: defineTable({
    profileId: v.id('profiles'),
    emoji: v.string(),
    visitorId: v.string(),
    createdAt: v.number(),
  })
    .index('by_profileId', ['profileId'])
    .index('by_profileId_emoji', ['profileId', 'emoji']),

  waitlist: defineTable({`
  );
  fs.writeFileSync('convex/schema.ts', schema);
  console.log('✓ schema.ts updated with reactions table');
} else {
  console.log('- reactions table already exists');
}

// ── 2. convex/reactions.ts ───────────────────────────────────────────────────
fs.writeFileSync('convex/reactions.ts', `import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getReactions = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query('reactions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .collect();

    const counts: Record<string, number> = {};
    for (const r of reactions) {
      counts[r.emoji] = (counts[r.emoji] || 0) + 1;
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
    // Check if visitor already reacted with this emoji
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
`);
console.log('✓ convex/reactions.ts created');
