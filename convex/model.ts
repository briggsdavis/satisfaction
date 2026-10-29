import { v, type Infer } from "convex/values"

// Single source of truth for every stored shape. Tables, args, and client
// types all derive from these.

const file = v.id("_storage")
const slot = v.union(file, v.null())

export const mediaType = v.union(v.literal("image"), v.literal("video"))
export const media = v.object({ id: file, type: mediaType })
export type Media = Infer<typeof media>

// ── Site singleton ───────────────────────────────────────────────────────────

const column = v.object({ label: v.string(), body: v.string() })
export const value = v.object({ label: v.string(), body: v.string(), image: v.optional(file) })

export const contact = v.object({
  email: v.string(),
  phone: v.string(),
  location: v.string(),
  instagram: v.string(),
  tiktok: v.string(),
  linkedin: v.string(),
  youtube: v.string(),
})

export const site = v.object({
  heroImages: v.array(slot),
  heroVideo: v.optional(file),
  whatWeDo: v.object({ body: v.string(), left: column, right: column }),
  campaignImage: v.optional(file),
  faqCta: v.string(),
  footer: v.string(),
  contact,
  values: v.array(value),
})
export type Site = Infer<typeof site>

export const HERO_SLOTS = 10
export const VALUE_SLOTS = 3

const blank = { label: "", body: "" }
export const defaultSite: Site = {
  heroImages: Array(HERO_SLOTS).fill(null),
  whatWeDo: { body: "", left: blank, right: blank },
  faqCta: "",
  footer: "",
  contact: {
    email: "",
    phone: "",
    location: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
    youtube: "",
  },
  values: Array.from({ length: VALUE_SLOTS }, () => blank),
}

// ── Services ─────────────────────────────────────────────────────────────────

export const serviceSize = v.union(
  v.literal("short"),
  v.literal("medium"),
  v.literal("tall"),
  v.literal("xtall"),
)

// Which bespoke hero a service page renders. Decoupled from the slug so a
// rename never silently drops the design.
export const heroVariants = [
  "default",
  "social-media",
  "branding",
  "motion-graphics",
  "creative-direction",
  "photography",
  "videography",
  "graphic-design",
  "web-development",
] as const
export const heroVariant = v.union(...heroVariants.map((h) => v.literal(h)))
export type HeroVariant = Infer<typeof heroVariant>

export const service = v.object({
  slug: v.string(),
  name: v.string(),
  color: v.string(),
  headline: v.string(),
  description: v.string(),
  bullets: v.array(v.string()),
  image: v.optional(file),
  size: serviceSize,
  hero: heroVariant,
  order: v.number(),
})

// ── Projects ─────────────────────────────────────────────────────────────────

export const galleryTemplate = v.union(v.literal("long"), v.literal("short"))
export const galleryOrientation = v.union(
  v.literal("original"),
  v.literal("horizontal"),
  v.literal("vertical"),
  v.literal("both"),
)
export type GalleryTemplate = Infer<typeof galleryTemplate>
export type GalleryOrientation = Infer<typeof galleryOrientation>

export const gallery = v.object({
  template: galleryTemplate,
  orientation: galleryOrientation,
  slots: v.array(slot),
})

export const project = v.object({
  slug: v.string(),
  title: v.string(),
  description: v.string(),
  approach: v.string(),
  execution: v.string(),
  results: v.string(),
  cover: v.optional(file),
  serviceIds: v.array(v.id("services")),
  featured: v.boolean(),
  gallery,
})

// ── Web showcases ────────────────────────────────────────────────────────────

export const showcase = v.object({
  serviceId: v.id("services"),
  media,
  support: v.array(v.union(media, v.null())),
  order: v.number(),
})

// ── Lists ────────────────────────────────────────────────────────────────────

export const carousel = v.union(v.literal("collaboration"), v.literal("work"))
export type Carousel = Infer<typeof carousel>

export const logo = v.object({ carousel, image: file, alt: v.string(), order: v.number() })

export const wheelItem = v.object({
  heading: v.string(),
  body: v.string(),
  image: v.optional(file),
  order: v.number(),
})

export const timelineItem = v.object({
  date: v.string(),
  client: v.string(),
  campaign: v.optional(v.string()),
  role: v.string(),
  description: v.string(),
  order: v.number(),
})

export const faqSection = v.object({ name: v.string(), order: v.number() })
export const faqItem = v.object({
  sectionId: v.id("faqSections"),
  question: v.string(),
  answer: v.string(),
  order: v.number(),
})

// ── Leads ────────────────────────────────────────────────────────────────────

export const leadKind = v.union(v.literal("contact"), v.literal("branding"))
export const lead = v.object({
  kind: leadKind,
  name: v.string(),
  email: v.string(),
  fields: v.record(v.string(), v.string()),
  read: v.boolean(),
})
