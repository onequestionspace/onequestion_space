const fs = require('fs');

// 1. Fix ask route — increment messagesUsed after every AI answer
let ask = fs.readFileSync('app/api/ask/route.ts', 'utf8');
ask = ask.replace(
  '    // 6. Update analytics\n    await convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id });\n    await convex.mutation(api.analytics.incrementAnswerCount, { profileId: profile._id });',
  '    // 6. Update analytics + usage\n    await convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id });\n    await convex.mutation(api.analytics.incrementAnswerCount, { profileId: profile._id });\n    await convex.mutation(api.subscriptions.incrementMessagesUsed, { userId: profile.userId });'
);
fs.writeFileSync('app/api/ask/route.ts', ask);
console.log('1 ask route increments messagesUsed');

// 2. Add addCredits mutation to subscriptions.ts
let subs = fs.readFileSync('convex/subscriptions.ts', 'utf8');
if (!subs.includes('addCredits')) {
  subs += `
export const addCredits = mutation({
  args: { userId: v.string(), credits: v.number() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    if (!record) return;
    await ctx.db.patch(record._id, {
      messagesLimit: record.messagesLimit + args.credits,
      updatedAt: Date.now(),
    });
  },
});
`;
  fs.writeFileSync('convex/subscriptions.ts', subs);
  console.log('2 addCredits mutation added');
} else {
  console.log('2 addCredits already exists');
}
