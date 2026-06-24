const fs = require('fs');
let code = fs.readFileSync('convex/schema.ts', 'utf8');

code = code.replace(
  `    socialLinks: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),`,
  `    socialLinks: v.optional(v.string()),
    vibeQuote: v.optional(v.string()),
    links: v.optional(v.string()),
    themeEffect: v.optional(v.string()),
    pinnedQuestions: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),`
);

fs.writeFileSync('convex/schema.ts', code);
console.log('Schema updated');
