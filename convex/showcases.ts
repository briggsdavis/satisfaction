import { ConvexError, v } from "convex/values"
import { query } from "./_generated/server"
import { adminMutation } from "./lib/auth"
import { crud, nextOrder, patchDoc } from "./lib/crud"
import { url } from "./lib/files"
import { setSlot } from "./lib/gallery"
import { media, showcase, type Media } from "./model"

export const list = query({
  args: { serviceId: v.id("services") },
  handler: async (ctx, { serviceId }) => {
    const docs = await ctx.db
      .query("showcases")
      .withIndex("by_serviceId_and_order", (q) => q.eq("serviceId", serviceId))
      .take(24)
    const resolve = async (m: Media | null) => m && { ...m, url: await url(ctx, m.id) }
    return await Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        media: (await resolve(doc.media))!,
        support: await Promise.all(doc.support.map(resolve)),
      })),
    )
  },
})

export const create = adminMutation({
  args: { serviceId: v.id("services"), media },
  returns: v.id("showcases"),
  handler: async (ctx, { serviceId, media }) => {
    const last = await ctx.db
      .query("showcases")
      .withIndex("by_serviceId_and_order", (q) => q.eq("serviceId", serviceId))
      .order("desc")
      .first()
    return await ctx.db.insert("showcases", {
      serviceId,
      media,
      support: [],
      order: nextOrder(last),
    })
  },
})

export const { update, remove, reorder } = crud("showcases", showcase.pick("media"))

export const setSupport = adminMutation({
  args: { id: v.id("showcases"), index: v.number(), media: v.union(media, v.null()) },
  returns: v.null(),
  handler: async (ctx, { id, index, media }) => {
    const doc = await ctx.db.get("showcases", id)
    if (!doc) throw new ConvexError("Showcase not found")
    await patchDoc(ctx, "showcases", id, { support: setSlot(doc.support, index, media, "short") })
    return null
  },
})
