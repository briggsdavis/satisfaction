import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const carousel = v.union(v.literal("collaboration"), v.literal("work"))
const tableFor = (c: "collaboration" | "work") =>
  c === "collaboration" ? "collaborationLogos" : "workLogos"

export const list = query({
  args: { carousel },
  handler: async (ctx, args) => {
    return await ctx.db.query(tableFor(args.carousel)).withIndex("by_order").take(500)
  },
})

export const add = mutation({
  args: {
    carousel,
    image: v.id("_storage"),
    alt: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const { carousel: c, ...data } = args
    return await ctx.db.insert(tableFor(c), data)
  },
})

export const update = mutation({
  args: {
    carousel,
    id: v.union(v.id("collaborationLogos"), v.id("workLogos")),
    image: v.optional(v.id("_storage")),
    alt: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const { carousel: _, id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const remove = mutation({
  args: {
    id: v.union(v.id("collaborationLogos"), v.id("workLogos")),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    await ctx.db.delete(args.id)
  },
})
