const fs = require('fs');

function patch(path, replacements) {
  let content = fs.readFileSync(path, 'utf8');
  let changed = false;
  for (const { old, next, label } of replacements) {
    if (content.includes(next)) { console.log(`⚠️ ${label} already patched — skipping.`); continue; }
    if (!content.includes(old)) { console.error(`❌ ${label} pattern not found in ${path} — aborting.`); process.exit(1); }
    content = content.replace(old, next);
    changed = true;
    console.log(`✅ ${label} patched.`);
  }
  if (changed) fs.writeFileSync(path, content);
}

// 1. schema.ts
patch('convex/schema.ts', [{
  label: 'schema needsReview field + index',
  old: `    isAnswered: v.boolean(),
    createdAt: v.number(),
    answeredAt: v.optional(v.number()),
  })
    .index('by_profileId', ['profileId'])
    .index('by_isAnswered', ['isAnswered']),`,
  next: `    isAnswered: v.boolean(),
    needsReview: v.optional(v.boolean()),
    createdAt: v.number(),
    answeredAt: v.optional(v.number()),
  })
    .index('by_profileId', ['profileId'])
    .index('by_isAnswered', ['isAnswered'])
    .index('by_profileId_needsReview', ['profileId', 'needsReview']),`,
}]);

// 2. questions.ts
patch('convex/questions.ts', [
  {
    label: 'createQuestion args needsReview',
    old: `    isAnswered: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),`,
    next: `    isAnswered: v.optional(v.boolean()),
    needsReview: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),`,
  },
  {
    label: 'createQuestion handler needsReview',
    old: `      isAnswered: args.isAnswered ?? false,
      createdAt: args.createdAt ?? Date.now(),`,
    next: `      isAnswered: args.isAnswered ?? false,
      needsReview: args.needsReview ?? false,
      createdAt: args.createdAt ?? Date.now(),`,
  },
]);

// Append inbox query + resolve mutation to questions.ts
let qContent = fs.readFileSync('convex/questions.ts', 'utf8');
if (!qContent.includes('listNeedsReview')) {
  if (!qContent.includes("import { mutation, query }")) {
    qContent = qContent.replace(
      /import \{ mutation[^}]*\} from ['"]\.\/_generated\/server['"];/,
      `import { mutation, query } from './_generated/server';`
    );
  }
  qContent += `

export const listNeedsReview = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, { profileId }) => {
    return await ctx.db
      .query('questions')
      .withIndex('by_profileId_needsReview', (q) =>
        q.eq('profileId', profileId).eq('needsReview', true)
      )
      .order('desc')
      .collect();
  },
});

export const resolveQuestion = mutation({
  args: {
    id: v.id('questions'),
    correctedAnswer: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const q = await ctx.db.get(args.id);
    if (!q) return;
    await ctx.db.patch(args.id, {
      answer: args.correctedAnswer,
      isAnswered: true,
      needsReview: false,
      answeredAt: Date.now(),
    });
    await ctx.db.insert('knowledge', {
      userId: args.userId,
      title: q.question,
      content: args.correctedAnswer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
`;
  fs.writeFileSync('convex/questions.ts', qContent);
  console.log('✅ listNeedsReview + resolveQuestion added to questions.ts');
} else {
  console.log('⚠️ Inbox query/mutation already exist — skipping.');
}

// 3. route.ts
patch('app/api/ask/route.ts', [{
  label: 'heuristic function + wiring',
  old: `const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);`,
  next: `const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function isLowConfidence(answer: string): boolean {
  const lower = answer.toLowerCase();
  const weakPhrases = [
    "i don't have any knowledge", "i don't know", "i'm not sure", "i am not sure",
    "not sure about", "no information", "i don't have information",
    "i couldn't find", "i could not find", "unable to answer",
    "doesn't mention", "does not mention", "not mentioned",
  ];
  if (weakPhrases.some(p => lower.includes(p))) return true;
  if (answer.trim().length < 40) return true;
  return false;
}`,
}]);

patch('app/api/ask/route.ts', [{
  label: 'pass needsReview into createQuestion call',
  old: `      isAnswered: true,
      createdAt: Date.now(),
      answeredAt: Date.now(),
    });`,
  next: `      isAnswered: true,
      needsReview: isLowConfidence(answer),
      createdAt: Date.now(),
      answeredAt: Date.now(),
    });`,
}]);

console.log('🎉 All patches applied.');
