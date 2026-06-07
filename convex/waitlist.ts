import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addToWaitlist = mutation({
  args: {
    email: v.string(),
    role: v.optional(v.string()),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    await ctx.db.insert("waitlist", {
      email: args.email,
      role: args.role,
      name: args.name,
      username: args.username,
      createdAt: Date.now(),
    });

    const all = await ctx.db.query("waitlist").collect();
    const position = all.length;
    return { position };
  },
});
