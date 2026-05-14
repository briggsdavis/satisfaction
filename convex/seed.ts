import { v } from "convex/values"
import { api, internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"
import { action, internalMutation, query } from "./_generated/server"

// ─── Source data (extracted from pre-Convex static content) ───────────────

const HOMEPAGE_COPY = {
  whatWeDoPanel1Body:
    "Social Satisfaction is a creative agency specializing in bold brand transformations rooted in culture and storytelling. Founded by Devon Colebank, we work at the intersection of hospitality, lifestyle, and experiential marketing to evolve brands through striking visuals. By blending nostalgia with innovation, we create identities that feel both familiar and fresh for modern audiences.",
  whatWeDoPanel2Col1Label: "Full-Scale Creative Campaigns",
  whatWeDoPanel2Col1Body:
    "We go beyond content creation to build comprehensive, strategic campaigns. As a one-stop creative partner, we handle every stage from ideation and production to rollout and optimization. Our process ensures your marketing is cohesive, intentional, and designed for measurable impact.",
  whatWeDoPanel2Col2Label: "Results-Driven Execution",
  whatWeDoPanel2Col2Body:
    "We do not just deliver files. We create fully realized campaigns built to fill seats, drive reservations, and build brand loyalty. By aligning strategy with visual storytelling, we eliminate the need for multiple vendors and focus on driving real results for your business.",
  faqCtaBody:
    "Have a question we haven't answered? Reach out — we're happy to walk you through how we work and what a partnership could look like for your brand.",
}

// 10 slots in src/components/scattered-images.tsx (A–J). Queries roughly match
// the per-slot hints in that file's comments.
const HERO_QUERIES = [
  "laptop,coding,workspace", // A
  "creative-workspace,desk", // J
  "ui-icon,graphic-design", // B
  "website-ui,screenshot", // C
  "photo-studio,production", // D
  "graphic-design,poster", // E
  "brand-logo,mark", // F
  "camera-lens,closeup", // G
  "phone-app,mockup", // H
  "portfolio-lifestyle,editorial", // I
]

const CAMPAIGN_QUERY = "marketing-campaign,billboard"

const SERVICES_DATA: Array<{
  name: string
  color: string
  size: "short" | "medium" | "tall" | "xtall"
  bullets: string[]
  imageQuery: string
}> = [
  {
    name: "Creative Direction",
    color: "#F59E0B",
    size: "medium",
    bullets: [
      "Creative direction + art direction",
      "Campaign concepting (menu drops, seasonal, events)",
      "Shot lists + production planning",
      "Moodboards + visual references",
      "Location scouting + talent coordination",
    ],
    imageQuery: "art-direction,moodboard",
  },
  {
    name: "Photography",
    color: "#3B82F6",
    size: "tall",
    bullets: [
      "Food and beverage photography (hero dishes, menu items, action shots)",
      "Lifestyle photography (guests, staff, ambiance, vibe shots)",
      "Interior / hospitality photography",
      "Event photography + recap coverage",
      "Product photography (retail items, merch, packaged goods)",
    ],
    imageQuery: "food-photography,editorial",
  },
  {
    name: "Branding",
    color: "#8B5CF6",
    size: "short",
    bullets: [
      "Branding development + refresh",
      "Visual identity systems",
      "Brand voice + messaging support",
      "Logo suite (primary, secondary, icons, stacked marks)",
      "Brand guidelines / brand book",
    ],
    imageQuery: "brand-identity,logo-design",
  },
  {
    name: "Visual Identity",
    color: "#EC4899",
    size: "medium",
    bullets: [
      "Visual identity systems",
      "Color palette + typography system",
      "Patterns / textures + iconography",
      "Social media look + feel system",
      "Brand asset library",
    ],
    imageQuery: "typography,color-palette",
  },
  {
    name: "Social Media",
    color: "#10B981",
    size: "medium",
    bullets: [
      "Full social media management (IG, TikTok, FB, etc.)",
      "Social strategy + monthly planning",
      "Posting + scheduling",
      "Caption writing + brand voice development",
      "Community management (comments + DMs)",
    ],
    imageQuery: "social-media,phone-instagram",
  },
  {
    name: "Email Marketing",
    color: "#F97316",
    size: "tall",
    bullets: [
      "Email strategy + campaign planning",
      "Email design + copywriting",
      "Template building + list growth support",
      "Monthly email campaigns + promotional blasts",
      "Performance reporting (open rates, CTR)",
    ],
    imageQuery: "email-newsletter,laptop-desk",
  },
  {
    name: "Graphic Design",
    color: "#22D3EE",
    size: "medium",
    bullets: [
      "Full-service graphic design + promotional design",
      "Menu + insert design support",
      "Print + in-house collateral (flyers, posters, table tents)",
      "Digital assets (social graphics, headers, templates)",
      "Monthly graphic drops + highlight covers",
    ],
    imageQuery: "graphic-design,poster",
  },
  {
    name: "Motion Graphics",
    color: "#EF4444",
    size: "xtall",
    bullets: [
      "Logo animation (transparent + background versions)",
      "Text + photo animation",
      "Animated promo design + story templates",
      "Kinetic typography promos",
      "Lower thirds + title sequences",
    ],
    imageQuery: "motion-graphics,kinetic-typography",
  },
]

type CategorySeed = {
  slug: string
  name: string
  color: string
  bullets: string[]
  headline: string
  description: string
  approach: string
  execution: string
  results: string
  imageQuery: string
  projects: ProjectSeed[]
}

type ProjectSeed = {
  slug: string
  title: string
  description: string
  imageQuery: string
  // Service names that act as project tags. Must match SERVICES_DATA.name exactly.
  serviceNames: string[]
  // Keyword queries for the 3 gallery images.
  galleryQueries: [string, string, string]
}

const CATEGORIES_DATA: CategorySeed[] = [
  {
    slug: "creative-direction",
    name: "Creative Direction",
    color: "#F59E0B",
    bullets: [
      "Creative direction + art direction",
      "Campaign concepting (menu drops, seasonal, events)",
      "Shot lists + production planning",
      "Moodboards + visual references",
      "Styling direction (food styling, props, wardrobe)",
    ],
    headline: "Your brand deserves a visual voice that stops people cold.",
    description:
      "Creative direction is the strategy behind every frame. From campaign concepting to shoot day execution, we build the visual language your brand needs to command attention on every platform.",
    approach:
      "We lead full art direction end-to-end: concepting campaigns around real business moments, writing shot lists, and coordinating every element before a camera turns on.",
    execution:
      "Every shoot is planned with intention — locations scouted, talent coordinated, food styled, props sourced — so content looks like it belongs together.",
    results:
      "A cohesive visual identity that compounds with every piece of content. Campaigns that perform across channels and build brand equity over time.",
    imageQuery: "creative-direction,moodboard",
    projects: [
      {
        slug: "harvest-menu-drop",
        title: "Harvest Menu Drop",
        description:
          "A seasonal campaign built around a Pittsburgh restaurant's fall menu launch — concepted, shot, and rolled out across social and in-venue screens. Every frame was designed to create craving before a single dish hit the table.",
        imageQuery: "fall-harvest-menu,restaurant",
        serviceNames: ["Creative Direction", "Photography", "Social Media"],
        galleryQueries: [
          "autumn-plated-dish",
          "moodboard-fall-menu",
          "restaurant-table-setting-autumn",
        ],
      },
      {
        slug: "summer-activation",
        title: "Summer Activation",
        description:
          "Art direction for a regional beverage brand's summer campaign — product photography, lifestyle content, and social rollout. Bold color, natural light, and energy that felt alive on every feed.",
        imageQuery: "summer-beverage,product",
        serviceNames: ["Creative Direction", "Photography", "Social Media"],
        galleryQueries: [
          "cocktail-summer-product",
          "beach-lifestyle-drink",
          "neon-summer-poster",
        ],
      },
      {
        slug: "brand-rollout",
        title: "Brand Rollout",
        description:
          "Visual strategy for a retail brand entering a competitive market. We defined the language from scratch — styling, palette, shot structure, platform formats — delivering a launch suite that felt intentional from day one.",
        imageQuery: "retail-brand-launch",
        serviceNames: ["Creative Direction", "Branding", "Visual Identity"],
        galleryQueries: [
          "retail-storefront",
          "brand-color-palette",
          "shopping-bag-design",
        ],
      },
    ],
  },
  {
    slug: "photography",
    name: "Photography",
    color: "#3B82F6",
    bullets: [
      "Food, beverage, and lifestyle photography",
      "Interior / hospitality and event photography",
      "Edited photo galleries (web + social optimized)",
      "Hero image sets for campaigns",
      "Press-ready photo assets",
    ],
    headline: "Images that make people stop scrolling and start craving.",
    description:
      "Food, beverage, and lifestyle photography built for brands that demand presence. Hero images, event coverage, and press-ready assets — edited and optimized for social, web, and press.",
    approach:
      "Full production photography at every shoot — food and prop styling, professional lighting, and a creative eye trained on what stops the scroll.",
    execution:
      "Hero dishes, ambiance, and lifestyle — captured in one organized shoot and delivered as optimized galleries for social, website, ads, and press.",
    results:
      "A full library of editorial-grade images deployable everywhere. Assets that elevate perception and make your brand look as good as it actually is.",
    imageQuery: "food-photography,editorial",
    projects: [
      {
        slug: "hero-dish-series",
        title: "Hero Dish Series",
        description:
          "Hero dish series for a multi-location restaurant group — editorial-grade food photography styled and lit to stop the scroll. Shot in a single production day, covering signature dishes, seasonal specials, and lifestyle context for web, ads, and press.",
        imageQuery: "hero-dish,plated-food",
        serviceNames: ["Photography", "Creative Direction"],
        galleryQueries: [
          "fine-dining-plate",
          "food-styling-overhead",
          "restaurant-signature-dish",
        ],
      },
      {
        slug: "interior-story",
        title: "Interior Story",
        description:
          "Editorial photography documenting a newly opened hospitality venue — architecture, ambiance, and energy that words alone can't convey. The library became the foundation for their website, press kit, and opening week social campaign.",
        imageQuery: "restaurant-interior,hospitality",
        serviceNames: ["Photography", "Creative Direction"],
        galleryQueries: [
          "modern-restaurant-architecture",
          "warm-lighting-bar",
          "hospitality-lounge-decor",
        ],
      },
      {
        slug: "event-recap",
        title: "Event Recap",
        description:
          "Full event coverage for a sold-out dining experience — real-time social content and a polished recap gallery. Cinematic framing focused on authentic energy that made people who weren't there wish they had been.",
        imageQuery: "dining-event,candid",
        serviceNames: ["Photography", "Social Media"],
        galleryQueries: [
          "dinner-party-candid",
          "wine-glasses-cheers",
          "pop-up-dinner-event",
        ],
      },
    ],
  },
  {
    slug: "branding",
    name: "Branding",
    color: "#8B5CF6",
    bullets: [
      "Branding development + refresh",
      "Visual identity systems",
      "Brand voice + messaging support",
      "Logo suite + brand guidelines",
      "Social media look + feel system",
    ],
    headline: "A brand identity built to outlast trends and grow with you.",
    description:
      "Visual identity systems, logo suites, brand voice, and guidelines — built strategy-first. We develop brands that know exactly who they are before they say a word.",
    approach:
      "We develop or refresh the full identity: logo suite, color palette, typography, brand voice, and a guidelines document your whole team can actually use.",
    execution:
      "Every mark, color, and typeface chosen with purpose — primary and secondary logos, icon sets, social look and feel, and a brand book that governs everything.",
    results:
      "A brand that shows up consistently everywhere, building recognition, trust, and equity with every impression.",
    imageQuery: "brand-identity,design-studio",
    projects: [
      {
        slug: "noire-collective",
        title: "Noire Collective",
        description:
          "Brand identity for Noire Collective, a luxury hospitality concept in Pittsburgh's East End. Full mark suite, typographic system, color palette, and guidelines built from scratch — strong enough to carry the brand across every surface it would ever touch.",
        imageQuery: "luxury-hospitality,dark-elegant",
        serviceNames: ["Branding", "Visual Identity", "Graphic Design"],
        galleryQueries: [
          "luxury-logo-black-gold",
          "elegant-typography-noir",
          "matte-black-business-card",
        ],
      },
      {
        slug: "gather-and-co",
        title: "Gather & Co.",
        description:
          "Full rebrand for Gather & Co., an F&B concept that had outgrown its original identity. New logo suite, refreshed palette, updated typography, and a social look-and-feel system the whole team could execute consistently.",
        imageQuery: "rebrand,logo-typography",
        serviceNames: ["Branding", "Visual Identity", "Social Media"],
        galleryQueries: [
          "modern-logo-mockup",
          "warm-palette-typography",
          "instagram-grid-restaurant",
        ],
      },
      {
        slug: "east-side-spirits",
        title: "East Side Spirits",
        description:
          "Brand refresh for East Side Spirits, a craft beverage retailer repositioning for a premium audience — logo refinement, new secondary mark, updated packaging direction, and retail-ready guidelines.",
        imageQuery: "craft-spirits,bottle-design",
        serviceNames: ["Branding", "Visual Identity", "Graphic Design"],
        galleryQueries: [
          "whiskey-bottle-label",
          "craft-spirits-shelf",
          "premium-packaging-design",
        ],
      },
    ],
  },
  {
    slug: "campaigns",
    name: "Campaigns",
    color: "#6B7280",
    bullets: [
      "Promotional design + campaign rollouts",
      "Launch content kits (openings, new menus, seasonal promos)",
      "Event flyers, poster designs, and digital screen designs",
      "Launch content plan + rollout calendar",
      "Paid social ads management + boosting strategy",
    ],
    headline: "Launch content that builds anticipation and drives real action.",
    description:
      "Promotional design, rollout calendars, paid social strategy, and full launch kits — built around your business goals, not just aesthetics. Every campaign is engineered to create momentum.",
    approach:
      "Full campaign systems: promotional design, digital assets, event collateral, paid social strategy, and a rollout calendar so every piece lands at the right time.",
    execution:
      "From grand opening kits to seasonal suites, every asset works together across print, digital screens, and paid social. Nothing ships without a plan.",
    results:
      "Real momentum — more foot traffic, stronger launch weeks, and a repeatable content system you can deploy every season.",
    imageQuery: "campaign-poster,promotional-design",
    projects: [
      {
        slug: "grand-opening-kit",
        title: "Grand Opening Kit",
        description:
          "Grand opening kit for a new F&B concept — pre-launch teasers, opening week graphics, digital screen assets, event collateral, and a social rollout calendar. Everything designed to build anticipation and get people through the door on night one.",
        imageQuery: "grand-opening,restaurant-launch",
        serviceNames: ["Graphic Design", "Social Media", "Creative Direction"],
        galleryQueries: [
          "grand-opening-flyer",
          "restaurant-ribbon-cutting",
          "launch-poster-design",
        ],
      },
      {
        slug: "fall-promo-suite",
        title: "Fall Promo Suite",
        description:
          "Fall promotional suite for a multi-location retail brand — one cohesive visual system rolling out across organic social, paid ads, email, and in-store screens without needing a custom asset for every placement.",
        imageQuery: "autumn-promo,retail",
        serviceNames: ["Graphic Design", "Email Marketing", "Social Media"],
        galleryQueries: [
          "fall-retail-display",
          "email-newsletter-autumn",
          "instagram-ad-fall",
        ],
      },
      {
        slug: "new-menu-reveal",
        title: "New Menu Reveal",
        description:
          "Promotional design and social campaign for a restaurant's menu reveal — hero food photography, promo graphics, Reels content, and a posting plan that made the launch feel like an event worth showing up for.",
        imageQuery: "menu-reveal,restaurant",
        serviceNames: ["Graphic Design", "Photography", "Social Media"],
        galleryQueries: [
          "menu-card-design",
          "new-dish-hero-shot",
          "reel-screenshot-food",
        ],
      },
    ],
  },
  {
    slug: "production",
    name: "Production",
    color: "#6B7280",
    bullets: [
      "Short-form video creation (Reels / TikTok / Shorts)",
      "Cinematic brand films + commercials",
      "Website hero videos + homepage loops",
      "Professional editing, color correction, and audio cleanup",
      "Serialized content (Interview series, Behind the Menu)",
    ],
    headline: "Video that carries the full weight of your brand's story.",
    description:
      "Short-form content, cinematic brand films, homepage loops, and serialized series — produced, edited, and color graded to the highest standard for the platforms where your audience lives.",
    approach:
      "We produce everything from Reels and TikToks to full brand films, with editing, color correction, and audio cleanup built into every project.",
    execution:
      "A monthly content capture day delivers short-form video plus longer-form assets. Serialized formats like 'Behind the Menu' build a loyal audience over time.",
    results:
      "A consistent, high-quality video presence that builds brand equity and gives your team professional assets across every channel.",
    imageQuery: "film-production,cinema-camera",
    projects: [
      {
        slug: "behind-the-menu",
        title: "Behind the Menu",
        description:
          "Serialized short-form video series for a chef-driven restaurant — behind the scenes of the kitchen, sourcing, and the craft behind each dish. Produced monthly, it built a loyal following and gave the restaurant a consistent reason to show up in the feed.",
        imageQuery: "chef-kitchen,behind-scenes",
        serviceNames: ["Photography", "Social Media", "Creative Direction"],
        galleryQueries: [
          "chef-cooking-action",
          "kitchen-prep-closeup",
          "ingredient-sourcing-farm",
        ],
      },
      {
        slug: "brand-film",
        title: "Brand Film",
        description:
          "Cinematic brand film for a hospitality group — shot over two days, fully color graded, and scored to carry the brand's story. Built to anchor the homepage, run as a pre-roll ad, and define what the brand stands for.",
        imageQuery: "cinematic-film,hospitality",
        serviceNames: ["Creative Direction", "Photography", "Motion Graphics"],
        galleryQueries: [
          "cinematic-film-still",
          "color-graded-frame",
          "film-set-camera",
        ],
      },
      {
        slug: "reel-pack",
        title: "Reel Pack",
        description:
          "Monthly Reel production package for a fast-growing F&B brand — 8–12 platform-ready Reels per month, cut for maximum watch time with trending audio and on-brand visuals that outperformed static content by 3–5x.",
        imageQuery: "vertical-video,smartphone",
        serviceNames: ["Social Media", "Motion Graphics", "Photography"],
        galleryQueries: [
          "phone-vertical-video",
          "reels-editing-screen",
          "smartphone-tripod-shoot",
        ],
      },
    ],
  },
  {
    slug: "social-media",
    name: "Social Media",
    color: "#10B981",
    bullets: [
      "Full social media management + strategy",
      "Monthly content calendars + reporting",
      "Community management + trend research",
      "Monthly content capture days + retainer packages",
      "Story packs + Reels bundles",
    ],
    headline: "Full social management that turns followers into regulars.",
    description:
      "Strategy, content calendars, scheduling, caption writing, and community management — all handled. You focus on the business; we own the feed and build the audience.",
    approach:
      "We take over full social management — strategy, monthly planning, content capture, captions, and community across IG, TikTok, and beyond.",
    execution:
      "Monthly capture days feed a full calendar of posts, Reels bundles, and story packs — written in your brand voice, posted at the optimal time.",
    results:
      "A growing, engaged community with more reach, saves, and DMs — and a social presence that reflects the quality of your brand.",
    imageQuery: "social-media-content,instagram",
    projects: [
      {
        slug: "monthly-retainer",
        title: "Monthly Retainer",
        description:
          "Full-service social media management for a regional F&B brand across Instagram and TikTok — strategy, scheduling, caption writing, and community management all handled. Grew to 40k+ followers in under 12 months without a single paid post.",
        imageQuery: "instagram-feed,phone",
        serviceNames: ["Social Media", "Photography", "Graphic Design"],
        galleryQueries: [
          "instagram-grid-feed",
          "tiktok-content-creator",
          "social-content-calendar",
        ],
      },
      {
        slug: "reels-bundle",
        title: "Reels Bundle",
        description:
          "Short-form content bundle for a brand's first serious Reels push — 10 videos shot, edited, and captioned in one production day. Each built with a clear hook, platform-native pacing, and a CTA to drive a save, follow, or visit.",
        imageQuery: "reels-shooting,vertical",
        serviceNames: ["Social Media", "Motion Graphics"],
        galleryQueries: [
          "vertical-video-shoot",
          "reels-thumbnail-grid",
          "iphone-video-editing",
        ],
      },
      {
        slug: "launch-campaign",
        title: "Launch Campaign",
        description:
          "Organic social launch for a new F&B concept — strategy, content creation, rollout calendar, and community management for the first 60 days. Built from zero to a loyal early audience before a single paid dollar was spent.",
        imageQuery: "social-launch,community",
        serviceNames: ["Social Media", "Creative Direction", "Photography"],
        galleryQueries: [
          "restaurant-grand-opening-crowd",
          "social-media-launch-graphic",
          "community-event-photography",
        ],
      },
    ],
  },
  {
    slug: "influencer-ugc",
    name: "Influencer / UGC",
    color: "#6B7280",
    bullets: [
      "Influencer sourcing + outreach",
      "UGC coordination + campaign management",
      "Usage rights + asset delivery",
      "Monthly UGC bundles + campaign briefs",
      "Performance recaps",
    ],
    headline: "Authentic creator content that reaches the right audience.",
    description:
      "Influencer sourcing, UGC coordination, usage rights, and monthly asset bundles — we handle the relationships, briefs, and delivery so you get content that actually converts.",
    approach:
      "We source and manage creators aligned to your brand — outreach, creative briefs, usage rights, and full asset delivery so every piece has a purpose.",
    execution:
      "Monthly UGC bundles built around specific goals: new menu items, grand openings, seasonal pushes, and high-performing ad creative.",
    results:
      "Organic-feeling content at scale with full usage rights — more social proof, stronger ad performance, and an audience that trusts your brand.",
    imageQuery: "creator-influencer,phone",
    projects: [
      {
        slug: "creator-collab",
        title: "Creator Collab",
        description:
          "Influencer campaign for a beverage brand targeting Pittsburgh's lifestyle audience — sourcing, briefing, and managing five local creators across a two-week activation. Full usage rights secured, content repurposed across paid and organic.",
        imageQuery: "influencer-creator,beverage",
        serviceNames: ["Social Media", "Creative Direction", "Photography"],
        galleryQueries: [
          "influencer-cocktail-photo",
          "lifestyle-creator-bar",
          "creator-collab-shoot",
        ],
      },
      {
        slug: "ugc-pack",
        title: "UGC Pack",
        description:
          "Monthly UGC bundle for a growing F&B brand — eight creators per month delivering authentic, on-brief content for organic posting and paid amplification. Replaced expensive production shoots while driving stronger engagement than polished studio work.",
        imageQuery: "ugc-content,smartphone",
        serviceNames: ["Social Media", "Photography"],
        galleryQueries: [
          "ugc-restaurant-selfie",
          "phone-food-photo",
          "casual-creator-content",
        ],
      },
      {
        slug: "campaign-brief",
        title: "Campaign Brief",
        description:
          "End-to-end UGC campaign for a lifestyle product launch — brief, creator sourcing, relationship management, deliverable review, and usage rights. Resulted in 30+ pieces of authentic social proof ready for ads, landing pages, and organic channels.",
        imageQuery: "lifestyle-product,unboxing",
        serviceNames: ["Creative Direction", "Social Media", "Photography"],
        galleryQueries: [
          "product-unboxing-flatlay",
          "lifestyle-product-shot",
          "creative-brief-document",
        ],
      },
    ],
  },
  {
    slug: "launch-event-marketing",
    name: "Launch + Event Marketing",
    color: "#6B7280",
    bullets: [
      "Grand opening support",
      "Event marketing strategy + rollout",
      "Event content capture + recap production",
      "Launch content plan + rollout calendar",
      "Press-ready assets + promo graphics",
    ],
    headline: "Grand openings and events that people actually show up to.",
    description:
      "Full launch strategy, event marketing, content capture, rollout calendars, and press-ready assets — built to maximize visibility before, during, and long after the doors open.",
    approach:
      "We build the full launch ecosystem — promotional strategy, event flyers, digital ads, content capture plan, and a rollout calendar that builds genuine anticipation.",
    execution:
      "Teasers, countdown content, day-of capture, and post-event recap — every phase covered with intentional, high-quality content.",
    results:
      "Lines at the door, packed rooms, and a social moment that lives beyond the night. Your launch becomes your most powerful piece of content.",
    imageQuery: "grand-opening,event",
    projects: [
      {
        slug: "grand-opening",
        title: "Grand Opening",
        description:
          "Grand opening strategy for a new restaurant group — six weeks of pre-launch content, opening week coverage, same-day social delivery, and a full recap package. Opening night sold out before the doors opened, and social content drove reservations for three weeks after.",
        imageQuery: "restaurant-opening,crowd",
        serviceNames: ["Creative Direction", "Social Media", "Photography"],
        galleryQueries: [
          "restaurant-opening-night",
          "ribbon-cutting-celebration",
          "packed-dining-room",
        ],
      },
      {
        slug: "pop-up-event",
        title: "Pop-Up Event",
        description:
          "Event marketing and content capture for a retail pop-up in Pittsburgh's Strip District — promo graphics to live coverage to recap Reels. Drove 800+ visitors over two days and generated more organic UGC than any previous campaign.",
        imageQuery: "pop-up-shop,retail-event",
        serviceNames: ["Graphic Design", "Photography", "Social Media"],
        galleryQueries: [
          "pop-up-storefront",
          "event-flyer-design",
          "crowd-event-pittsburgh",
        ],
      },
      {
        slug: "soft-launch",
        title: "Soft Launch",
        description:
          "Soft launch content strategy and PR assets for a boutique hospitality concept opening to an invite-only audience — pre-launch calendar, press photography, and a media kit that landed features in two regional publications before public opening.",
        imageQuery: "boutique-hotel,invite-only",
        serviceNames: ["Creative Direction", "Photography", "Branding"],
        galleryQueries: [
          "boutique-hotel-lobby",
          "press-kit-elegant",
          "intimate-dining-event",
        ],
      },
    ],
  },
  {
    slug: "web-development",
    name: "Web Development",
    color: "#22D3EE",
    bullets: [
      "Custom website design + development",
      "E-commerce + booking integrations",
      "Mobile-responsive builds",
      "CMS setup + client training",
      "Hosting, domain, + launch support",
    ],
    headline: "Websites built to perform, not just to look good.",
    description:
      "Custom web builds designed around your brand and goals — from discovery through launch. Every site we deliver is mobile-responsive, fast, and built for real business impact.",
    approach:
      "We run a transparent five-step process: discovery call, scoped agreement, custom prototype, three revision rounds, and a fully supported launch — no guessing at any stage.",
    execution:
      "Every build starts with your brand. We design prototypes first, iterate until you're confident, then build and launch with full technical support and handoff documentation.",
    results:
      "A fast, polished, fully custom website that looks like you and converts like a business tool — handed off with everything you need to own it.",
    imageQuery: "web-design,laptop-code",
    projects: [
      {
        slug: "noire-digital",
        title: "Noire Digital",
        description:
          "Full custom website for a luxury Pittsburgh restaurant concept — brand-forward design, online reservation integration, and a menu experience built to match the dining room energy. Delivered in five weeks from discovery to launch.",
        imageQuery: "restaurant-website,dark-mode",
        serviceNames: ["Visual Identity", "Graphic Design", "Branding"],
        galleryQueries: [
          "dark-website-luxury",
          "restaurant-homepage-design",
          "menu-website-layout",
        ],
      },
      {
        slug: "east-side-shop",
        title: "East Side Shop",
        description:
          "E-commerce site for a regional retail brand moving online — custom Shopify build with branded UX, mobile-first design, and a product experience that matched the in-store feeling. Launched to 200+ SKUs on day one.",
        imageQuery: "ecommerce-shopify,product",
        serviceNames: ["Visual Identity", "Graphic Design", "Photography"],
        galleryQueries: [
          "ecommerce-product-grid",
          "shopify-storefront",
          "mobile-shopping-app",
        ],
      },
      {
        slug: "gather-digital",
        title: "Gather Digital",
        description:
          "Custom booking platform and brand site for a private dining and events concept — reservation flow, gallery, menu reveals, and a private event inquiry system. Built to convert from the first visit.",
        imageQuery: "booking-website,private-dining",
        serviceNames: ["Visual Identity", "Graphic Design", "Branding"],
        galleryQueries: [
          "booking-form-website",
          "elegant-reservation-page",
          "private-dining-gallery",
        ],
      },
    ],
  },
  {
    slug: "motion-graphics",
    name: "Motion Graphics",
    color: "#F97316",
    bullets: [
      "Logo animation + animated promo design",
      "Animated story templates + flyers",
      "Kinetic typography promos",
      "Lower thirds + title sequences",
      "GIFs + sticker packs",
    ],
    headline: "Animation that makes your brand impossible to ignore.",
    description:
      "Logo animations, story templates, kinetic typography, lower thirds, and GIF packs — motion content for every platform. Static graphics scroll by. Motion commands attention.",
    approach:
      "Custom animated assets from scratch — logo reveals, animated story templates, kinetic type promos, and full promo sequences.",
    execution:
      "Every animation delivered in multiple formats and sizes, ready to drop into social, ads, presentations, or your website.",
    results:
      "A motion identity that reinforces your brand at every touchpoint and elevates the perception of everything you put out.",
    imageQuery: "motion-graphics,animation",
    projects: [
      {
        slug: "logo-pack",
        title: "Logo Pack",
        description:
          "Animated logo pack for a hospitality brand — primary mark, secondary lockup, and icon in transparent, dark, and light versions across multiple styles. Produced in correct specs for social, website headers, email signatures, and decks.",
        imageQuery: "animated-logo,brand-mark",
        serviceNames: ["Motion Graphics", "Branding", "Visual Identity"],
        galleryQueries: [
          "animated-logo-reveal",
          "logo-design-mockup",
          "brand-mark-variations",
        ],
      },
      {
        slug: "story-templates",
        title: "Story Templates",
        description:
          "12 branded animated story templates for a restaurant group — daily specials, event announcements, hours, and promos. Delivered as editable CapCut templates the team could update weekly without any design experience.",
        imageQuery: "instagram-story,template",
        serviceNames: ["Motion Graphics", "Social Media", "Graphic Design"],
        galleryQueries: [
          "instagram-story-template",
          "social-template-design",
          "phone-story-mockup",
        ],
      },
      {
        slug: "promo-series",
        title: "Promo Series",
        description:
          "Kinetic typography promo series for a seasonal campaign — five animated videos using bold type, brand colors, and motion designed to stop the scroll. Delivered in square, vertical, and landscape formats for IG, Reels, TikTok, and digital screens.",
        imageQuery: "kinetic-typography,bold-type",
        serviceNames: [
          "Motion Graphics",
          "Graphic Design",
          "Creative Direction",
        ],
        galleryQueries: [
          "kinetic-typography-poster",
          "bold-type-design",
          "animated-promo-frame",
        ],
      },
    ],
  },
]

const FEATURED_SLUGS = new Set([
  "harvest-menu-drop",
  "behind-the-menu",
  "logo-pack",
])

const ABOUT_VALUES: Array<{
  label: string
  body: string
  imageQuery: string
}> = [
  {
    label: "CULTURE",
    body: "Culture isn't a backdrop, it's your product. We build content that makes people feel like they're already part of your world, translating your hospitality vision into storytelling that drives aspiration and belonging.",
    imageQuery: "culture-community,gathering",
  },
  {
    label: "DYNAMICS",
    body: "The market doesn't wait. Our in-house production model means we can turn a campaign concept around in days, not weeks, keeping your brand responsive to trends, seasons, and competitive shifts without losing cohesion.",
    imageQuery: "dynamic-motion,city",
  },
  {
    label: "CREATIVITY",
    body: "Originality is what makes people stop scrolling. We develop visual identities and campaign narratives unique to each brand, never templated, never recycled. Every element is intentional and designed to make your brand unmistakable.",
    imageQuery: "creative-studio,artist-work",
  },
]

const WHEEL_DATA: Array<{ heading: string; body: string; imageQuery: string }> =
  [
    {
      heading: "Who We Are",
      body: "Social Satisfaction, founded by Devon Colebank, transforms hospitality and lifestyle brands through cultural storytelling. We blend nostalgia with modern innovation to create resonant identities that bridge the gap between trend-forward messaging and striking visuals.",
      imageQuery: "creative-agency,team",
    },
    {
      heading: "How We Work",
      body: "We replace 'shoot and share' tactics with performance-driven campaigns. As an end-to-end partner, we manage everything from ideation to execution. This streamlined structure ensures every effort is intentional, cohesive, and designed to drive reservations.",
      imageQuery: "creator-influencer,workflow",
    },
    {
      heading: "What We Deliver",
      body: "By integrating strategy with internal production, we eliminate fragmented communication and multiple vendors. Every piece of content serves a business objective. The result is a consistent, optimized rollout that delivers measurable brand loyalty.",
      imageQuery: "brand-identity,deliverables",
    },
  ]

const TIMELINE_DATA = [
  {
    date: "2021–2025",
    client: "BRAND ACTIVATIONS",
    campaign: "IMMERSIVE EVENTS",
    role: "CREATIVE DIRECTION",
    description:
      "Led creative direction for high-impact experiential events including the House of Balloons Halloween series and annual Singles Only campaigns. Storytelling-driven aesthetics integrated brands like Boston Beer Company, Beam Suntory, and Teremana Tequila into specific cultural moments.",
  },
  {
    date: "2021–2024",
    client: "VISUAL IDENTITY",
    campaign: "PACKAGING & BRANDING",
    role: "BRAND DESIGN",
    description:
      "Developed comprehensive brand identities and physical packaging for emerging companies including Alison Cosmetics and High End Sweets. Projects focused on bespoke logo design, strategic color palettes, and luxury positioning to establish immediate market recognition and shelf appeal.",
  },
  {
    date: "2022–2023",
    client: "COMMERCIAL CONTENT",
    campaign: "PRODUCT CAMPAIGNS",
    role: "CREATIVE DIRECTION",
    description:
      "Directed high-production photoshoots and visual narratives for legacy brands including Absolut Vodka, Blue Moon, Nike, and Maker's Mark. Each campaign translated product attributes into aspirational lifestyle content, driving organic engagement and digital amplification across social platforms.",
  },
  {
    date: "2024–2025",
    client: "HOSPITALITY REBRANDS",
    campaign: null as string | null,
    role: "DIGITAL & PHYSICAL TRANSFORMATION",
    description:
      "Executed end-to-end digital and physical transformations for hospitality clients including Yuzu Kitchen, Lilith, EYV, and Shorty's. Delivered website redesigns, SEO optimization, and social media management to increase foot traffic through cohesive storytelling.",
  },
]

// Handles only (no @, no full URL); linkedin is the exception (full URL).
// The footer/sidebar build URLs from these handles.
const CONTACT_INFO = {
  email: "info@socialsatisfaction.com",
  phone: "+1 (412) 555-0123",
  location: "Pittsburgh, PA",
  instagram: "socialsatisfaction",
  tiktok: "socialsatisfaction",
  linkedin: "https://www.linkedin.com/company/socialsatisfaction",
  youtube: "socialsatisfaction",
}

const FAQ_DATA: Array<{
  section: string
  items: Array<{ q: string; a: string }>
}> = [
  {
    section: "What Am I Actually Getting?",
    items: [
      {
        q: "What exactly is included in a monthly package?",
        a: "You're getting more than content - you're getting a fully planned and executed marketing system. That includes strategy, campaign planning, production, editing, and rollout. Every piece is created with a purpose and built to work together.",
      },
      {
        q: "How many photos/videos do we get?",
        a: "We scope output based on your goals, but typically you're receiving high-volume, platform-ready content - short-form videos, photos, and campaign assets designed to last the entire month (and beyond).",
      },
      {
        q: "Do we own the content?",
        a: "Yes - you have full usage rights across your marketing channels: social, ads, website, email, etc.",
      },
    ],
  },
  {
    section: "Pricing + Value",
    items: [
      {
        q: "Why does this cost what it costs?",
        a: "Because you're not hiring a shooter - you're hiring a full creative team. Strategy, production, editing, and campaign execution all live under one roof, which replaces multiple vendors and delivers better results.",
      },
      {
        q: "Can we just do one shoot instead of a retainer?",
        a: "You can - but one-off shoots create content. Retainers build momentum, consistency, and campaigns that actually drive results over time.",
      },
      {
        q: "Can we scale up or down?",
        a: "Yes. We can adjust production volume and campaign intensity depending on your season, goals, or budget.",
      },
    ],
  },
  {
    section: "Strategy + Results",
    items: [
      {
        q: "How will this bring in customers?",
        a: "We don't just make content - we build campaigns designed to drive behavior. That means aligning visuals, messaging, and timing around real business goals like reservations, events, and menu pushes.",
      },
      {
        q: "How do we know what's working?",
        a: "We track performance monthly - what's driving engagement, clicks, and conversions - and adjust strategy accordingly.",
      },
    ],
  },
  {
    section: "Production",
    items: [
      {
        q: "How do shoot days work?",
        a: "We come in with a full plan - shot lists, concepts, and direction - so everything is efficient, organized, and intentional.",
      },
      {
        q: "Do we need to prepare anything?",
        a: "We'll guide you on exactly what's needed - menu items, staff availability, setup - but we handle the heavy lifting.",
      },
      {
        q: "Will you direct staff or talent?",
        a: "Yes. We fully direct talent, staff, and scenes so everything feels natural but elevated.",
      },
    ],
  },
  {
    section: "Social Media Management",
    items: [
      {
        q: "Do you post for us or just give content?",
        a: "We can do both. Many clients have us fully manage posting, scheduling, and rollout.",
      },
      {
        q: "Do you write captions?",
        a: "Yes - captions are written to match your brand voice and drive engagement.",
      },
      {
        q: "Do you respond to comments/DMs?",
        a: "We offer community management as part of full-service social.",
      },
    ],
  },
  {
    section: "Campaign + Big Picture",
    items: [
      {
        q: "Are you just making content or building campaigns?",
        a: "We build campaigns. Every piece of content is part of a bigger strategy designed to drive results - not just fill your feed.",
      },
      {
        q: "How do you approach launches or events?",
        a: "We create full rollout strategies - teasers, launch content, paid support, and post-event recaps - so you get maximum visibility and impact.",
      },
    ],
  },
  {
    section: "Creative Direction",
    items: [
      {
        q: "Will you tell us what to shoot?",
        a: "Yes - that's our job. We lead creative direction so you're never guessing.",
      },
      {
        q: "What if we don't know what content we need?",
        a: "Most clients don't - that's why we exist. We identify the opportunities and build the plan for you.",
      },
      {
        q: "Can you match our brand?",
        a: "We don't just match it - we elevate it while keeping it authentic.",
      },
    ],
  },
  {
    section: "Logistics + Workflow",
    items: [
      {
        q: "How long does it take to receive content?",
        a: "Turnaround is typically within 1-2 weeks depending on scope.",
      },
      {
        q: "Can we request revisions?",
        a: "Yes - we include revision rounds to make sure everything aligns.",
      },
    ],
  },
  {
    section: "The Real Questions",
    items: [
      {
        q: "Will this actually make us stand out?",
        a: "Yes - because we're not just creating content, we're building a cohesive brand presence that's designed to outperform your competition.",
      },
      {
        q: "Is this going to be a headache?",
        a: "No - we're built to take this off your plate. We handle planning, production, and execution so your team can stay focused on operations.",
      },
      {
        q: "Do you actually understand restaurants?",
        a: "Yes - this is our niche. Everything we create is built around what drives real traffic, orders, and guest experience.",
      },
    ],
  },
]

const FOOTER_DESCRIPTION =
  "Full-service marketing agency specialising in creative direction, brand identity, and commercial production."

// ─── Helpers ──────────────────────────────────────────────────────────────

// Unsplash's keyword-search source endpoint is deprecated and returns 503.
// LoremFlickr provides a stable keyword-based image source with no API key.
function unsplashUrl(keyword: string, w = 1600, h = 900): string {
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(keyword)}`
}

// ─── Internal mutations (used by the seed action) ─────────────────────────

export const emptyChecks = query({
  args: {},
  handler: async (ctx) => {
    return {
      homepage: (await ctx.db.query("homepage").first()) === null,
      services: (await ctx.db.query("services").first()) === null,
      categories: (await ctx.db.query("categories").first()) === null,
      projects: (await ctx.db.query("projects").first()) === null,
      about: (await ctx.db.query("about").first()) === null,
      aboutTimeline: (await ctx.db.query("aboutTimeline").first()) === null,
      aboutWheel: (await ctx.db.query("aboutWheel").first()) === null,
      contactInfo: (await ctx.db.query("contactInfo").first()) === null,
      faqSections: (await ctx.db.query("faqSections").first()) === null,
      footer: (await ctx.db.query("footer").first()) === null,
    }
  },
})

export const insertAbout = internalMutation({
  args: {
    values: v.array(
      v.object({
        image: v.optional(v.id("_storage")),
        label: v.string(),
        body: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("about", { values: args.values })
  },
})

export const insertTimeline = internalMutation({
  args: {
    rows: v.array(
      v.object({
        date: v.string(),
        client: v.string(),
        campaign: v.optional(v.string()),
        role: v.string(),
        description: v.string(),
        order: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const row of args.rows) await ctx.db.insert("aboutTimeline", row)
  },
})

export const insertFaq = internalMutation({
  args: {
    sections: v.array(
      v.object({
        name: v.string(),
        order: v.number(),
        items: v.array(
          v.object({
            question: v.string(),
            answer: v.string(),
            order: v.number(),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const section of args.sections) {
      const sectionId = await ctx.db.insert("faqSections", {
        name: section.name,
        order: section.order,
      })
      for (const item of section.items) {
        await ctx.db.insert("faqItems", { ...item, sectionId })
      }
    }
  },
})

// ─── Seed action ──────────────────────────────────────────────────────────

async function fetchAndStore(
  ctx: { storage: { store: (b: Blob) => Promise<Id<"_storage">> } },
  url: string,
): Promise<Id<"_storage">> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${url} failed: ${res.status}`)
  const blob = await res.blob()
  return await ctx.storage.store(blob)
}

