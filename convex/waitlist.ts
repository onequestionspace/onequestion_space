import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addToWaitlist = mutation({
  args: {
    email: v.string(),
    role: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("waitlist", {
      email: args.email,
      role: args.role,
      createdAt: Date.now(),
    });
  },
});
