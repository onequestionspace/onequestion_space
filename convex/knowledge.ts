import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

async function assertOwner(ctx: any, userId: string) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.subject !== userId) {
    throw new Error('Not authorized to access this knowledge');
  }
}

export const getKnowledgeByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await assertOwner(ctx, args.userId);
    return await ctx.db.query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

// Public profile visitors may use published knowledge to receive answers.
// Keep this separate from the owner-only knowledge query.
export const getPublicKnowledgeByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db.query('profiles')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();
    if (!profile) return [];
    return await ctx.db.query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', profile.userId))
      .order('desc')
      .collect();
  },
});

export const getKnowledge = query({
  args: { id: v.id('knowledge') },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) return null;
    await assertOwner(ctx, item.userId);
    return item;
  },
});

export const createKnowledge = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    embeddings: v.optional(v.array(v.number())),
    chunks: v.optional(v.array(v.object({
      content: v.string(),
      chunkIndex: v.number(),
      embedding: v.optional(v.array(v.number())),
    }))),
    chunkIndex: v.optional(v.number()),
    fileUrl: v.optional(v.string()),
    fileType: v.optional(v.string()),
    sourceType: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertOwner(ctx, args.userId);
    const now = Date.now();
    return await ctx.db.insert('knowledge', {
      userId: args.userId,
      title: args.title,
      content: args.content,
      embeddings: args.embeddings,
      chunks: args.chunks,
      chunkIndex: args.chunkIndex,
      fileUrl: args.fileUrl,
      fileType: args.fileType,
      sourceType: args.sourceType,
      sourceUrl: args.sourceUrl,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateKnowledge = mutation({
  args: {
    id: v.id('knowledge'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    embeddings: v.optional(v.array(v.number())),
    chunks: v.optional(v.array(v.object({
      content: v.string(),
      chunkIndex: v.number(),
      embedding: v.optional(v.array(v.number())),
    }))),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error('Knowledge item not found');
    await assertOwner(ctx, item.userId);
    await ctx.db.patch(args.id, {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.content !== undefined && { content: args.content }),
      ...(args.embeddings !== undefined && { embeddings: args.embeddings }),
      ...(args.chunks !== undefined && { chunks: args.chunks }),
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

export const deleteKnowledge = mutation({
  args: { id: v.id('knowledge') },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) return null;
    await assertOwner(ctx, item.userId);
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const getKnowledgeCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await assertOwner(ctx, args.userId);
    const items = await ctx.db.query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();
    return items.length;
  },
});
