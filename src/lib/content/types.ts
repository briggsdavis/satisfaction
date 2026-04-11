// ─── Portfolio ────────────────────────────────────────────────────────────────

export type Project = {
  slug: string
  title: string
  tags: [string, string]
  descriptor: string
  img: string
  description: string
}

export type CategoryOverview = {
  headline: string
  description: string
  problem: string
  solution: string
  execution: string
  results: string
}

export type Category = {
  slug: string
  name: string
  img: string
  height: string
  bullets: string[]
  overview: CategoryOverview
  projects: Project[]
}

// ─── Services ─────────────────────────────────────────────────────────────────
// Unified type feeding both the Services page grid and the Homepage stats scroll

export type Service = {
  name: string
  tag: string
  desc: string
  bullets: string[]
  inverted: boolean
  minH: string
  // Homepage stats grid fields
  gridImg: string
  gridRotate: number
  gridDelay: number
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export type Brand = {
  name: string
  logo?: string
}

// ─── Featured (homepage cascade) ─────────────────────────────────────────────
// Stores slugs of 3 projects to feature; resolved at runtime from CATEGORIES

export type FeaturedSlugs = [string, string, string]

// ─── Home copy ────────────────────────────────────────────────────────────────

export type HeroCopy = {
  topLeft: string
  topRight: string
  bottomLeft: string
  bottomRight: string
}

export type WhatWeDoCopy = {
  panel1Title: string
  panel1Body: string
  panel2Title: string
  panel2Col1Label: string
  panel2Col1Body: string
  panel2Col2Label: string
  panel2Col2Body: string
}

export type CampaignWords = [string, string, string, string]

// ─── About ────────────────────────────────────────────────────────────────────

export type AboutBody = [string, string, string]

export type TimelineEntry = {
  date: string
  client: string
  campaign: string | null
  role: string
  description: string
}

export type ValueCard = {
  label: string
  img: string
  offset: string
  delay: number
  body: string
}

// ─── FAQ / Contact ────────────────────────────────────────────────────────────

export type FaqItem = {
  q: string
  a: string
}

export type FaqSection = {
  section: string
  items: FaqItem[]
}

export type ContactInfo = {
  email: string
  phone: string
  location: string
  instagram: string
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export type SocialLink = {
  label: string
  href: string
}

export type FooterCopy = {
  description: string
  email: string
  socialLinks: SocialLink[]
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export type SeoCopy = {
  title: string
  description: string
  keywords: string
  author: string
  ogTitle: string
  ogDescription: string
  ogUrl: string
  ogSiteName: string
  twitterTitle: string
  twitterDescription: string
  twitterCreator: string
  canonical: string
}

// ─── Root content object ──────────────────────────────────────────────────────

export type SiteContent = {
  categories: Category[]
  services: Service[]
  brands: Brand[]
  featuredSlugs: FeaturedSlugs
  hero: HeroCopy
  whatWeDo: WhatWeDoCopy
  campaignWords: CampaignWords
  aboutBody: AboutBody
  timeline: TimelineEntry[]
  values: ValueCard[]
  faqSections: FaqSection[]
  contactInfo: ContactInfo
  footer: FooterCopy
  seo: SeoCopy
}
