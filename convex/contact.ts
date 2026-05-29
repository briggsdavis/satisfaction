import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// ── Contact info singleton (also feeds the footer) ──────────────────────

export const getInfo = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contactInfo").first()
  },
})

export const patchInfo = mutation({
  args: {
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    youtube: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const existing = await ctx.db.query("contactInfo").first()
    if (existing) {
      await ctx.db.patch(existing._id, args)
      return existing._id
    }
    return await ctx.db.insert("contactInfo", args)
  },
})

// ── FAQ sections ────────────────────────────────────────────────────────

export const listFaqSections = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faqSections").withIndex("by_order").take(100)
  },
})

export const createFaqSection = mutation({
  args: { name: v.string(), order: v.number() },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.insert("faqSections", args)
  },
})

export const updateFaqSection = mutation({
  args: {
    id: v.id("faqSections"),
    name: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const { id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const removeFaqSection = mutation({
  args: { id: v.id("faqSections") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    // Cascade-delete items in this section.
    const items = await ctx.db
      .query("faqItems")
      .withIndex("by_section", (q) => q.eq("sectionId", args.id))
      .take(500)
    for (const item of items) {
      await ctx.db.delete(item._id)
    }
    await ctx.db.delete(args.id)
  },
})

// ── FAQ items ───────────────────────────────────────────────────────────

export const listFaqItems = query({
  args: { sectionId: v.id("faqSections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("faqItems")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .take(500)
  },
})

export const createFaqItem = mutation({
  args: {
    sectionId: v.id("faqSections"),
    question: v.string(),
    answer: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.insert("faqItems", args)
  },
})

export const updateFaqItem = mutation({
  args: {
    id: v.id("faqItems"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const { id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const removeFaqItem = mutation({
  args: { id: v.id("faqItems") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    await ctx.db.delete(args.id)
  },
})
