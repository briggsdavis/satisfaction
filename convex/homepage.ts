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
    heroVideo: v.optional(v.id("_storage")),
    // Explicit flag to unset heroVideo (revert to the bundled default). A plain
    // optional arg can't clear a field — an omitted arg is indistinguishable
    // from "leave unchanged".
    clearHeroVideo: v.optional(v.boolean()),
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
    const { clearHeroVideo, ...rest } = args
    // Setting a field to `undefined` in a patch deletes it.
    const updates = clearHeroVideo ? { ...rest, heroVideo: undefined } : rest
    const existing = await ctx.db.query("homepage").first()
    if (existing) {
      await ctx.db.patch(existing._id, updates)
      return existing._id
    }
    return await ctx.db.insert("homepage", updates)
  },
})
