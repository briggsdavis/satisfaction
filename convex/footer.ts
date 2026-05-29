import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("footer").first()
  },
})

export const patch = mutation({
  args: { description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const existing = await ctx.db.query("footer").first()
    if (existing) {
      await ctx.db.patch(existing._id, args)
      return existing._id
    }
    return await ctx.db.insert("footer", args)
  },
})
