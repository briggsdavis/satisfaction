import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import * as m from "./model"

// Flip to `false` only for the one-off v1 -> v2 migration deploy (see migrations.ts).
const schemaValidation = true

// v1 tables, read once by `migrations:v2` and emptied by it. Delete this block
// (and migrations.ts) after every deployment has been migrated.
const legacy = Object.fromEntries(
  [
    "homepage",
    "footer",
    "contactInfo",
    "about",
    "aboutWheel",
    "aboutTimeline",
    "categories",
    "webShowcases",
    "collaborationLogos",
    "workLogos",
    "onboardSubmissions",
  ].map((name) => [name, defineTable(v.any())]),
)

export default defineSchema(
  {
    ...authTables,
    ...legacy,

    site: defineTable(m.site),

    services: defineTable(m.service).index("by_slug", ["slug"]).index("by_order", ["order"]),

    projects: defineTable(m.project).index("by_slug", ["slug"]).index("by_featured", ["featured"]),

    showcases: defineTable(m.showcase).index("by_serviceId_and_order", ["serviceId", "order"]),

    logos: defineTable(m.logo).index("by_carousel_and_order", ["carousel", "order"]),

    wheel: defineTable(m.wheelItem).index("by_order", ["order"]),

    timeline: defineTable(m.timelineItem).index("by_order", ["order"]),

    faqSections: defineTable(m.faqSection).index("by_order", ["order"]),

    faqItems: defineTable(m.faqItem).index("by_sectionId_and_order", ["sectionId", "order"]),

    leads: defineTable(m.lead).index("by_read", ["read"]),
  },
  { schemaValidation },
)
