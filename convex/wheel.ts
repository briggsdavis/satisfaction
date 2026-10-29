import { v } from "convex/values"
import { query } from "./_generated/server"
import { adminMutation } from "./lib/auth"
import { crud, nextOrder } from "./lib/crud"
import { url } from "./lib/files"
import { wheelItem } from "./model"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("wheel").withIndex("by_order").take(50)
    return await Promise.all(
      docs.map(async (doc) => ({ ...doc, imageUrl: await url(ctx, doc.image) })),
    )
  },
})

export const create = adminMutation({
  args: {},
  returns: v.id("wheel"),
  handler: async (ctx) => {
    const last = await ctx.db.query("wheel").withIndex("by_order").order("desc").first()
    return await ctx.db.insert("wheel", { heading: "New Item", body: "", order: nextOrder(last) })
  },
})

export const { update, remove, reorder } = crud("wheel", wheelItem.omit("order"))