// Backfill galleries and serviceIds on existing projects.
// Idempotent: skips projects that already have a non-empty gallery AND non-empty serviceIds.
export const backfillProjects = action({
  args: {},
  handler: async (
    ctx,
  ): Promise<{ updated: string[]; skipped: string[]; missing: string[] }> => {
    const projects = await ctx.runQuery(api.portfolio.listProjects, {})
    const services = await ctx.runQuery(api.services.list, {})
    const serviceIdByName = new Map(services.map((s) => [s.name, s._id]))

    const seedBySlug = new Map<string, ProjectSeed>()
    for (const c of CATEGORIES_DATA) {
      for (const p of c.projects) seedBySlug.set(p.slug, p)
    }

    const updated: string[] = []
    const skipped: string[] = []
    const missing: string[] = []

    for (const proj of projects) {
      const seed = seedBySlug.get(proj.slug)
      if (!seed) {
        missing.push(proj.slug)
        continue
      }
      const needsGallery = proj.gallery.length === 0
      const needsServices = proj.serviceIds.length === 0
      if (!needsGallery && !needsServices) {
        skipped.push(proj.slug)
        continue
      }
      const patch: {
        gallery?: Id<"_storage">[]
        serviceIds?: Id<"services">[]
      } = {}
      if (needsGallery) {
        patch.gallery = await Promise.all(
          seed.galleryQueries.map((q) =>
            fetchAndStore(ctx, unsplashUrl(q, 1200, 900)),
          ),
        )
      }
      if (needsServices) {
        patch.serviceIds = seed.serviceNames
          .map((n) => serviceIdByName.get(n))
          .filter((id): id is Id<"services"> => id !== undefined)
      }
      await ctx.runMutation(api.portfolio.updateProject, {
        id: proj._id,
        ...patch,
      })
      updated.push(proj.slug)
    }
    return { updated, skipped, missing }
  },
})

