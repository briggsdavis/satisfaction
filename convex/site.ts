import { v } from "convex/values"
import { query, type QueryCtx } from "./_generated/server"
import { adminMutation } from "./lib/auth"
import { prune, url, urls } from "./lib/files"
import { defaultSite, site } from "./model"

const load = async (ctx: QueryCtx) => await ctx.db.query("site").first()

export const get = query({
  args: {},
  handler: async (ctx) => {
    const doc = { ...defaultSite, ...(await load(ctx)) }
    const [heroImageUrls, campaignImageUrl, valueUrls] = await Promise.all([
      urls(ctx, doc.heroImages),
      url(ctx, doc.campaignImage),
      urls(
        ctx,
        doc.values.map((value) => value.image),
      ),
    ])
    return {
      ...doc,
      heroImageUrls,
      campaignImageUrl,
      values: doc.values.map((value, i) => ({ ...value, imageUrl: valueUrls[i] })),
    }
  },
})

/** Replaces whole top-level sections. `null` clears an optional file field. */
export const update = adminMutation({
  args: {
    patch: site
      .omit("heroVideo", "campaignImage")
      .partial()
      .extend({
        heroVideo: v.optional(v.union(v.id("_storage"), v.null())),
        campaignImage: v.optional(v.union(v.id("_storage"), v.null())),
      }),
  },
  returns: v.null(),
  handler: async (ctx, { patch }) => {
    const before = await ctx.db.query("site").first()
    const next = Object.fromEntries(
      Object.entries(patch).map(([key, value]) => [key, value ?? undefined]),
    )
    if (before) await ctx.db.patch("site", before._id, next)
    else await ctx.db.insert("site", { ...defaultSite, ...next })
    await prune(ctx, before, await ctx.db.query("site").first())
    return null
  },
})
