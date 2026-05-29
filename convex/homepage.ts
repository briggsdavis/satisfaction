import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("homepage").first()
  },
})

export const patch = mutation({
  args: {
    heroImages: v.optional(v.array(v.object({ slot: v.number(), image: v.id("_storage") }))),
    whatWeDoPanel1Body: v.optional(v.string()),
    whatWeDoPanel2Col1Label: v.optional(v.string()),
    whatWeDoPanel2Col1Body: v.optional(v.string()),
    whatWeDoPanel2Col2Label: v.optional(v.string()),
    whatWeDoPanel2Col2Body: v.optional(v.string()),
    campaignImage: v.optional(v.id("_storage")),
    faqCtaBody: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const existing = await ctx.db.query("homepage").first()
    if (existing) {
      await ctx.db.patch(existing._id, args)
      return existing._id
    }
    return await ctx.db.insert("homepage", args)
  },
})
