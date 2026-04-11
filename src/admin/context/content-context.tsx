import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { CATEGORIES } from "../../lib/categories"

// ─── Default data seeded from existing hardcoded sources ──────────────────────

const DEFAULT_BRANDS = [
  { name: "Coors Light" },
  { name: "Red Bull" },
  { name: "Maker's Mark" },
  { name: "Heinz" },
  { name: "Under Armour" },
  { name: "Patagonia" },
  { name: "New Balance" },
  { name: "Jack Daniel's" },
  { name: "Vans" },
  { name: "Levi's" },
  { name: "Pittsburgh Steelers" },
  { name: "ESPN" },
]

const DEFAULT_SERVICES = [
  {
    name: "Creative Direction",
    tag: "Strategy",
    desc: "Full art direction and campaign concepting, from moodboards to shoot day.",
    bullets: [
      "Creative direction + art direction",
      "Campaign concepting (menu drops, seasonal, events)",
      "Shot lists + production planning",
      "Moodboards + visual references",
      "Location scouting + talent coordination",
    ],
    inverted: false,
    minH: "min-h-[414px]",
    gridImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
    gridRotate: -1,
    gridDelay: 0,
  },
  {
    name: "Photography",
    tag: "Photo",
    desc: "Food, lifestyle, and event photography built for brands that demand presence.",
    bullets: [
      "Food and beverage photography (hero dishes, menu items, action shots)",
      'Lifestyle photography (guests, staff, ambiance, "vibe" shots)',
      "Interior / hospitality photography",
      "Event photography + recap coverage",
      "Product photography (retail items, merch, packaged goods)",
    ],
    inverted: true,
    minH: "min-h-[497px]",
    gridImg: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    gridRotate: 0.75,
    gridDelay: 0.08,
  },
  {
    name: "Branding",
    tag: "Design",
    desc: "Brand development and identity systems built to outlast trends and grow with you.",
    bullets: [
      "Branding development + refresh",
      "Visual identity systems",
      "Brand voice + messaging support",
      "Logo suite (primary, secondary, icons, stacked marks)",
      "Brand guidelines / brand book",
    ],
    inverted: true,
    minH: "min-h-[359px]",
    gridImg: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    gridRotate: -0.5,
    gridDelay: 0.16,
  },
  {
    name: "Visual Identity",
    tag: "Design",
    desc: "Cohesive visual systems: color, type, patterns, and a full brand asset library.",
    bullets: [
      "Visual identity systems",
      "Color palette + typography system",
      "Patterns / textures + iconography",
      "Social media look + feel system",
      "Brand asset library",
    ],
    inverted: false,
    minH: "min-h-[442px]",
    gridImg: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
    gridRotate: 1,
    gridDelay: 0.24,
  },
  {
    name: "Social Media",
    tag: "Content",
    desc: "Full social media management: strategy, content, scheduling, and community.",
    bullets: [
      "Full social media management (IG, TikTok, FB, etc.)",
      "Social strategy + monthly planning",
      "Posting + scheduling",
      "Caption writing + brand voice development",
      "Community management (comments + DMs)",
    ],
    inverted: false,
    minH: "min-h-[359px]",
    gridImg: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=800",
    gridRotate: -0.75,
    gridDelay: 0.32,
  },
  {
    name: "Email Marketing",
    tag: "Email",
    desc: "Email strategy, design, and campaigns that drive opens, clicks, and conversions.",
    bullets: [
      "Email strategy + campaign planning",
      "Email design + copywriting",
      "Template building + list growth support",
      "Monthly email campaigns + promotional blasts",
      "Performance reporting (open rates, CTR)",
    ],
    inverted: true,
    minH: "min-h-[469px]",
    gridImg: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&q=80&w=800",
    gridRotate: 0.5,
    gridDelay: 0.4,
  },
  {
    name: "Graphic Design",
    tag: "Design",
    desc: "Full-service graphic design: print, digital, and everything in between.",
    bullets: [
      "Full-service graphic design + promotional design",
      "Menu + insert design support",
      "Print + in-house collateral (flyers, posters, table tents)",
      "Digital assets (social graphics, headers, templates)",
      "Monthly graphic drops + highlight covers",
    ],
    inverted: true,
    minH: "min-h-[386px]",
    gridImg: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    gridRotate: -1.25,
    gridDelay: 0.48,
  },
  {
    name: "Motion Graphics",
    tag: "Video / Motion",
    desc: "Animated content that moves: logo animation, kinetic type, and promo templates.",
    bullets: [
      "Logo animation (transparent + background versions)",
      "Text + photo animation",
      "Animated promo design + story templates",
      "Kinetic typography promos",
      "Lower thirds + title sequences",
    ],
    inverted: false,
    minH: "min-h-[524px]",
    gridImg: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    gridRotate: 1,
    gridDelay: 0.56,
  },
]

