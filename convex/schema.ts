import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Convex Auth tables (users, authSessions, authAccounts, etc.)
  ...authTables,

  // ── Homepage (singleton) ────────────────────────────────────────────────
  // All fields optional so the admin can populate the page incrementally.
  homepage: defineTable({
    heroImages: v.optional(v.array(v.object({ slot: v.number(), image: v.id("_storage") }))),
    // The video shown on the 3D iMac screen in the hero. Served (and CDN-cached)
    // via the /hero-video HTTP route. Unset → the iMac keeps its baked-in GLB
    // screen texture (no video).
    heroVideo: v.optional(v.id("_storage")),
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

  // ── Services (formerly "categories") ────────────────────────────────────
  // The single unified list. Rendered on /services, /portfolio, the homepage
  // carousel, and the contact dropdown. Each one has a detail page at
  // /portfolio/:slug listing the projects assigned to it.
  // NOTE: `size`/`order` are optional during the services→categories migration
  // and defaulted in the UI; backfilled to every row by convex/migrate.ts.
  categories: defineTable({
    slug: v.string(),
    name: v.string(),
    image: v.optional(v.id("_storage")),
    color: v.string(),
    bullets: v.array(v.string()),
    headline: v.string(),
    description: v.string(),
    size: v.optional(
      v.union(v.literal("short"), v.literal("medium"), v.literal("tall"), v.literal("xtall")),
    ),
    order: v.optional(v.number()),
  }).index("by_slug", ["slug"]),

  webShowcases: defineTable({
    categoryId: v.id("categories"),
    media: v.id("_storage"),
    mediaType: v.union(v.literal("image"), v.literal("video")),
    supportImages: v.array(v.id("_storage")),
    order: v.number(),
  }).index("by_categoryId_and_order", ["categoryId", "order"]),

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
    // The unified list of services this project is filed under. Also rendered
    // as the project's chips/tags. (Field name kept as `categoryIds` since the
    // surviving table is still physically `categories`.)
    categoryIds: v.array(v.id("categories")),
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
