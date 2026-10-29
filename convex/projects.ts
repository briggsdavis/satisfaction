import { ConvexError, v } from "convex/values"
import type { Doc, Id } from "./_generated/dataModel"
import { query, type MutationCtx, type QueryCtx } from "./_generated/server"
import { adminMutation } from "./lib/auth"
import { patchDoc, removeDoc } from "./lib/crud"
import { url, urls } from "./lib/files"
import { setSlot, trimSlots } from "./lib/gallery"
import { slugify } from "./lib/slug"
import { project } from "./model"

// Card-sized projection for grids and carousels.
const card = async (ctx: QueryCtx, doc: Doc<"projects">) => ({
  _id: doc._id,
  slug: doc.slug,
  title: doc.title,
  featured: doc.featured,
  serviceIds: doc.serviceIds,
  coverUrl: await url(ctx, doc.cover),
})

const full = async (ctx: QueryCtx, doc: Doc<"projects">) => ({
  ...doc,
  coverUrl: await url(ctx, doc.cover),
  galleryUrls: await urls(ctx, doc.gallery.slots),
})

const cards = (ctx: QueryCtx, docs: Doc<"projects">[]) =>
  Promise.all(docs.map((doc) => card(ctx, doc)))

export const list = query({
  args: {},
  handler: async (ctx) => await cards(ctx, await ctx.db.query("projects").order("desc").take(500)),
})

export const featured = query({
  args: {},
  handler: async (ctx) =>
    await cards(
      ctx,
      await ctx.db
        .query("projects")
        .withIndex("by_featured", (q) => q.eq("featured", true))
        .take(100),
    ),
})

// Array membership isn't indexable; fine at portfolio scale. Swap for a join
// table if projects ever number in the thousands.
export const byService = query({
  args: { serviceId: v.id("services") },
  handler: async (ctx, { serviceId }) =>
    await cards(
      ctx,
      (await ctx.db.query("projects").take(500)).filter((p) => p.serviceIds.includes(serviceId)),
    ),
})

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const doc = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()
    return doc && (await full(ctx, doc))
  },
})

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get("projects", id)
    return doc && (await full(ctx, doc))
  },
})

const taken = async (ctx: QueryCtx, slug: string, self?: Id<"projects">) => {
  const doc = await ctx.db
    .query("projects")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first()
  return doc !== null && doc._id !== self
}

export const create = adminMutation({
  args: {},
  returns: v.id("projects"),
  handler: async (ctx) => {
    let slug = "new-project"
    for (let i = 2; await taken(ctx, slug); i++) slug = `new-project-${i}`
    const first = await ctx.db.query("services").withIndex("by_order").first()
    return await ctx.db.insert("projects", {
      slug,
      title: "New Project",
      description: "",
      approach: "",
      execution: "",
      results: "",
      serviceIds: first ? [first._id] : [],
      featured: false,
      gallery: { template: "long", orientation: "original", slots: [] },
    })
  },
})

export const update = adminMutation({
  args: {
    id: v.id("projects"),
    patch: project
      .omit("gallery", "cover")
      .partial()
      .extend({ cover: v.optional(v.union(v.id("_storage"), v.null())) }),
  },
  returns: v.null(),
  handler: async (ctx, { id, patch: { cover, ...patch } }) => {
    if (patch.slug !== undefined) {
      patch.slug = slugify(patch.slug)
      if (!patch.slug || (await taken(ctx, patch.slug, id))) throw new ConvexError("Slug is taken")
    }
    await patchDoc(
      ctx,
      "projects",
      id,
      cover === undefined ? patch : { ...patch, cover: cover ?? undefined },
    )
    return null
  },
})

export const remove = adminMutation({
  args: { id: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await removeDoc(ctx, "projects", id)
    return null
  },
})

const gallery = async (ctx: MutationCtx, id: Id<"projects">) => {
  const doc = await ctx.db.get("projects", id)
  if (!doc) throw new ConvexError("Project not found")
  return doc.gallery
}

export const setGallerySlot = adminMutation({
  args: { id: v.id("projects"), index: v.number(), image: v.union(v.id("_storage"), v.null()) },
  returns: v.null(),
  handler: async (ctx, { id, index, image }) => {
    const current = await gallery(ctx, id)
    const slots = setSlot(current.slots, index, image, current.template)
    await patchDoc(ctx, "projects", id, { gallery: { ...current, slots } })
    return null
  },
})

export const setGalleryLayout = adminMutation({
  args: { id: v.id("projects"), layout: project.fields.gallery.omit("slots").partial() },
  returns: v.null(),
  handler: async (ctx, { id, layout }) => {
    const current = await gallery(ctx, id)
    await patchDoc(ctx, "projects", id, {
      gallery: { ...current, ...layout, slots: trimSlots(current.slots) },
    })
    return null
  },
})