const DEFAULT_FAQ_SECTIONS = [
  {
    section: "What Am I Actually Getting?",
    items: [
      { q: "What exactly is included in a monthly package?", a: "You're getting more than content - you're getting a fully planned and executed marketing system. That includes strategy, campaign planning, production, editing, and rollout. Every piece is created with a purpose and built to work together." },
      { q: "How many photos/videos do we get?", a: "We scope output based on your goals, but typically you're receiving high-volume, platform-ready content - short-form videos, photos, and campaign assets designed to last the entire month (and beyond)." },
      { q: "Do we own the content?", a: "Yes - you have full usage rights across your marketing channels: social, ads, website, email, etc." },
    ],
  },
  {
    section: "Pricing + Value",
    items: [
      { q: "Why does this cost what it costs?", a: "Because you're not hiring a shooter - you're hiring a full creative team. Strategy, production, editing, and campaign execution all live under one roof, which replaces multiple vendors and delivers better results." },
      { q: "Can we just do one shoot instead of a retainer?", a: "You can - but one-off shoots create content. Retainers build momentum, consistency, and campaigns that actually drive results over time." },
      { q: "Can we scale up or down?", a: "Yes. We can adjust production volume and campaign intensity depending on your season, goals, or budget." },
    ],
  },
  {
    section: "Strategy + Results",
    items: [
      { q: "How will this bring in customers?", a: "We don't just make content - we build campaigns designed to drive behavior. That means aligning visuals, messaging, and timing around real business goals like reservations, events, and menu pushes." },
      { q: "How do we know what's working?", a: "We track performance monthly - what's driving engagement, clicks, and conversions - and adjust strategy accordingly." },
    ],
  },
  {
    section: "Production",
    items: [
      { q: "How do shoot days work?", a: "We come in with a full plan - shot lists, concepts, and direction - so everything is efficient, organized, and intentional." },
      { q: "Do we need to prepare anything?", a: "We'll guide you on exactly what's needed - menu items, staff availability, setup - but we handle the heavy lifting." },
      { q: "Will you direct staff or talent?", a: "Yes. We fully direct talent, staff, and scenes so everything feels natural but elevated." },
    ],
  },
  {
    section: "Social Media Management",
    items: [
      { q: "Do you post for us or just give content?", a: "We can do both. Many clients have us fully manage posting, scheduling, and rollout." },
      { q: "Do you write captions?", a: "Yes - captions are written to match your brand voice and drive engagement." },
      { q: "Do you respond to comments/DMs?", a: "We offer community management as part of full-service social." },
    ],
  },
  {
    section: "Campaign + Big Picture",
    items: [
      { q: "Are you just making content or building campaigns?", a: "We build campaigns. Every piece of content is part of a bigger strategy designed to drive results - not just fill your feed." },
      { q: "How do you approach launches or events?", a: "We create full rollout strategies - teasers, launch content, paid support, and post-event recaps - so you get maximum visibility and impact." },
    ],
  },
  {
    section: "Creative Direction",
    items: [
      { q: "Will you tell us what to shoot?", a: "Yes - that's our job. We lead creative direction so you're never guessing." },
      { q: "What if we don't know what content we need?", a: "Most clients don't - that's why we exist. We identify the opportunities and build the plan for you." },
      { q: "Can you match our brand?", a: "We don't just match it - we elevate it while keeping it authentic." },
    ],
  },
  {
    section: "Logistics + Workflow",
    items: [
      { q: "How long does it take to receive content?", a: "Turnaround is typically within 1-2 weeks depending on scope." },
      { q: "Can we request revisions?", a: "Yes - we include revision rounds to make sure everything aligns." },
    ],
  },
  {
    section: "The Real Questions",
    items: [
      { q: "Will this actually make us stand out?", a: "Yes - because we're not just creating content, we're building a cohesive brand presence that's designed to outperform your competition." },
      { q: "Is this going to be a headache?", a: "No - we're built to take this off your plate. We handle planning, production, and execution so your team can stay focused on operations." },
      { q: "Do you actually understand restaurants?", a: "Yes - this is our niche. Everything we create is built around what drives real traffic, orders, and guest experience." },
    ],
  },
]

