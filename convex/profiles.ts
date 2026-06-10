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
    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
    welcomeMessage: v.optional(v.string()),
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
      updatedAt: Date.now(),
    });

    return await ctx.db.get(profile._id);
  },
});
