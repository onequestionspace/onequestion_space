const fs = require('fs');
let c = fs.readFileSync('convex/admin.ts', 'utf8');

// Replace heavy getAllProfilesWithStats with lightweight version
c = c.replace(
  `export const getAllProfilesWithStats = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    checkAdmin(args.adminId);
    const profiles = await ctx.db.query('profiles').order('desc').collect();
    const result = await Promise.all(profiles.map(async (p) => {
      const subscription = await ctx.db
        .query('subscriptions')
        .withIndex('by_userId', (q) => q.eq('userId', p.userId))
        .unique();
      const analytics = await ctx.db
        .query('analytics')
        .withIndex('by_profileId', (q) => q.eq('profileId', p._id))
        .unique();
      const knowledgeCount = (await ctx.db
        .query('knowledge')
        .withIndex('by_userId', (q) => q.eq('userId', p.userId))
        .collect()).length;
      return {
        ...p,
        plan: subscription?.plan ?? 'free',
        messagesUsed: subscription?.messagesUsed ?? 0,
        messagesLimit: subscription?.messagesLimit ?? 50,
        totalQuestions: analytics?.totalQuestions ?? 0,
        totalVisitors: analytics?.totalVisitors ?? 0,
        knowledgeCount,
      };
    }));
    return result;
  },
});`,
  `export const getAllProfilesWithStats = query({
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
});`
);

fs.writeFileSync('convex/admin.ts', c);
console.log('done');
