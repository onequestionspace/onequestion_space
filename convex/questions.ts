import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getQuestionsByProfile = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    return await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .order('desc')
      .collect();
  },
});

export const getRecentQuestions = query({
  args: { profileId: v.id('profiles'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .order('desc')
      .take(args.limit ?? 5);
  },
});

export const getUnansweredQuestions = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    return await ctx.db.query('questions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .filter((q) => q.eq(q.field('isAnswered'), false))
      .collect();
  },
});

export const createQuestion = mutation({
  args: {
    profileId: v.id('profiles'),
    question: v.string(),
    answer: v.optional(v.string()),
    visitorId: v.optional(v.string()),
    isAnswered: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    answeredAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('questions', {
      profileId: args.profileId,
      question: args.question,
      answer: args.answer,
      visitorId: args.visitorId,
      isAnswered: args.isAnswered ?? false,
      createdAt: args.createdAt ?? Date.now(),
      answeredAt: args.answeredAt,
    });
  },
});

export const answerQuestion = mutation({
  args: { id: v.id('questions'), answer: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      answer: args.answer,
      isAnswered: true,
      answeredAt: Date.now(),
    });
  },
});

export const deleteQuestion = mutation({
  args: { id: v.id('questions') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
