import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getChatsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query('chats')
      .withIndex('by_userId_updatedAt', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

export const getChatById = query({
  args: { id: v.id('chats') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getChatMessages = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, args) => {
    return await ctx.db.query('chat_messages')
      .withIndex('by_chatId_createdAt', (q) => q.eq('chatId', args.chatId))
      .order('asc')
      .collect();
  },
});

export const createChat = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('chats', {
      userId: args.userId,
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const deleteChat = mutation({
  args: { id: v.id('chats') },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query('chat_messages')
      .withIndex('by_chatId', (q) => q.eq('chatId', args.id))
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const renameChat = mutation({
  args: {
    id: v.id('chats'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const addMessage = mutation({
  args: {
    chatId: v.id('chats'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
    sources: v.optional(v.array(v.object({
      title: v.string(),
      content: v.string(),
      score: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.chatId, { updatedAt: now });
    return await ctx.db.insert('chat_messages', {
      chatId: args.chatId,
      role: args.role,
      content: args.content,
      sources: args.sources,
      createdAt: now,
    });
  },
});
