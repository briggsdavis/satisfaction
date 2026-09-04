import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"
import schema from "./schema"

// ── Categories ──────────────────────────────────────────────────────────

export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").take(100)
    // Sort by `order` (rows missing it sort last, then by creation time).
    return categories.sort((a, b) => {
      const ao = a.order ?? Number.MAX_SAFE_INTEGER
      const bo = b.order ?? Number.MAX_SAFE_INTEGER
      return ao - bo || a._creationTime - b._creationTime
    })
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

const sizeValidator = v.union(
  v.literal("short"),
  v.literal("medium"),
  v.literal("tall"),
  v.literal("xtall"),
)

export const createCategory = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    image: v.optional(v.id("_storage")),
    color: v.string(),
    bullets: v.array(v.string()),
    headline: v.string(),
    description: v.string(),
    size: v.optional(sizeValidator),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
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
    size: v.optional(sizeValidator),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const { id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const removeCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    await ctx.db.delete(args.id)
  },
})

// ── Web development showcase ───────────────────────────────────────────

const mediaType = v.union(v.literal("image"), v.literal("video"))

export const listWebShowcases = query({
  args: { categoryId: v.id("categories") },
  returns: v.array(schema.doc("webShowcases")),
  handler: async (ctx, { categoryId }) =>
    await ctx.db
      .query("webShowcases")
      .withIndex("by_categoryId_and_order", (q) => q.eq("categoryId", categoryId))
      .take(24),
})

export const createWebShowcase = mutation({
  args: { categoryId: v.id("categories"), media: v.id("_storage"), mediaType },
  returns: v.id("webShowcases"),
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const last = await ctx.db
      .query("webShowcases")
      .withIndex("by_categoryId_and_order", (q) => q.eq("categoryId", args.categoryId))
      .order("desc")
      .first()
    return await ctx.db.insert("webShowcases", {
      ...args,
      supportImages: [],
      order: (last?.order ?? -1) + 1,
    })
  },
})

export const updateWebShowcase = mutation({
  args: {
    id: v.id("webShowcases"),
    media: v.optional(v.id("_storage")),
    mediaType: v.optional(mediaType),
    supportImages: v.optional(v.array(v.id("_storage"))),
  },
  returns: v.null(),
  handler: async (ctx, { id, ...patch }) => {
    await requireAuth(ctx)
    await ctx.db.patch(id, patch)
    return null
  },
})

export const removeWebShowcase = mutation({
  args: { id: v.id("webShowcases") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx)
    await ctx.db.delete(id)
    return null
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
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
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
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const { id, ...patch } = args
    await ctx.db.patch(id, patch)
  },
})

export const removeProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    await ctx.db.delete(args.id)
  },
})
