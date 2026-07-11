import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const ADMIN_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Fmuk2jHEa5seXKEzewhWlA9yQs',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
];

export const trackPageview = mutation({
  args: {
    page: v.string(),
    referrer: v.optional(v.string()),
    visitorId: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('pageviews', {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const trackEvent = mutation({
  args: {
    type: v.string(),
    userId: v.optional(v.string()),
    visitorId: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('events', {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getSiteAnalytics = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    if (!ADMIN_IDS.includes(args.adminId)) throw new Error('Unauthorized');

    const now = Date.now();
    const day = 86400000;
    const week = day * 7;
    const month = day * 30;

    const allPageviews = await ctx.db.query('pageviews').order('desc').collect();
    const allEvents = await ctx.db.query('events').order('desc').collect();
    const allProfiles = await ctx.db.query('profiles').collect();
    const allQuestions = await ctx.db.query('questions').collect();

    // Page breakdown
    const pageMap: Record<string, number> = {};
    allPageviews.forEach(p => {
      pageMap[p.page] = (pageMap[p.page] || 0) + 1;
    });
    const pageBreakdown = Object.entries(pageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([page, views]) => ({ page, views }));

    // Time-based pageviews
    const todayViews = allPageviews.filter(p => now - p.createdAt < day).length;
    const weekViews = allPageviews.filter(p => now - p.createdAt < week).length;
    const monthViews = allPageviews.filter(p => now - p.createdAt < month).length;

    // Unique visitors (by visitorId)
    const uniqueVisitors = new Set(allPageviews.map(p => p.visitorId).filter(Boolean)).size;

    // Event breakdown
    const eventMap: Record<string, number> = {};
    allEvents.forEach(e => {
      eventMap[e.type] = (eventMap[e.type] || 0) + 1;
    });

    // New users over time
    const newUsersToday = allProfiles.filter(p => now - p.createdAt < day).length;
    const newUsersWeek = allProfiles.filter(p => now - p.createdAt < week).length;
    const newUsersMonth = allProfiles.filter(p => now - p.createdAt < month).length;

    // Questions over time
    const questionsToday = allQuestions.filter(q => now - q.createdAt < day).length;
    const questionsWeek = allQuestions.filter(q => now - q.createdAt < week).length;

    // Daily pageviews for chart (last 7 days)
    const dailyViews = Array.from({ length: 7 }).map((_, i) => {
      const start = now - (6 - i) * day;
      const end = start + day;
      const count = allPageviews.filter(p => p.createdAt >= start && p.createdAt < end).length;
      const date = new Date(start).toLocaleDateString('en', { weekday: 'short' });
      return { date, count };
    });

    return {
      totalPageviews: allPageviews.length,
      todayViews,
      weekViews,
      monthViews,
      uniqueVisitors,
      totalProfiles: allProfiles.length,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
      totalQuestions: allQuestions.length,
      questionsToday,
      questionsWeek,
      pageBreakdown,
      eventBreakdown: Object.entries(eventMap).map(([type, count]) => ({ type, count })),
      dailyViews,
    };
  },
});

export const getUserActivity = query({
  args: { adminId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    if (!ADMIN_IDS.includes(args.adminId)) throw new Error('Unauthorized');

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    const questions = profile
      ? await ctx.db.query('questions').withIndex('by_profileId', (q) => q.eq('profileId', profile._id)).order('desc').collect()
      : [];

    const knowledge = await ctx.db
      .query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    const events = await ctx.db
      .query('events')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();

    const allPv = await ctx.db.query('pageviews').collect();
    const pageviews = allPv.filter(p => p.userId === args.userId);

    return {
      profile,
      questions: questions.slice(0, 20),
      knowledgeCount: knowledge.length,
      subscription,
      events: events.slice(0, 50),
      pageviewCount: pageviews.length,
    };
  },
});
