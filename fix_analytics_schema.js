const fs = require('fs');
let schema = fs.readFileSync('convex/schema.ts', 'utf8');

schema = schema.replace(
  `  waitlist: defineTable({`,
  `  pageviews: defineTable({
    page: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    visitorId: v.optional(v.string()),
    userId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_page', ['page'])
    .index('by_createdAt', ['createdAt']),

  events: defineTable({
    type: v.string(),
    userId: v.optional(v.string()),
    visitorId: v.optional(v.string()),
    metadata: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_type', ['type'])
    .index('by_userId', ['userId'])
    .index('by_createdAt', ['createdAt']),

  waitlist: defineTable({`
);

fs.writeFileSync('convex/schema.ts', schema);
console.log('Schema done');
