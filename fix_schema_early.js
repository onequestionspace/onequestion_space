const fs = require('fs');

let schema = fs.readFileSync('convex/schema.ts', 'utf8');

schema = schema.replace(
  `  waitlist: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    email: v.string(),
    role: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_email', ['email']),
});`,
  `  earlyAdopters: defineTable({
    userId: v.string(),
    username: v.string(),
    displayName: v.string(),
    claimedAt: v.number(),
    spotNumber: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_username', ['username']),

  waitlist: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    email: v.string(),
    role: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_email', ['email']),
});`
);

fs.writeFileSync('convex/schema.ts', schema);
console.log('✓ earlyAdopters added to schema');
