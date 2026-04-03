export type Project = {
  title: string
  tags: [string, string]
  descriptor: string
  img: string
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

export const CATEGORIES: Category[] = [
  {
    slug: "creative-direction",
    name: "Creative Direction",
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600",
    height: "720px",
    bullets: [
      "Creative direction + art direction",
      "Campaign concepting (menu drops, seasonal, events)",
      "Shot lists + production planning",
      "Moodboards + visual references",
      "Styling direction (food styling, props, wardrobe)",
    ],
    overview: {
      headline: "Your brand deserves a visual voice that stops people cold.",
      description:
        "Creative direction isn't just about pretty pictures — it's the strategy behind every frame. From campaign concepting to shoot day execution, we build the visual language your brand needs to command attention and convert on every platform.",
      problem:
        "Most brands shoot reactively — no shot list, no concept, no continuity. Content feels disconnected and nothing builds on itself over time.",
      solution:
        "We lead full art direction end-to-end: concepting campaigns around real business moments, writing detailed shot lists, building moodboards, and coordinating every element before a camera turns on.",
      execution:
        "Every shoot is planned with intention — locations scouted, talent coordinated, food styled, props sourced. The result is content that looks like it belongs together because it was built that way.",
      results:
        "A cohesive visual identity that compounds with every piece of content. Campaigns that feel intentional, perform across channels, and build brand equity over time.",
    },
    projects: [
      {
        title: "Harvest Menu Drop",
        tags: ["Restaurant", "F&B"],
        descriptor: "Campaign Strategy",
        img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Summer Activation",
        tags: ["Beverage", "Seasonal"],
        descriptor: "Art Direction",
        img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Brand Rollout",
        tags: ["Retail", "Launch"],
        descriptor: "Visual Strategy",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  },
  {
    slug: "photography",
    name: "Photography",
    img: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=1600",
    height: "860px",
    bullets: [
      "Food, beverage, and lifestyle photography",
      "Interior / hospitality and event photography",
      "Edited photo galleries (web + social optimized)",
      "Hero image sets for campaigns",
      "Press-ready photo assets",
    ],
    overview: {
      headline: "Images that make people stop scrolling and start craving.",
      description:
        "Food, beverage, and lifestyle photography built for brands that demand presence. Hero images, event coverage, and press-ready assets — all edited and optimized for social, web, and press. Every frame is built to convert.",
      problem:
        "Generic photography blends in. Most F&B brands are shooting on phones or relying on stock imagery that doesn't reflect their actual quality or identity.",
      solution:
        "We bring full production photography to every shoot — food and prop styling, professional lighting, and a creative eye trained on what actually stops the scroll and drives action.",
      execution:
        "Hero dishes, ambiance, staff and guest lifestyle — captured in a single organized shoot and delivered as optimized galleries ready for every use case: social, website, ads, and press.",
      results:
        "A full library of editorial-grade images your brand can deploy everywhere. Assets that elevate perception, drive cravings, and make your brand look as good as it actually is.",
    },
    projects: [
      {
        title: "Hero Dish Series",
        tags: ["Food", "Editorial"],
        descriptor: "Commercial",
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Interior Story",
        tags: ["Hospitality", "Lifestyle"],
        descriptor: "Editorial",
        img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Event Recap",
        tags: ["Events", "Social"],
        descriptor: "Event Coverage",
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  },
  {
    slug: "branding",
    name: "Branding",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600",
    height: "560px",
    bullets: [
      "Branding development + refresh",
      "Visual identity systems",
      "Brand voice + messaging support",
      "Logo suite + brand guidelines",
      "Social media look + feel system",
    ],
    overview: {
      headline: "A brand identity built to outlast trends and grow with you.",
      description:
        "Visual identity systems, logo suites, brand voice, and guidelines — built from strategy first. We develop brands that know exactly who they are before they say a word, and look the part everywhere they show up.",
      problem:
        "Outdated logos, inconsistent visuals, and no clear brand guidelines leave teams guessing and audiences confused about what you actually stand for.",
      solution:
        "We develop or refresh the full identity system: logo suite, color palette, typography, brand voice, and a guidelines document your whole team can actually use.",
      execution:
        "Every mark, color, and typeface is chosen with purpose. We deliver primary and secondary logos, icon sets, stacked marks, social look and feel, and a brand book that governs everything.",
      results:
        "A brand that shows up consistently everywhere — one that builds recognition, trust, and equity with every impression, from the first visit to the hundredth.",
    },
    projects: [
      {
        title: "Noire Collective",
        tags: ["Identity", "Logo"],
        descriptor: "Brand Identity",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Gather & Co.",
        tags: ["F&B", "Rebrand"],
        descriptor: "Visual System",
        img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "East Side Spirits",
        tags: ["Beverage", "Retail"],
        descriptor: "Brand Refresh",
        img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  },
  {
    slug: "campaigns",
    name: "Campaigns",
    img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1600",
    height: "620px",
    bullets: [
      "Promotional design + campaign rollouts",
      "Launch content kits (openings, new menus, seasonal promos)",
      "Event flyers, poster designs, and digital screen designs",
      "Launch content plan + rollout calendar",
      "Paid social ads management + boosting strategy",
    ],
    overview: {
      headline: "Launch content that builds anticipation and drives real action.",
      description:
        "Promotional design, rollout calendars, paid social strategy, and full launch kits — built around your business goals, not just aesthetics. Every campaign is engineered to create momentum and bring people through the door.",
      problem:
        "Most promotions are reactive — last-minute flyers, inconsistent graphics, and no coordinated rollout. The result is wasted opportunity every single time.",
      solution:
        "We build full campaign systems: promotional design, digital assets, event collateral, paid social strategy, and a rollout calendar so every piece lands at exactly the right time.",
      execution:
        "From grand opening kits to seasonal promo suites — every asset is designed to work together across print, digital screens, and paid social ads. Nothing ships without a plan.",
      results:
        "Campaigns that create real momentum. More foot traffic, stronger launch weeks, and a repeatable content system you can deploy every season without starting from scratch.",
    },
    projects: [
      {
        title: "Grand Opening Kit",
        tags: ["Launch", "F&B"],
        descriptor: "Launch Strategy",
        img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Fall Promo Suite",
        tags: ["Seasonal", "Retail"],
        descriptor: "Campaign Rollout",
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "New Menu Reveal",
        tags: ["Restaurant", "Social"],
        descriptor: "Promo Design",
        img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  },
  {
    slug: "production",
    name: "Production",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1600",
    height: "680px",
    bullets: [
      "Short-form video creation (Reels / TikTok / Shorts)",
      "Cinematic brand films + commercials",
      "Website hero videos + homepage loops",
      "Professional editing, color correction, and audio cleanup",
      "Serialized content (Interview series, \"Behind the Menu\")",
    ],
    overview: {
      headline: "Video that carries the full weight of your brand's story.",
      description:
        "Short-form content, cinematic brand films, homepage loops, and serialized series — produced, edited, and color graded to the highest standard. Built for the platforms where your audience actually lives.",
      problem:
        "Low-quality video or phone footage undermines even the strongest brands. Most businesses have no scalable video content system and fall further behind every month.",
      solution:
        "We produce everything from Reels and TikToks to full brand films — with complete post-production including editing, color correction, and audio cleanup built into every project.",
      execution:
        "A monthly content capture day delivers a full calendar of short-form video plus longer-form assets. Serialized formats like 'Behind the Menu' build a loyal audience over time.",
      results:
        "A consistent, high-quality video presence that builds brand equity, drives engagement, and gives your team professional assets to use across every channel.",
    },
    projects: [
      {
        title: "Behind the Menu",
        tags: ["Series", "F&B"],
        descriptor: "Serialized Content",
        img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Brand Film",
        tags: ["Commercial", "Cinematic"],
        descriptor: "Brand Film",
        img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Reel Pack",
        tags: ["Short-Form", "Social"],
        descriptor: "Short-Form",
        img: "https://images.unsplash.com/photo-1536240478700-b869ad10e2c8?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  },
  {
    slug: "social-media",
    name: "Social Media",
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1600",
    height: "780px",
    bullets: [
      "Full social media management + strategy",
      "Monthly content calendars + reporting",
      "Community management + trend research",
      "Monthly content capture days + retainer packages",
      "Story packs + Reels bundles",
    ],
    overview: {
      headline: "Full social management that turns followers into regulars.",
      description:
        "Strategy, content calendars, scheduling, caption writing, and community management — all handled. You focus on running the business; we own the feed and build the audience.",
      problem:
        "Inconsistent posting, no clear strategy, and zero community engagement leaves brands invisible on the platforms where their customers spend the most time.",
      solution:
        "We take over full social media management — strategy, monthly planning, content capture, scheduling, captions, and community management across IG, TikTok, and beyond.",
      execution:
        "Monthly content capture days feed a full calendar of planned posts, Reels bundles, and story packs — all written in your brand voice and posted at the optimal time.",
      results:
        "A growing, engaged community. More reach, more saves, more DMs — and a social presence that actually reflects the quality of your brand.",
    },
    projects: [
      {
        title: "Monthly Retainer",
        tags: ["IG", "TikTok"],
        descriptor: "Content Strategy",
        img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Reels Bundle",
        tags: ["Short-Form", "Social"],
        descriptor: "Social Growth",
        img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Launch Campaign",
        tags: ["F&B", "Organic"],
        descriptor: "Community",
        img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  },
  {
    slug: "influencer-ugc",
    name: "Influencer / UGC",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1600",
    height: "620px",
    bullets: [
      "Influencer sourcing + outreach",
      "UGC coordination + campaign management",
      "Usage rights + asset delivery",
      "Monthly UGC bundles + campaign briefs",
      "Performance recaps",
    ],
    overview: {
      headline: "Authentic creator content that reaches the right audience.",
      description:
        "Influencer sourcing, UGC coordination, usage rights, and monthly asset bundles — we handle the relationships, the briefs, and the delivery so you get content that actually converts.",
      problem:
        "Most brands either overpay for influencers or get low-quality UGC with no strategy behind it. Neither approach drives the real results brands are paying for.",
      solution:
        "We source and manage creators aligned to your brand — handling outreach, creative briefs, usage rights, and full asset delivery so every piece of content has a purpose.",
      execution:
        "Monthly UGC bundles and influencer campaigns are built around specific goals: new menu items, grand openings, seasonal pushes, and high-performing paid ad creative.",
      results:
        "Organic-feeling content at scale, with full usage rights. More social proof, stronger ad performance, and an audience that trusts your brand because real people said so.",
    },
    projects: [
      {
        title: "Creator Collab",
        tags: ["IG", "Beverage"],
        descriptor: "Creator Collab",
        img: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "UGC Pack",
        tags: ["F&B", "Organic"],
        descriptor: "Organic Growth",
        img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Campaign Brief",
        tags: ["Lifestyle", "Product"],
        descriptor: "UGC Campaign",
        img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  },
  {
    slug: "launch-event-marketing",
    name: "Launch + Event Marketing",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600",
    height: "640px",
    bullets: [
      "Grand opening support",
      "Event marketing strategy + rollout",
      "Event content capture + recap production",
      "Launch content plan + rollout calendar",
      "Press-ready assets + promo graphics",
    ],
    overview: {
      headline: "Grand openings and events that people actually show up to.",
      description:
        "Full launch strategy, event marketing, content capture, rollout calendars, and press-ready assets — built to maximize visibility before, during, and long after the doors open.",
      problem:
        "Most grand openings and events are under-marketed. The venue looks incredible, but no one knows about it until it's too late to build real anticipation.",
      solution:
        "We build the full launch ecosystem: promotional strategy, event flyers, digital ads, content capture plan, and a rollout calendar that builds genuine anticipation from day one.",
      execution:
        "Teasers, countdown content, day-of capture, and post-event recap production — every phase of the event lifecycle is covered with intentional, high-quality content.",
      results:
        "Lines at the door, packed rooms, and a social media moment that lives beyond the night. Your launch becomes your most powerful piece of content.",
    },
    projects: [
      {
        title: "Grand Opening",
        tags: ["F&B", "Launch"],
        descriptor: "Grand Opening",
        img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Pop-Up Event",
        tags: ["Retail", "Activation"],
        descriptor: "Event Strategy",
        img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Soft Launch",
        tags: ["Hospitality", "PR"],
        descriptor: "Launch Rollout",
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  },
  {
    slug: "motion-graphics",
    name: "Motion Graphics",
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1600",
    height: "700px",
    bullets: [
      "Logo animation + animated promo design",
      "Animated story templates + flyers",
      "Kinetic typography promos",
      "Lower thirds + title sequences",
      "GIFs + sticker packs",
    ],
    overview: {
      headline: "Animation that makes your brand impossible to ignore.",
      description:
        "Logo animations, story templates, kinetic typography, lower thirds, and GIF packs — motion content built for every platform your brand lives on. Static graphics scroll by. Motion commands attention.",
      problem:
        "Most brands have no animated assets and fall back on basic templates that look identical to every other brand in their space. Static content doesn't stand out anymore.",
      solution:
        "We build custom animated assets from the ground up: logo reveals in transparent and background versions, animated story templates, kinetic type promos, and full promo sequences.",
      execution:
        "Every animation is delivered in multiple formats and sizes — ready to drop into social content, ads, presentations, or your website without any additional work from your team.",
      results:
        "A motion identity that reinforces your brand at every touchpoint. Content that stands out in the feed, stops the scroll, and elevates the perception of everything you put out.",
    },
    projects: [
      {
        title: "Logo Pack",
        tags: ["Animation", "Brand"],
        descriptor: "Motion Design",
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Story Templates",
        tags: ["IG", "Social"],
        descriptor: "Animation",
        img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Promo Series",
        tags: ["Campaign", "Digital"],
        descriptor: "Kinetic",
        img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  },
]
