import { v } from "convex/values"
import { api } from "./_generated/api"
import { action, mutation, query } from "./_generated/server"

const sizeValidator = v.union(
  v.literal("short"),
  v.literal("medium"),
  v.literal("tall"),
  v.literal("xtall"),
)

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("services").withIndex("by_order").take(100)
  },
})

export const get = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    image: v.id("_storage"),
    color: v.string(),
    bullets: v.array(v.string()),
    size: sizeValidator,
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("services", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("services"),
    name: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    color: v.optional(v.string()),
    bullets: v.optional(v.array(v.string())),
    size: v.optional(sizeValidator),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

// One-off seed action: fetch an image URL, store it, then create the service.
export const seed = action({
  args: {
    name: v.string(),
    color: v.string(),
    bullets: v.array(v.string()),
    size: sizeValidator,
    order: v.number(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const res = await fetch(args.imageUrl)
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
    const blob = await res.blob()
    const image = await ctx.storage.store(blob)
    await ctx.runMutation(api.services.create, {
      name: args.name,
      color: args.color,
      bullets: args.bullets,
      size: args.size,
      order: args.order,
      image,
    })
  },
})