const DEFAULT_TIMELINE = [
  {
    date: "2021–2025",
    client: "BRAND ACTIVATIONS",
    campaign: "IMMERSIVE EVENTS",
    role: "CREATIVE DIRECTION",
    description: "Led creative direction for high-impact experiential events including the House of Balloons Halloween series and annual Singles Only campaigns. Storytelling-driven aesthetics integrated brands like Boston Beer Company, Beam Suntory, and Teremana Tequila into specific cultural moments.",
  },
  {
    date: "2021–2024",
    client: "VISUAL IDENTITY",
    campaign: "PACKAGING & BRANDING",
    role: "BRAND DESIGN",
    description: "Developed comprehensive brand identities and physical packaging for emerging companies including Alison Cosmetics and High End Sweets. Projects focused on bespoke logo design, strategic color palettes, and luxury positioning to establish immediate market recognition and shelf appeal.",
  },
  {
    date: "2022–2023",
    client: "COMMERCIAL CONTENT",
    campaign: "PRODUCT CAMPAIGNS",
    role: "CREATIVE DIRECTION",
    description: "Directed high-production photoshoots and visual narratives for legacy brands including Absolut Vodka, Blue Moon, Nike, and Maker's Mark. Each campaign translated product attributes into aspirational lifestyle content, driving organic engagement and digital amplification across social platforms.",
  },
  {
    date: "2024–2025",
    client: "HOSPITALITY REBRANDS",
    campaign: null,
    role: "DIGITAL & PHYSICAL TRANSFORMATION",
    description: "Executed end-to-end digital and physical transformations for hospitality clients including Yuzu Kitchen, Lilith, EYV, and Shorty's. Delivered website redesigns, SEO optimization, and social media management to increase foot traffic through cohesive storytelling.",
  },
]

const DEFAULT_VALUES = [
  {
    label: "CULTURE",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600",
    offset: "mt-20",
    delay: 0,
    body: "Culture isn't a backdrop, it's your product. We build content that makes people feel like they're already part of your world, translating your hospitality vision into storytelling that drives aspiration and belonging.",
  },
  {
    label: "DYNAMICS",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
    offset: "mt-10",
    delay: 0.1,
    body: "The market doesn't wait. Our in-house production model means we can turn a campaign concept around in days, not weeks, keeping your brand responsive to trends, seasons, and competitive shifts without losing cohesion.",
  },
  {
    label: "CREATIVITY",
    img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=600",
    offset: "mt-32",
    delay: 0.2,
    body: "Originality is what makes people stop scrolling. We develop visual identities and campaign narratives unique to each brand, never templated, never recycled. Every element is intentional and designed to make your brand unmistakable.",
  },
]

