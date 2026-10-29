import { v } from "convex/values"
import { query } from "./_generated/server"
import { adminMutation } from "./lib/auth"
import { crud, nextOrder } from "./lib/crud"
import { url } from "./lib/files"
import { carousel, logo } from "./model"

export const list = query({
  args: { carousel },
  handler: async (ctx, { carousel }) => {
    const docs = await ctx.db
      .query("logos")
      .withIndex("by_carousel_and_order", (q) => q.eq("carousel", carousel))
      .take(200)
    return await Promise.all(docs.map(async (doc) => ({ ...doc, url: await url(ctx, doc.image) })))
  },
})

export const add = adminMutation({
  args: { carousel, logos: v.array(logo.pick("image", "alt")) },
  returns: v.null(),
  handler: async (ctx, { carousel, logos }) => {
    const last = await ctx.db
      .query("logos")
      .withIndex("by_carousel_and_order", (q) => q.eq("carousel", carousel))
      .order("desc")
      .first()
    const start = nextOrder(last)
    for (const [i, entry] of logos.entries())
      await ctx.db.insert("logos", { carousel, ...entry, order: start + i })
    return null
  },
})

export const { update, remove, reorder } = crud("logos", logo.pick("image", "alt"))
