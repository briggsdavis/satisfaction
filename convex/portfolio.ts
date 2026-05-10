import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// ── Categories ──────────────────────────────────────────────────────────

export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").take(100)
  },
})

export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique()
  },
})

export const createCategory = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    image: v.optional(v.id("_storage")),
    color: v.string(),
    bullets: v.array(v.string()),
    headline: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", args)
  },
})

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    slug: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    color: v.optional(v.string()),
    bullets: v.optional(v.array(v.string())),
    headline: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const removeCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

// ── Projects ────────────────────────────────────────────────────────────

export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").take(500)
  },
})

export const listFeaturedProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .take(500)
  },
})

export const listProjectsByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    // No index on categoryIds (array field). For typical project counts (<500)
    // a full-table scan is fine. If projects ever grow significantly, switch
    // to a join table (categoryProjects) with indexed lookups.
    const all = await ctx.db.query("projects").take(500)
    return all.filter((p) => p.categoryIds.includes(args.categoryId))
  },
})

export const getProjectBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique()
  },
})

export const createProject = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    approach: v.string(),
    execution: v.string(),
    results: v.string(),
    coverImage: v.optional(v.id("_storage")),
    gallery: v.array(v.id("_storage")),
    featured: v.boolean(),
    categoryIds: v.array(v.id("categories")),
    serviceIds: v.array(v.id("services")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", args)
  },
})

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    approach: v.optional(v.string()),
    execution: v.optional(v.string()),
    results: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
    gallery: v.optional(v.array(v.id("_storage"))),
    featured: v.optional(v.boolean()),
    categoryIds: v.optional(v.array(v.id("categories"))),
    serviceIds: v.optional(v.array(v.id("services"))),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const removeProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
