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
    vibeQuote: v.optional(v.string()),
    links: v.optional(v.string()),
    themeEffect: v.optional(v.string()),
    pinnedQuestions: v.optional(v.array(v.string())),
    suggestedQuestions: v.optional(v.array(v.string())),
    goalType: v.optional(v.union(v.literal('capture_email'), v.literal('book_call'), v.literal('none'))),
    goalLink: v.optional(v.string()),
    isSeeded: v.optional(v.boolean()),
    claimToken: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_username', ['username'])
    .index('by_claimToken', ['claimToken']),

  knowledge: defineTable({
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
    sourceType: v.optional(v.string()), // 'personal' | 'article' | 'url' | 'image' | 'pdf' | 'doc'
    sourceUrl: v.optional(v.string()),  // original URL if sourceType is 'url' or 'article'
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
    needsReview: v.optional(v.boolean()),
    createdAt: v.number(),
    answeredAt: v.optional(v.number()),
    embeddings: v.optional(v.array(v.number())),
    goalAchieved: v.optional(v.boolean()),
  })
    .index('by_profileId', ['profileId'])
    .index('by_isAnswered', ['isAnswered'])
    .index('by_profileId_needsReview', ['profileId', 'needsReview']),

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

  paidTransactions: defineTable({
    reference: v.string(),
    userId: v.string(),
    kind: v.union(v.literal('subscription'), v.literal('credits')),
    createdAt: v.number(),
  }).index('by_reference', ['reference']),

  prospects: defineTable({
    profileId: v.id('profiles'),
    email: v.string(),
    status: v.union(
      v.literal('building'),
      v.literal('ready'),
      v.literal('invited'),
      v.literal('claimed'),
    ),
    knowledgeCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_profileId', ['profileId'])
    .index('by_email', ['email']),

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

  founding: defineTable({
    userId: v.string(),
    username: v.string(),
    displayName: v.string(),
    claimedAt: v.number(),
    spotNumber: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_username', ['username']),

  earlyAdopters: defineTable({
    userId: v.string(),
    username: v.string(),
    displayName: v.string(),
    claimedAt: v.number(),
    spotNumber: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_username', ['username']),

  pageviews: defineTable({
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

  waitlist: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    email: v.string(),
    role: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_email', ['email']),

  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_updatedAt', ['userId', 'updatedAt']),

  chat_messages: defineTable({
    chatId: v.id('chats'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
    sources: v.optional(v.array(v.object({
      title: v.string(),
      content: v.string(),
      score: v.number(),
    }))),
    createdAt: v.number(),
  })
    .index('by_chatId', ['chatId'])
    .index('by_chatId_createdAt', ['chatId', 'createdAt']),

  rateLimitBuckets: defineTable({
    key: v.string(),
    count: v.number(),
    windowStartedAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_key', ['key'])
    .index('by_updatedAt', ['updatedAt']),
});
// customBg added via patch — no schema change needed, stored in themeEffect as "custom:URL"