// Top-up missing hero slots without touching anything else. Idempotent.
export const fillHeroSlots = action({
  args: {},
  handler: async (ctx): Promise<{ added: number[]; existing: number[] }> => {
    const homepage = await ctx.runQuery(api.homepage.get, {})
    const existing = homepage?.heroImages ?? []
    const filled = new Set(existing.map((h) => h.slot))
    const missing = HERO_QUERIES.map((q, slot) => ({ slot, q })).filter(
      (e) => !filled.has(e.slot),
    )
    const added: { slot: number; image: Id<"_storage"> }[] = []
    for (const m of missing) {
      const image = await fetchAndStore(ctx, unsplashUrl(m.q))
      added.push({ slot: m.slot, image })
    }
    if (added.length > 0) {
      await ctx.runMutation(api.homepage.patch, {
        heroImages: [...existing, ...added],
      })
    }
    return {
      added: added.map((a) => a.slot),
      existing: existing.map((e) => e.slot),
    }
  },
})

export const run = action({
  args: {},
  handler: async (ctx): Promise<{ seeded: string[]; skipped: string[] }> => {
    const empty: {
      homepage: boolean
      services: boolean
      categories: boolean
      projects: boolean
      about: boolean
      aboutTimeline: boolean
      aboutWheel: boolean
      contactInfo: boolean
      faqSections: boolean
      footer: boolean
    } = await ctx.runQuery(api.seed.emptyChecks, {})

    const seeded: string[] = []
    const skipped: string[] = []

    // ── Homepage ──
    if (empty.homepage) {
      const heroImages = await Promise.all(
        HERO_QUERIES.map(async (q, slot) => ({
          slot,
          image: await fetchAndStore(ctx, unsplashUrl(q)),
        })),
      )
      const campaignImage = await fetchAndStore(
        ctx,
        unsplashUrl(CAMPAIGN_QUERY),
      )
      await ctx.runMutation(api.homepage.patch, {
        ...HOMEPAGE_COPY,
        heroImages,
        campaignImage,
      })
      seeded.push("homepage")
    } else skipped.push("homepage")

    // ── Services ──
    if (empty.services) {
      for (let i = 0; i < SERVICES_DATA.length; i++) {
        const s = SERVICES_DATA[i]
        const image = await fetchAndStore(
          ctx,
          unsplashUrl(s.imageQuery, 800, 1000),
        )
        await ctx.runMutation(api.services.create, {
          name: s.name,
          color: s.color,
          bullets: s.bullets,
          size: s.size,
          order: i,
          image,
        })
      }
      seeded.push("services")
    } else skipped.push("services")

    // ── Categories + Projects ──
    if (empty.categories) {
      // Insert categories, capture id-by-slug map for project linking.
      const categoryIdBySlug: Record<string, Id<"categories">> = {}
      for (const c of CATEGORIES_DATA) {
        const image = await fetchAndStore(ctx, unsplashUrl(c.imageQuery))
        const id: Id<"categories"> = await ctx.runMutation(
          api.portfolio.createCategory,
          {
            slug: c.slug,
            name: c.name,
            color: c.color,
            bullets: c.bullets,
            headline: c.headline,
            description: c.description,
            image,
          },
        )
        categoryIdBySlug[c.slug] = id
      }
      seeded.push("categories")

      if (empty.projects) {
        const services = await ctx.runQuery(api.services.list, {})
        const serviceIdByName = new Map(services.map((s) => [s.name, s._id]))
        for (const c of CATEGORIES_DATA) {
          const categoryId = categoryIdBySlug[c.slug]
          for (const p of c.projects) {
            const coverImage = await fetchAndStore(
              ctx,
              unsplashUrl(p.imageQuery, 1200, 800),
            )
            const gallery = await Promise.all(
              p.galleryQueries.map((q) =>
                fetchAndStore(ctx, unsplashUrl(q, 1200, 900)),
              ),
            )
            const serviceIds = p.serviceNames
              .map((n) => serviceIdByName.get(n))
              .filter((id): id is Id<"services"> => id !== undefined)
            await ctx.runMutation(api.portfolio.createProject, {
              slug: p.slug,
              title: p.title,
              description: p.description,
              approach: c.approach,
              execution: c.execution,
              results: c.results,
              coverImage,
              gallery,
              featured: FEATURED_SLUGS.has(p.slug),
              categoryIds: [categoryId],
              serviceIds,
            })
          }
        }
        seeded.push("projects")
      } else skipped.push("projects")
    } else {
      skipped.push("categories")
      if (!empty.projects) skipped.push("projects")
    }

    // ── About (values singleton) ──
    if (empty.about) {
      const values = await Promise.all(
        ABOUT_VALUES.map(async (entry) => ({
          label: entry.label,
          body: entry.body,
          image: await fetchAndStore(
            ctx,
            unsplashUrl(entry.imageQuery, 800, 1000),
          ),
        })),
      )
      await ctx.runMutation(internal.seed.insertAbout, { values })
      seeded.push("about")
    } else skipped.push("about")

    // ── About timeline ──
    if (empty.aboutTimeline) {
      const rows = TIMELINE_DATA.map((t, i) => ({
        date: t.date,
        client: t.client,
        ...(t.campaign ? { campaign: t.campaign } : {}),
        role: t.role,
        description: t.description,
        order: i,
      }))
      await ctx.runMutation(internal.seed.insertTimeline, { rows })
      seeded.push("aboutTimeline")
    } else skipped.push("aboutTimeline")

    // ── About wheel ──
    if (empty.aboutWheel) {
      for (let i = 0; i < WHEEL_DATA.length; i++) {
        const w = WHEEL_DATA[i]
        const image = await fetchAndStore(
          ctx,
          unsplashUrl(w.imageQuery, 1200, 900),
        )
        await ctx.runMutation(api.about.createWheel, {
          heading: w.heading,
          body: w.body,
          image,
          order: i,
        })
      }
      seeded.push("aboutWheel")
    } else skipped.push("aboutWheel")

    // ── Contact info ──
    if (empty.contactInfo) {
      await ctx.runMutation(api.contact.patchInfo, CONTACT_INFO)
      seeded.push("contactInfo")
    } else skipped.push("contactInfo")

    // ── FAQ ──
    if (empty.faqSections) {
      const sections = FAQ_DATA.map((s, sIdx) => ({
        name: s.section,
        order: sIdx,
        items: s.items.map((it, iIdx) => ({
          question: it.q,
          answer: it.a,
          order: iIdx,
        })),
      }))
      await ctx.runMutation(internal.seed.insertFaq, { sections })
      seeded.push("faqSections")
    } else skipped.push("faqSections")

    // ── Footer ──
    if (empty.footer) {
      await ctx.runMutation(api.footer.patch, {
        description: FOOTER_DESCRIPTION,
      })
      seeded.push("footer")
    } else skipped.push("footer")

    return { seeded, skipped }
  },
})
