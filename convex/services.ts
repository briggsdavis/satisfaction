import { ConvexError, v } from "convex/values"
import type { Doc } from "./_generated/dataModel"
import { query, type QueryCtx } from "./_generated/server"
import { adminMutation } from "./lib/auth"
import { crud, nextOrder, patchDoc, removeDoc } from "./lib/crud"
import { url } from "./lib/files"
import { slugify } from "./lib/slug"
import { service } from "./model"

const withUrl = async (ctx: QueryCtx, doc: Doc<"services">) => ({
  ...doc,
  imageUrl: await url(ctx, doc.image),
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("services").withIndex("by_order").take(100)
    return await Promise.all(docs.map((doc) => withUrl(ctx, doc)))
  },
})

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const doc = await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()
    return doc && (await withUrl(ctx, doc))
  },
})

export const get = query({
  args: { id: v.id("services") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get("services", id)
    return doc && (await withUrl(ctx, doc))
  },
})

export const create = adminMutation({
  args: {},
  returns: v.id("services"),
  handler: async (ctx) => {
    const last = await ctx.db.query("services").withIndex("by_order").order("desc").first()
    let slug = "new-service"
    for (let i = 2; await taken(ctx, slug); i++) slug = `new-service-${i}`
    return await ctx.db.insert("services", {
      slug,
      name: "New Service",
      color: "#FFFFFF",
      headline: "",
      description: "",
      bullets: [],
      size: "medium",
      hero: "default",
      order: nextOrder(last),
    })
  },
})

const taken = async (ctx: QueryCtx, slug: string) =>
  (await ctx.db
    .query("services")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first()) !== null

export const { reorder } = crud("services", service.omit("order"))

export const update = adminMutation({
  args: { id: v.id("services"), patch: service.omit("order").partial() },
  returns: v.null(),
  handler: async (ctx, { id, patch }) => {
    if (patch.slug !== undefined) {
      patch.slug = slugify(patch.slug)
      const clash = await ctx.db
        .query("services")
        .withIndex("by_slug", (q) => q.eq("slug", patch.slug!))
        .first()
      if (!patch.slug || (clash && clash._id !== id)) throw new ConvexError("Slug is taken")
    }
    await patchDoc(ctx, "services", id, patch)
    return null
  },
})

/** Deletes a service, its showcases, and its tag on every project. */
export const remove = adminMutation({
  args: { id: v.id("services") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const showcases = await ctx.db
      .query("showcases")
      .withIndex("by_serviceId_and_order", (q) => q.eq("serviceId", id))
      .take(100)
    for (const showcase of showcases) await removeDoc(ctx, "showcases", showcase._id)
    for (const project of await ctx.db.query("projects").take(500))
      if (project.serviceIds.includes(id))
        await ctx.db.patch("projects", project._id, {
          serviceIds: project.serviceIds.filter((s) => s !== id),
        })
    await removeDoc(ctx, "services", id)
    return null
  },
})
