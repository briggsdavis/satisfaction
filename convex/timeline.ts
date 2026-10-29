import { v } from "convex/values"
import { query } from "./_generated/server"
import { adminMutation } from "./lib/auth"
import { crud, nextOrder } from "./lib/crud"
import { timelineItem } from "./model"

export const list = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("timeline").withIndex("by_order").take(100),
})

export const create = adminMutation({
  args: {},
  returns: v.id("timeline"),
  handler: async (ctx) => {
    const last = await ctx.db.query("timeline").withIndex("by_order").order("desc").first()
    return await ctx.db.insert("timeline", {
      date: "",
      client: "New Entry",
      role: "",
      description: "",
      order: nextOrder(last),
    })
  },
})

export const { update, remove, reorder } = crud("timeline", timelineItem.omit("order"))
