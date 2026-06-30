import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createIfMissing = mutation({
  args: { username: v.optional(v.string()) },
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) =>
        q.eq("userId", identity.subject)
      )
      .unique();

    if (existing) {
      return existing;
    }

    const now = Date.now();

    const profileId = await ctx.db.insert("profiles", {
      userId: identity.subject,
      username:
        identity.nickname ||
        identity.email?.split("@")[0] ||
        `user_${identity.subject.slice(0, 8)}`,
      displayName:
        identity.name ||
        identity.nickname ||
        identity.email ||
        "User",
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(profileId);
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) =>
        q.eq("userId", identity.subject)
      )
      .unique();
  },
});

export const checkUsernameAvailable = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('profiles')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();
    return { available: !existing };
  },
});

export const byUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('profiles')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();
  },
});

export const update = mutation({
  args: {
    tags: v.optional(v.array(v.string())),
    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      ...(args.username !== undefined && { username: args.username }),
      ...(args.displayName !== undefined && { displayName: args.displayName }),
      ...(args.bio !== undefined && { bio: args.bio }),
      ...(args.avatar !== undefined && { avatar: args.avatar }),
      ...(args.welcomeMessage !== undefined && { welcomeMessage: args.welcomeMessage }),
      ...(args.themeColor !== undefined && { themeColor: args.themeColor }),
      ...(args.themeBg !== undefined && { themeBg: args.themeBg }),
      ...(args.themeFont !== undefined && { themeFont: args.themeFont }),
      ...(args.themeCardStyle !== undefined && { themeCardStyle: args.themeCardStyle }),
      ...(args.socialLinks !== undefined && { socialLinks: args.socialLinks }),
      ...(args.vibeQuote !== undefined && { vibeQuote: args.vibeQuote }),
      ...(args.links !== undefined && { links: args.links }),
      ...(args.themeEffect !== undefined && { themeEffect: args.themeEffect }),
      ...(args.pinnedQuestions !== undefined && { pinnedQuestions: args.pinnedQuestions }),
      ...(args.suggestedQuestions !== undefined && { suggestedQuestions: args.suggestedQuestions }),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(profile._id);
  },
});

export const getRecentProfiles = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("profiles")
      .order("desc")
      .take(args.limit ?? 5);
    return profiles.map(p => ({
      username: p.username,
      displayName: p.displayName,
      avatar: p.avatar,
      initials: p.displayName?.charAt(0)?.toUpperCase() || p.username?.charAt(0)?.toUpperCase() || '?',
    }));
  },
});

export const getProfilesCount = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    return profiles.length;
  },
});
