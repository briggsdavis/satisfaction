import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const valueObject = v.object({
  image: v.optional(v.id("_storage")),
  label: v.string(),
  body: v.string(),
})

// ── About singleton (the 3 value cards) ─────────────────────────────────

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("about").first()
  },
})

export const upsert = mutation({
  args: { values: v.array(valueObject) },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const existing = await ctx.db.query("about").first()
    if (existing) {
      await ctx.db.replace(existing._id, args)
      return existing._id
    }
    return await ctx.db.insert("about", args)
  },
})

// ── Wheel items ─────────────────────────────────────────────────────────

export const listWheel = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aboutWheel").withIndex("by_order").take(100)
  },
})

export const createWheel = mutation({
  args: {
    heading: v.string(),
    body: v.string(),
    image: v.optional(v.id("_storage")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.insert("aboutWheel", args)
  },
})

export const updateWheel = mutation({
  args: {
    id: v.id("aboutWheel"),
    heading: v.optional(v.string()),
    body: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const { id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const removeWheel = mutation({
  args: { id: v.id("aboutWheel") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    await ctx.db.delete(args.id)
  },
})

// ── Timeline entries ────────────────────────────────────────────────────

export const listTimeline = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aboutTimeline").withIndex("by_order").take(100)
  },
})

export const createTimeline = mutation({
  args: {
    date: v.string(),
    client: v.string(),
    campaign: v.optional(v.string()),
    role: v.string(),
    description: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.insert("aboutTimeline", args)
  },
})

export const updateTimeline = mutation({
  args: {
    id: v.id("aboutTimeline"),
    date: v.optional(v.string()),
    client: v.optional(v.string()),
    campaign: v.optional(v.string()),
    role: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const { id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const removeTimeline = mutation({
  args: { id: v.id("aboutTimeline") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    await ctx.db.delete(args.id)
  },
})
