import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { isAdminUser } from './userIds';

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
    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();
    if (!profile) return null;
    // Public profile data only. Never expose owner IDs or seeded-profile claim tokens.
    return {
      _id: profile._id,
      _creationTime: profile._creationTime,
      username: profile.username,
      displayName: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar,
      welcomeMessage: profile.welcomeMessage,
      themeColor: profile.themeColor,
      themeBg: profile.themeBg,
      themeFont: profile.themeFont,
      themeCardStyle: profile.themeCardStyle,
      socialLinks: profile.socialLinks,
      vibeQuote: profile.vibeQuote,
      links: profile.links,
      themeEffect: profile.themeEffect,
      pinnedQuestions: profile.pinnedQuestions,
      suggestedQuestions: profile.suggestedQuestions,
      goalType: profile.goalType,
      goalLink: profile.goalLink,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  },
});

export const getProfileForServer = query({
  args: { secret: v.string(), username: v.string() },
  handler: async (ctx, args) => {
    const expected = process.env.ONEQUESTION_STREAM_SECRET;
    if (!expected || args.secret !== expected) throw new Error('Not authorized');
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
    goalType: v.optional(v.union(v.literal('capture_email'), v.literal('book_call'), v.literal('none'))),
    goalLink: v.optional(v.string()),
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
      ...(args.goalType !== undefined && { goalType: args.goalType }),
      ...(args.goalLink !== undefined && { goalLink: args.goalLink }),
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

export const seedProfile = mutation({
  args: {
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
    welcomeMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !isAdminUser(identity.subject)) throw new Error('Unauthorized');

    const existing = await ctx.db
      .query('profiles')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();

    if (existing) {
      throw new Error('Username already taken');
    }

    const now = Date.now();
    const claimToken = crypto.randomUUID();

    const profileId = await ctx.db.insert('profiles', {
      userId: `seeded_${claimToken}`,
      username: args.username,
      displayName: args.displayName,
      bio: args.bio,
      welcomeMessage: args.welcomeMessage,
      isSeeded: true,
      claimToken,
      createdAt: now,
      updatedAt: now,
    });

    return { profileId, claimToken, claimUrl: `/claim/${claimToken}` };
  },
});

export const getByClaimToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('profiles')
      .withIndex('by_claimToken', (q) => q.eq('claimToken', args.token))
      .unique();
  },
});

export const claimProfile = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_claimToken', (q) => q.eq('claimToken', args.token))
      .unique();

    if (!profile) throw new Error('Invalid or expired claim link');
    if (!profile.isSeeded) throw new Error('This profile has already been claimed');
    const prospect = await ctx.db.query('prospects')
      .withIndex('by_profileId', (q) => q.eq('profileId', profile._id))
      .unique();
    if (prospect && identity.email?.toLowerCase() !== prospect.email) {
      throw new Error('Sign in with the email address this page was prepared for');
    }

    const alreadyHasProfile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .unique();

    if (alreadyHasProfile) {
      throw new Error('This account already has a profile');
    }

    await ctx.db.patch(profile._id, {
      userId: identity.subject,
      isSeeded: false,
      claimToken: undefined,
      updatedAt: Date.now(),
    });
    if (prospect) {
      const knowledge = await ctx.db.query('knowledge')
        .withIndex('by_userId', (q) => q.eq('userId', profile.userId))
        .take(20);
      for (const item of knowledge) {
        await ctx.db.patch(item._id, { userId: identity.subject });
      }
      await ctx.db.patch(prospect._id, { status: 'claimed', updatedAt: Date.now() });
    }

    return await ctx.db.get(profile._id);
  },
});
