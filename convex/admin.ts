import { query, mutation } from './_generated/server';
import type { MutationCtx, QueryCtx } from './_generated/server';
import { v } from 'convex/values';
import { isAdminUser } from './userIds';

const checkAdmin = async (ctx: QueryCtx | MutationCtx, userId: string) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.subject !== userId || !isAdminUser(identity.subject)) {
    throw new Error('Unauthorized');
  }
};

export const addCredits = mutation({
  args: { adminId: v.string(), userId: v.string(), credits: v.number() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    if (!Number.isSafeInteger(args.credits) || args.credits < 1 || args.credits > 100000) {
      throw new Error('Invalid credit amount');
    }
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    const now = Date.now();
    if (subscription) {
      await ctx.db.patch(subscription._id, {
        messagesLimit: subscription.messagesLimit + args.credits,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('subscriptions', {
        userId: args.userId,
        plan: 'free',
        status: 'active',
        messagesUsed: 0,
        messagesLimit: 50 + args.credits,
        createdAt: now,
        updatedAt: now,
      });
    }
    return { success: true };
  },
});

export const getProspects = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    const prospects = await ctx.db.query('prospects').order('desc').take(50);
    return await Promise.all(prospects.map(async (prospect) => ({
      ...prospect,
      profile: await ctx.db.get(prospect.profileId),
    })));
  },
});

export const createProspect = mutation({
  args: {
    adminId: v.string(),
    email: v.string(),
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    const email = args.email.trim().toLowerCase();
    const username = args.username.trim().toLowerCase();
    const displayName = args.displayName.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address');
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      throw new Error('Username must be 3–30 characters using lowercase letters, numbers, and underscores');
    }
    if (!displayName || displayName.length > 80) throw new Error('Name is required and must be under 80 characters');
    if (args.bio && args.bio.length > 500) throw new Error('Bio must be 500 characters or fewer');

    const existing = await ctx.db.query('profiles')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique();
    if (existing) throw new Error('That public page name is already taken');
    const existingProspect = await ctx.db.query('prospects')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();
    if (existingProspect && existingProspect.status !== 'claimed') {
      throw new Error('There is already an unclaimed page for this email address');
    }

    const now = Date.now();
    const claimToken = crypto.randomUUID();
    const profileId = await ctx.db.insert('profiles', {
      userId: `seeded_${claimToken}`,
      username,
      displayName,
      bio: args.bio?.trim() || undefined,
      welcomeMessage: `Hi, I'm ${displayName}. Ask me about my work, experience, and expertise.`,
      isSeeded: true,
      claimToken,
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert('prospects', {
      profileId,
      email,
      status: 'building',
      knowledgeCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    return { profileId, username, claimToken, email };
  },
});

export const addProspectKnowledge = mutation({
  args: {
    adminId: v.string(),
    profileId: v.id('profiles'),
    title: v.string(),
    content: v.string(),
    embeddings: v.array(v.number()),
    chunks: v.array(v.object({
      content: v.string(),
      chunkIndex: v.number(),
      embedding: v.array(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    const profile = await ctx.db.get(args.profileId);
    if (!profile?.isSeeded) throw new Error('Prospect page not found or already claimed');
    const prospect = await ctx.db.query('prospects')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (!prospect) throw new Error('Prospect record not found');
    if (prospect.knowledgeCount >= 20) throw new Error('This page has reached its 20-item knowledge limit');
    if (!args.title.trim() || !args.content.trim() || args.content.length > 40000) {
      throw new Error('Knowledge must have a title and contain no more than 40,000 characters');
    }
    if (!args.chunks.length || args.chunks.length > 250 || args.chunks.some(
      (chunk) => chunk.embedding.length !== 768 || chunk.content.length > 40000
    )) {
      throw new Error('Knowledge embeddings are invalid. Prepare the knowledge again and retry.');
    }

    const now = Date.now();
    await ctx.db.insert('knowledge', {
      userId: profile.userId,
      title: args.title.trim().slice(0, 120),
      content: args.content.trim(),
      embeddings: args.embeddings.length === 768 ? args.embeddings : undefined,
      chunks: args.chunks,
      sourceType: 'personal',
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.patch(prospect._id, {
      status: 'ready',
      knowledgeCount: prospect.knowledgeCount + 1,
      updatedAt: now,
    });
    return { success: true };
  },
});

export const markProspectInvited = mutation({
  args: { adminId: v.string(), profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    const prospect = await ctx.db.query('prospects')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (!prospect) throw new Error('Prospect record not found');
    if (prospect.knowledgeCount < 1) throw new Error('Add knowledge before sending an invitation');
    if (prospect.status === 'claimed') return { success: true };
    await ctx.db.patch(prospect._id, { status: 'invited', updatedAt: Date.now() });
    return { success: true };
  },
});

export const getAllProfiles = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    return await ctx.db.query('profiles').order('desc').collect();
  },
});

export const getAllProfilesWithStats = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    const profiles = await ctx.db.query('profiles').order('desc').collect();
    const result = await Promise.all(profiles.map(async (p) => {
      const sub = await ctx.db.query('subscriptions').withIndex('by_userId', (q) => q.eq('userId', p.userId)).unique();
      const knowledge = await ctx.db.query('knowledge').withIndex('by_userId', (q) => q.eq('userId', p.userId)).collect();
      const analytics = await ctx.db.query('analytics').withIndex('by_profileId', (q) => q.eq('profileId', p._id)).unique();
      return {
        ...p,
        plan: sub?.plan ?? 'free',
        messagesUsed: sub?.messagesUsed ?? 0,
        messagesLimit: sub?.messagesLimit ?? 50,
        knowledgeCount: knowledge.length,
        totalQuestions: analytics?.totalQuestions ?? 0,
      };
    }));
    return result;
  },
});

export const getAllFoundingMembers = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    return await ctx.db.query('founding').order('asc').collect();
  },
});

