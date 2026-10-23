import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { isAdminUser } from './userIds';
import type { QueryCtx, MutationCtx } from './_generated/server';

async function assertAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !isAdminUser(identity.subject)) throw new Error('Unauthorized');
}

export const getPublishedBlogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('blogs')
      .withIndex('by_published', (q) => q.eq('published', true))
      .order('desc')
      .collect();
  },
});

export const getBlogBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query('blogs')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
    return blog?.published ? blog : null;
  },
});

export const getAllBlogs = query({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    return await ctx.db.query('blogs').order('desc').collect();
  },
});

export const createBlog = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    author: v.string(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    if (!args.title.trim() || !/^[a-z0-9-]{1,160}$/.test(args.slug) || args.title.length > 200
      || args.excerpt.length > 1000 || args.content.length > 100000) throw new Error('Invalid blog content');
    return await ctx.db.insert('blogs', {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateBlog = mutation({
  args: {
    id: v.id('blogs'),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const { id, ...fields } = args;
    if ((fields.slug !== undefined && !/^[a-z0-9-]{1,160}$/.test(fields.slug))
      || (fields.title !== undefined && fields.title.length > 200)
      || (fields.excerpt !== undefined && fields.excerpt.length > 1000)
      || (fields.content !== undefined && fields.content.length > 100000)) throw new Error('Invalid blog content');
    return await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const deleteBlog = mutation({
  args: { id: v.id('blogs') },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    return await ctx.db.delete(args.id);
  },
});
