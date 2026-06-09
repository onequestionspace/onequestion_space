import { query } from "./_generated/server";

export const whoami = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});