export const getAllEarlyAdopters = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    return await ctx.db.query('earlyAdopters').order('asc').collect();
  },
});

export const grantFoundingBadge = mutation({
  args: { adminId: v.string(), userId: v.string(), username: v.string(), displayName: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    const existing = await ctx.db
      .query('founding')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();
    if (existing) return { success: false, reason: 'already_has_badge' };
    const members = await ctx.db.query('founding').collect();
    await ctx.db.insert('founding', {
      userId: args.userId,
      username: args.username,
      displayName: args.displayName,
      claimedAt: Date.now(),
      spotNumber: members.length + 1,
    });
    return { success: true };
  },
});

export const grantEarlyAdopterBadge = mutation({
  args: { adminId: v.string(), userId: v.string(), username: v.string(), displayName: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    const existing = await ctx.db
      .query('earlyAdopters')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();
    if (existing) return { success: false, reason: 'already_has_badge' };
    const members = await ctx.db.query('earlyAdopters').collect();
    await ctx.db.insert('earlyAdopters', {
      userId: args.userId,
      username: args.username,
      displayName: args.displayName,
      claimedAt: Date.now(),
      spotNumber: members.length + 1,
    });
    return { success: true };
  },
});

export const removeBadge = mutation({
  args: { adminId: v.string(), userId: v.string(), type: v.union(v.literal('founding'), v.literal('earlyAdopter')) },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    if (args.type === 'founding') {
      const member = await ctx.db
        .query('founding')
        .withIndex('by_userId', (q) => q.eq('userId', args.userId))
        .first();
      if (member) await ctx.db.delete(member._id);
    } else {
      const member = await ctx.db
        .query('earlyAdopters')
        .withIndex('by_userId', (q) => q.eq('userId', args.userId))
        .first();
      if (member) await ctx.db.delete(member._id);
    }
    return { success: true };
  },
});

export const deleteProfile = mutation({
  args: { adminId: v.string(), profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.adminId);
    await ctx.db.delete(args.profileId);
    return { success: true };
  },
});
