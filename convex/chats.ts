import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { QueryCtx, MutationCtx } from './_generated/server';

async function assertUser(ctx: QueryCtx | MutationCtx, userId: string) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.subject !== userId) throw new Error('Not authorized');
}

async function assertChatOwner(ctx: QueryCtx | MutationCtx, chatId: import('./_generated/dataModel').Id<'chats'>) {
  const chat = await ctx.db.get(chatId);
  if (!chat) throw new Error('Chat not found');
  await assertUser(ctx, chat.userId);
  return chat;
}

export const getChatsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await assertUser(ctx, args.userId);
    return await ctx.db.query('chats')
      .withIndex('by_userId_updatedAt', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

export const getChatById = query({
  args: { id: v.id('chats') },
  handler: async (ctx, args) => {
    return await assertChatOwner(ctx, args.id);
  },
});

export const getChatMessages = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, args) => {
    await assertChatOwner(ctx, args.chatId);
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
    await assertUser(ctx, args.userId);
    const title = args.title.trim();
    if (!title || title.length > 200) throw new Error('Invalid chat title');
    const now = Date.now();
    return await ctx.db.insert('chats', {
      userId: args.userId,
      title,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const deleteChat = mutation({
  args: { id: v.id('chats') },
  handler: async (ctx, args) => {
    await assertChatOwner(ctx, args.id);
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
    await assertChatOwner(ctx, args.id);
    const title = args.title.trim();
    if (!title || title.length > 200) throw new Error('Invalid chat title');
    return await ctx.db.patch(args.id, {
      title,
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
    await assertChatOwner(ctx, args.chatId);
    if (!args.content.trim() || args.content.length > 20000) throw new Error('Invalid message content');
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
