import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

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
    return await ctx.db
      .query('blogs')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

export const getAllBlogs = query({
  args: {},
  handler: async (ctx) => {
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
    const { id, ...fields } = args;
    return await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const deleteBlog = mutation({
  args: { id: v.id('blogs') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
