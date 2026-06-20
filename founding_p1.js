const fs = require('fs');

// ── 1. Add founding table to schema ─────────────────────────────────────────
let schema = fs.readFileSync('convex/schema.ts', 'utf8');

if (!schema.includes('founding:')) {
  schema = schema.replace(
    `  waitlist: defineTable({`,
    `  founding: defineTable({
    userId: v.string(),
    username: v.string(),
    displayName: v.string(),
    claimedAt: v.number(),
    spotNumber: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_username', ['username']),

  waitlist: defineTable({`
  );
  fs.writeFileSync('convex/schema.ts', schema);
  console.log('✓ schema.ts updated with founding table');
}

// ── 2. convex/founding.ts ────────────────────────────────────────────────────
fs.writeFileSync('convex/founding.ts', `import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const MAX_SPOTS = 5;

export const getFoundingMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('founding').order('asc').collect();
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
      username: args.username,
      displayName: args.displayName,
      claimedAt: Date.now(),
      spotNumber,
    });

    return { success: true, spotNumber };
  },
});
`);
console.log('✓ convex/founding.ts created');
