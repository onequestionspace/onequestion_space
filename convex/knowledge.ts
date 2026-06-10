import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getKnowledgeByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

export const getKnowledge = query({
  args: { id: v.id('knowledge') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createKnowledge = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    fileUrl: v.optional(v.string()),
    fileType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('knowledge', {
      userId: args.userId,
      title: args.title,
      content: args.content,
      fileUrl: args.fileUrl,
      fileType: args.fileType,
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.content !== undefined && { content: args.content }),
      updatedAt: Date.now(),
    });
  },
});

export const deleteKnowledge = mutation({
  args: { id: v.id('knowledge') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const getKnowledgeCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();
    return items.length;
  },
});
