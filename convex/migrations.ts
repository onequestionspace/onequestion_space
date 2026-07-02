import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const remapClerkUser = internalMutation({
  args: { oldClerkId: v.string(), newClerkId: v.string() },
  handler: async (ctx, { oldClerkId, newClerkId }) => {
    const tables = ["profiles", "knowledge", "subscriptions", "founding", "earlyAdopters"] as const;

    for (const table of tables) {
      const docs = await ctx.db
        .query(table)
        .filter(q => q.eq(q.field("userId"), oldClerkId))
        .collect();

      for (const doc of docs) {
        await ctx.db.patch(doc._id, { userId: newClerkId });
      }

      console.log(`${table}: patched ${docs.length} row(s)`);
    }
  },
});
