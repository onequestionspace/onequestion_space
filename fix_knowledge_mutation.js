const fs = require('fs');
let content = fs.readFileSync('convex/knowledge.ts', 'utf8');

content = content.replace(
  `export const updateKnowledge = mutation({
  args: {
    id: v.id('knowledge'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.content !== undefined && { content: args.content }),
      updatedAt: Date.now(),
    });
  },
});`,
  `export const updateKnowledge = mutation({
  args: {
    id: v.id('knowledge'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    embeddings: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.content !== undefined && { content: args.content }),
      ...(args.embeddings !== undefined && { embeddings: args.embeddings }),
      updatedAt: Date.now(),
    });
  },
});`
);

fs.writeFileSync('convex/knowledge.ts', content);
console.log('Done');
