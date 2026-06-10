import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * Convex Database Schema
 * Defines all tables and their structure
 */

export default defineSchema({
  // User Profiles
  profiles: defineTable({
    userId: v.string(), // Clerk user ID
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
    welcomeMessage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_username', ['username']),

  // Knowledge Base
  knowledge: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    fileUrl: v.optional(v.string()),
    fileType: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // Questions
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

  // Analytics
  analytics: defineTable({
    profileId: v.id('profiles'),
    totalQuestions: v.number(),
    totalAnswers: v.number(),
    totalVisitors: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_profileId', ['profileId']),

  // Subscriptions - Message-based billing
  subscriptions: defineTable({
    userId: v.string(),
    plan: v.union(
      v.literal('free'),
      v.literal('starter'),
      v.literal('pro'),
      v.literal('business'),
      v.literal('enterprise')
    ),
    status: v.union(
      v.literal('active'),
      v.literal('inactive'),
      v.literal('cancelled'),
      v.literal('trial')
    ),
    messagesUsed: v.number(),
    messagesLimit: v.number(), // -1 for unlimited
    paymentReference: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
    renewalDate: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId']),

  waitlist: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
  email: v.string(),
  role: v.optional(v.string()),
  createdAt: v.number(),
}).index('by_email', ['email']),
});
