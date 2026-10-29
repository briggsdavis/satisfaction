import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { internalMutation } from "./_generated/server"
import { trimSlots } from "./lib/gallery"
import { defaultSite, heroVariants, HERO_SLOTS, type HeroVariant, type Media } from "./model"

/**
 * One-off v1 -> v2 data migration. Idempotent: each legacy table is emptied as
 * it's copied, so re-running is a no-op.
 *
 * Per deployment:
 *   1. Set `schemaValidation = false` in schema.ts, deploy.
 *   2. `bun x convex run migrations:v2` (add `--prod` for production).
 *   3. Set `schemaValidation = true`, deploy. Deploy fails loudly if anything was missed.
 * Then delete this file and the `legacy` block in schema.ts.
 */

type File = Id<"_storage">
// Legacy docs are untyped (`v.any()` tables).
type Any = Record<string, any>

export const v2 = internalMutation({
  args: {},
  returns: v.record(v.string(), v.number()),
  handler: async (ctx) => {
    const counts: Record<string, number> = {}
    const drain = async (table: string) => {
      const docs = (await ctx.db.query(table as "site").take(1000)) as Any[]
      for (const doc of docs) await ctx.db.delete(doc._id)
      counts[table] = docs.length
      return docs
    }

    // ── site singleton ──
    const [home] = await drain("homepage")
    const [footer] = await drain("footer")
    const [contact] = await drain("contactInfo")
    const [about] = await drain("about")
    if (home || footer || contact || about) {
      const heroImages: (File | null)[] = Array(HERO_SLOTS).fill(null)
      for (const { slot, image } of home?.heroImages ?? []) heroImages[slot] = image
      const values = defaultSite.values.map((blank, i) => {
        const { label = "", body = "", image } = about?.values?.[i] ?? blank
        return image ? { label, body, image } : { label, body }
      })
      const site = {
        ...defaultSite,
        heroImages,
        ...(home?.heroVideo && { heroVideo: home.heroVideo }),
        ...(home?.campaignImage && { campaignImage: home.campaignImage }),
        whatWeDo: {
          body: home?.whatWeDoPanel1Body ?? "",
          left: {
            label: home?.whatWeDoPanel2Col1Label ?? "",
            body: home?.whatWeDoPanel2Col1Body ?? "",
          },
          right: {
            label: home?.whatWeDoPanel2Col2Label ?? "",
            body: home?.whatWeDoPanel2Col2Body ?? "",
          },
        },
        faqCta: home?.faqCtaBody ?? "",
        footer: footer?.description ?? "",
        contact: Object.fromEntries(
          Object.keys(defaultSite.contact).map((key) => [key, contact?.[key] ?? ""]),
        ) as typeof defaultSite.contact,
        values,
      }
      const existing = await ctx.db.query("site").first()
      if (existing) await ctx.db.replace("site", existing._id, site)
      else await ctx.db.insert("site", site)
    }

    // ── services (new ids; remember the mapping) ──
    const serviceIds = new Map<string, Id<"services">>()
    const categories = (await drain("categories")).sort(
      (a, b) => (a.order ?? 1e9) - (b.order ?? 1e9) || a._creationTime - b._creationTime,
    )
    for (const [order, c] of categories.entries()) {
      const id = await ctx.db.insert("services", {
        slug: c.slug,
        name: c.name,
        color: c.color,
        headline: c.headline,
        description: c.description,
        bullets: c.bullets,
        ...(c.image && { image: c.image }),
        size: c.size ?? "medium",
        hero: (heroVariants as readonly string[]).includes(c.slug)
          ? (c.slug as HeroVariant)
          : "default",
        order,
      })
      serviceIds.set(c._id, id)
    }
    const mapServices = (ids: string[]) =>
      ids.map((id) => serviceIds.get(id)).filter((id): id is Id<"services"> => !!id)

    // ── projects (in place) ──
    let projects = 0
    for (const p of (await ctx.db.query("projects").take(1000)) as Any[]) {
      if (!("categoryIds" in p)) continue
      const slots: (File | null)[] = p.galleryLayout
        ? p.galleryLayout.flat().map((s: Any) => s.image ?? null)
        : p.gallery
      await ctx.db.replace("projects", p._id, {
        slug: p.slug,
        title: p.title,
        description: p.description,
        approach: p.approach,
        execution: p.execution,
        results: p.results,
        ...(p.coverImage && { cover: p.coverImage }),
        serviceIds: mapServices(p.categoryIds),
        featured: p.featured,
        gallery: {
          template: p.galleryTemplate ?? "long",
          orientation: p.galleryOrientation ?? "original",
          slots: trimSlots(slots),
        },
      })
      projects++
    }
    counts.projects = projects

    // ── showcases ──
    for (const s of await drain("webShowcases")) {
      const serviceId = serviceIds.get(s.categoryId)
      if (!serviceId) continue
      const support: (Media | null)[] = s.supportImages.map((id: File | null, i: number) =>
        id ? { id, type: s.supportMediaTypes?.[i] ?? "image" } : null,
      )
      await ctx.db.insert("showcases", {
        serviceId,
        media: { id: s.media, type: s.mediaType },
        support: trimSlots(support),
        order: s.order,
      })
    }

    // ── lists ──
    for (const carousel of ["collaboration", "work"] as const)
      for (const l of await drain(`${carousel}Logos`))
        await ctx.db.insert("logos", { carousel, image: l.image, alt: l.alt, order: l.order })
    for (const w of await drain("aboutWheel"))
      await ctx.db.insert("wheel", {
        heading: w.heading,
        body: w.body,
        ...(w.image && { image: w.image }),
        order: w.order,
      })
    for (const t of await drain("aboutTimeline"))
      await ctx.db.insert("timeline", {
        date: t.date,
        client: t.client,
        ...(t.campaign && { campaign: t.campaign }),
        role: t.role,
        description: t.description,
        order: t.order,
      })
    await drain("onboardSubmissions")

    return counts
  },
})
