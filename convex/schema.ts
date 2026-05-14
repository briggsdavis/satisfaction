import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // ── Homepage (singleton) ────────────────────────────────────────────────
  // All fields optional so the admin can populate the page incrementally.
  homepage: defineTable({
    heroImages: v.optional(
      v.array(v.object({ slot: v.number(), image: v.id("_storage") })),
    ),
    whatWeDoPanel1Body: v.optional(v.string()),
    whatWeDoPanel2Col1Label: v.optional(v.string()),
    whatWeDoPanel2Col1Body: v.optional(v.string()),
    whatWeDoPanel2Col2Label: v.optional(v.string()),
    whatWeDoPanel2Col2Body: v.optional(v.string()),
    campaignImage: v.optional(v.id("_storage")),
    faqCtaBody: v.optional(v.string()),
  }),

  // ── Logo carousels (two independent lists) ──────────────────────────────
  collaborationLogos: defineTable({
    image: v.id("_storage"),
    alt: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  workLogos: defineTable({
    image: v.id("_storage"),
    alt: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  // ── Services ────────────────────────────────────────────────────────────
  // Rendered on /services, homepage carousel, and contact form dropdown.
  services: defineTable({
    name: v.string(),
    image: v.id("_storage"),
    color: v.string(), // hex, used by hover tint + contact dropdown swatch
    bullets: v.array(v.string()),
    size: v.union(
      v.literal("short"),
      v.literal("medium"),
      v.literal("tall"),
      v.literal("xtall"),
    ),
    order: v.number(),
  }).index("by_order", ["order"]),

  // ── Portfolio: categories + projects (m2m) ──────────────────────────────
  categories: defineTable({
    slug: v.string(),
    name: v.string(),
    image: v.optional(v.id("_storage")),
    color: v.string(),
    bullets: v.array(v.string()),
    headline: v.string(),
    description: v.string(),
  }).index("by_slug", ["slug"]),

  projects: defineTable({
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
  })
    .index("by_slug", ["slug"])
    .index("by_featured", ["featured"]),

  // ── About ───────────────────────────────────────────────────────────────
  about: defineTable({
    values: v.array(
      v.object({
        image: v.optional(v.id("_storage")),
        label: v.string(),
        body: v.string(),
      }),
    ),
  }),

  aboutWheel: defineTable({
    heading: v.string(),
    body: v.string(),
    image: v.optional(v.id("_storage")),
    order: v.number(),
  }).index("by_order", ["order"]),

  aboutTimeline: defineTable({
    date: v.string(),
    client: v.string(), // big header
    campaign: v.optional(v.string()), // subhead, optional
    role: v.string(),
    description: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  // ── Contact ─────────────────────────────────────────────────────────────
  // Single source of truth for contact info + all social URLs.
  // Read by both the contact page sidebar and the footer.
  contactInfo: defineTable({
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    youtube: v.optional(v.string()),
  }),

  faqSections: defineTable({
    name: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  faqItems: defineTable({
    sectionId: v.id("faqSections"),
    question: v.string(),
    answer: v.string(),
    order: v.number(),
  }).index("by_section", ["sectionId", "order"]),

  // ── Footer ──────────────────────────────────────────────────────────────
  footer: defineTable({
    description: v.optional(v.string()),
  }),
})
