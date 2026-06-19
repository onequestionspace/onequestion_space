import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  profiles: defineTable({
    userId: v.string(),
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
    welcomeMessage: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    themeBg: v.optional(v.string()),
    themeFont: v.optional(v.string()),
    themeCardStyle: v.optional(v.string()),
    socialLinks: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_username', ['username']),

  knowledge: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    embeddings: v.optional(v.array(v.number())), // Gemini vector 768-dim
    chunkIndex: v.optional(v.number()),
    fileUrl: v.optional(v.string()),
    fileType: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId']),

  questions: defineTable({
    profileId: v.id('profiles'),
    visitorId: v.optional(v.string()),
    question: v.string(),
    answer: v.optional(v.string()),
    isAnswered: v.boolean(),
    createdAt: v.number(),
    answeredAt: v.optional(v.number()),
  })
    .index('by_profileId', ['profileId'])
    .index('by_isAnswered', ['isAnswered']),

  analytics: defineTable({
    profileId: v.id('profiles'),
    totalQuestions: v.number(),
    totalAnswers: v.number(),
    totalVisitors: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_profileId', ['profileId']),

  subscriptions: defineTable({
    userId: v.string(),
    plan: v.union(v.literal('free'), v.literal('starter'), v.literal('pro'), v.literal('business'), v.literal('enterprise')),
    status: v.union(v.literal('active'), v.literal('inactive'), v.literal('cancelled'), v.literal('trial')),
    messagesUsed: v.number(),
    messagesLimit: v.number(),
    paymentReference: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
    renewalDate: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId']),

  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    author: v.string(),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_published', ['published']),

  reactions: defineTable({
    profileId: v.id('profiles'),
    emoji: v.string(),
    visitorId: v.string(),
    createdAt: v.number(),
  })
    .index('by_profileId', ['profileId'])
    .index('by_profileId_emoji', ['profileId', 'emoji']),

  waitlist: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    email: v.string(),
    role: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_email', ['email']),
});
