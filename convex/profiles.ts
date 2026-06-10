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