export const DEFAULT_CONTENT = {
  categories: CATEGORIES,
  services: DEFAULT_SERVICES,
  brands: DEFAULT_BRANDS,
  // slugs pointing into CATEGORIES[*].projects[*]
  featuredSlugs: ["harvest-menu-drop", "behind-the-menu", "logo-pack"] as [string, string, string],
  hero: {
    topLeft: "Marketing Agency\nCreative Production",
    topRight: "Social Satisfaction\nFull-Service Agency",
    bottomLeft: "Marketing Agency",
  },
  whatWeDo: {
    panel1Body: "Social Satisfaction is a creative agency specializing in bold brand transformations rooted in culture and storytelling. Founded by Devon Colebank, we work at the intersection of hospitality, lifestyle, and experiential marketing to evolve brands through striking visuals. By blending nostalgia with innovation, we create identities that feel both familiar and fresh for modern audiences.",
    panel2Col1Label: "Full-Scale Creative Campaigns",
    panel2Col1Body: "We go beyond content creation to build comprehensive, strategic campaigns. As a one-stop creative partner, we handle every stage from ideation and production to rollout and optimization. Our process ensures your marketing is cohesive, intentional, and designed for measurable impact.",
    panel2Col2Label: "Results-Driven Execution",
    panel2Col2Body: "We do not just deliver files. We create fully realized campaigns built to fill seats, drive reservations, and build brand loyalty. By aligning strategy with visual storytelling, we eliminate the need for multiple vendors and focus on driving real results for your business.",
  },
  campaignWords: ["CAMPAIGNS", "BUILT", "TO", "PERFORM."] as [string, string, string, string],
  aboutBody: [
    "Social Satisfaction, founded by Devon Colebank, transforms hospitality and lifestyle brands through cultural storytelling. We blend nostalgia with modern innovation to create resonant identities that bridge the gap between trend-forward messaging and striking visuals.",
    "We replace \u201cshoot and share\u201d tactics with performance-driven campaigns. As an end-to-end partner, we manage everything from ideation to execution. This streamlined structure ensures every effort is intentional, cohesive, and designed to drive reservations.",
    "By integrating strategy with internal production, we eliminate fragmented communication and multiple vendors. Every piece of content serves a business objective. The result is a consistent, optimized rollout that delivers measurable brand loyalty.",
  ] as [string, string, string],
  timeline: DEFAULT_TIMELINE,
  values: DEFAULT_VALUES,
  faqSections: DEFAULT_FAQ_SECTIONS,
  contactInfo: {
    email: "info@socialsatisfaction.com",
    phone: "+1 (412) 555-0123",
    location: "Marketing Agency",
    instagram: "@socialsatisfaction",
  },
  footer: {
    description: "Full-service marketing agency specialising in creative direction, brand identity, and commercial production.",
    email: "info@socialsatisfaction.com",
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/socialsatisfaction" },
      { label: "TikTok", href: "https://www.tiktok.com/@socialsatisfaction" },
    ],
  },
  seo: {
    title: "Devon Colebank | Creative Director & Brand Strategist",
    description: "Devon Colebank is a Pittsburgh-based creative director and brand strategist specializing in videography, photography, and graphic design for brands like Coors Light, Red Bull, and Maker's Mark.",
    keywords: "Devon Colebank, creative director, brand strategist, videography, photography, graphic design, Pittsburgh, branding, commercial production",
    author: "Devon Colebank",
    ogTitle: "Devon Colebank | Creative Director & Brand Strategist",
    ogDescription: "Pittsburgh-based creative director specializing in videography, photography, and graphic design. Working with brands like Coors Light, Red Bull, and Maker's Mark.",
    ogUrl: "https://devoncolebank.com",
    ogSiteName: "Devon Colebank",
    twitterTitle: "Devon Colebank | Creative Director & Brand Strategist",
    twitterDescription: "Pittsburgh-based creative director specializing in videography, photography, and graphic design.",
    twitterCreator: "@devoncolebank",
    canonical: "https://devoncolebank.com",
  },
}

export type AdminContent = typeof DEFAULT_CONTENT

// ─── Context ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "ss-admin-content"

type ContentContextValue = {
  content: AdminContent
  update: <K extends keyof AdminContent>(section: K, value: AdminContent[K]) => void
  reset: () => void
}

const ContentContext = createContext<ContentContextValue | null>(null)

export const AdminContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<AdminContent>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored) as AdminContent
    } catch {
      // ignore
    }
    return DEFAULT_CONTENT
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    } catch {
      // ignore storage errors
    }
  }, [content])

  const update = useCallback(<K extends keyof AdminContent>(section: K, value: AdminContent[K]) => {
    setContent((prev) => ({ ...prev, [section]: value }))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setContent(DEFAULT_CONTENT)
  }, [])

  return (
    <ContentContext.Provider value={{ content, update, reset }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error("useContent must be used inside AdminContentProvider")
  return ctx
}
