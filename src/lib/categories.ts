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
  color: string
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
    color: "#F59E0B",
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
        "Creative direction is the strategy behind every frame. From campaign concepting to shoot day execution, we build the visual language your brand needs to command attention on every platform.",
      problem:
        "Most brands shoot reactively — no concept, no continuity. Content feels disconnected and nothing builds on itself.",
      solution:
        "We lead full art direction end-to-end: concepting campaigns around real business moments, writing shot lists, and coordinating every element before a camera turns on.",
      execution:
        "Every shoot is planned with intention — locations scouted, talent coordinated, food styled, props sourced — so content looks like it belongs together.",
      results:
        "A cohesive visual identity that compounds with every piece of content. Campaigns that perform across channels and build brand equity over time.",
    },
    projects: [
      {
        slug: "harvest-menu-drop",
        title: "Harvest Menu Drop",
        tags: ["Restaurant", "F&B"],
        descriptor: "Campaign Strategy",
        img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
        description:
          "A seasonal campaign built around a Pittsburgh restaurant's fall menu launch — concepted, shot, and rolled out across social and in-venue screens. Every frame was designed to create craving before a single dish hit the table.",
      },
      {
        slug: "summer-activation",
        title: "Summer Activation",
        tags: ["Beverage", "Seasonal"],
        descriptor: "Art Direction",
        img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1200",
        description:
          "Art direction for a regional beverage brand's summer campaign — product photography, lifestyle content, and social rollout. Bold color, natural light, and energy that felt alive on every feed.",
      },
      {
        slug: "brand-rollout",
        title: "Brand Rollout",
        tags: ["Retail", "Launch"],
        descriptor: "Visual Strategy",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200",
        description:
          "Visual strategy for a retail brand entering a competitive market. We defined the language from scratch — styling, palette, shot structure, platform formats — delivering a launch suite that felt intentional from day one.",
      },
    ],
  },
  {
    slug: "photography",
    name: "Photography",
    color: "#3B82F6",
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
        "Food, beverage, and lifestyle photography built for brands that demand presence. Hero images, event coverage, and press-ready assets — edited and optimized for social, web, and press.",
      problem:
        "Generic photography blends in. Most F&B brands shoot on phones or rely on stock that doesn't reflect their actual quality.",
      solution:
        "Full production photography at every shoot — food and prop styling, professional lighting, and a creative eye trained on what stops the scroll.",
      execution:
        "Hero dishes, ambiance, and lifestyle — captured in one organized shoot and delivered as optimized galleries for social, website, ads, and press.",
      results:
        "A full library of editorial-grade images deployable everywhere. Assets that elevate perception and make your brand look as good as it actually is.",
    },
    projects: [
      {
        slug: "hero-dish-series",
        title: "Hero Dish Series",
        tags: ["Food", "Editorial"],
        descriptor: "Commercial",
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1200",
        description:
          "Hero dish series for a multi-location restaurant group — editorial-grade food photography styled and lit to stop the scroll. Shot in a single production day, covering signature dishes, seasonal specials, and lifestyle context for web, ads, and press.",
      },
      {
        slug: "interior-story",
        title: "Interior Story",
        tags: ["Hospitality", "Lifestyle"],
        descriptor: "Editorial",
        img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
        description:
          "Editorial photography documenting a newly opened hospitality venue — architecture, ambiance, and energy that words alone can't convey. The library became the foundation for their website, press kit, and opening week social campaign.",
      },
      {
        slug: "event-recap",
        title: "Event Recap",
        tags: ["Events", "Social"],
        descriptor: "Event Coverage",
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200",
        description:
          "Full event coverage for a sold-out dining experience — real-time social content and a polished recap gallery. Cinematic framing focused on authentic energy that made people who weren't there wish they had been.",
      },
    ],
  },
  {
    slug: "branding",
    name: "Branding",
    color: "#8B5CF6",
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
        "Visual identity systems, logo suites, brand voice, and guidelines — built strategy-first. We develop brands that know exactly who they are before they say a word.",
      problem:
        "Outdated logos and inconsistent visuals leave teams guessing and audiences confused about what you stand for.",
      solution:
        "We develop or refresh the full identity: logo suite, color palette, typography, brand voice, and a guidelines document your whole team can actually use.",
      execution:
        "Every mark, color, and typeface chosen with purpose — primary and secondary logos, icon sets, social look and feel, and a brand book that governs everything.",
      results:
        "A brand that shows up consistently everywhere, building recognition, trust, and equity with every impression.",
    },
    projects: [
      {
        slug: "noire-collective",
        title: "Noire Collective",
        tags: ["Identity", "Logo"],
        descriptor: "Brand Identity",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
        description:
          "Brand identity for Noire Collective, a luxury hospitality concept in Pittsburgh's East End. Full mark suite, typographic system, color palette, and guidelines built from scratch — strong enough to carry the brand across every surface it would ever touch.",
      },
      {
        slug: "gather-and-co",
        title: "Gather & Co.",
        tags: ["F&B", "Rebrand"],
        descriptor: "Visual System",
        img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200",
        description:
          "Full rebrand for Gather & Co., an F&B concept that had outgrown its original identity. New logo suite, refreshed palette, updated typography, and a social look-and-feel system the whole team could execute consistently.",
      },
      {
        slug: "east-side-spirits",
        title: "East Side Spirits",
        tags: ["Beverage", "Retail"],
        descriptor: "Brand Refresh",
        img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
        description:
          "Brand refresh for East Side Spirits, a craft beverage retailer repositioning for a premium audience — logo refinement, new secondary mark, updated packaging direction, and retail-ready guidelines.",
      },
    ],
  },
  {
    slug: "campaigns",
    name: "Campaigns",
    color: "#6B7280",
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
      headline:
        "Launch content that builds anticipation and drives real action.",
      description:
        "Promotional design, rollout calendars, paid social strategy, and full launch kits — built around your business goals, not just aesthetics. Every campaign is engineered to create momentum.",
      problem:
        "Most promotions are reactive — last-minute flyers, inconsistent graphics, no coordinated rollout. Wasted opportunity every time.",
      solution:
        "Full campaign systems: promotional design, digital assets, event collateral, paid social strategy, and a rollout calendar so every piece lands at the right time.",
      execution:
        "From grand opening kits to seasonal suites, every asset works together across print, digital screens, and paid social. Nothing ships without a plan.",
      results:
        "Real momentum — more foot traffic, stronger launch weeks, and a repeatable content system you can deploy every season.",
    },
    projects: [
      {
        slug: "grand-opening-kit",
        title: "Grand Opening Kit",
        tags: ["Launch", "F&B"],
        descriptor: "Launch Strategy",
        img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
        description:
          "Grand opening kit for a new F&B concept — pre-launch teasers, opening week graphics, digital screen assets, event collateral, and a social rollout calendar. Everything designed to build anticipation and get people through the door on night one.",
      },
      {
        slug: "fall-promo-suite",
        title: "Fall Promo Suite",
        tags: ["Seasonal", "Retail"],
        descriptor: "Campaign Rollout",
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
        description:
          "Fall promotional suite for a multi-location retail brand — one cohesive visual system rolling out across organic social, paid ads, email, and in-store screens without needing a custom asset for every placement.",
      },
      {
        slug: "new-menu-reveal",
        title: "New Menu Reveal",
        tags: ["Restaurant", "Social"],
        descriptor: "Promo Design",
        img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
        description:
          "Promotional design and social campaign for a restaurant's menu reveal — hero food photography, promo graphics, Reels content, and a posting plan that made the launch feel like an event worth showing up for.",
      },
    ],
  },
  {
    slug: "production",
    name: "Production",
    color: "#6B7280",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1600",
    height: "680px",
    bullets: [
      "Short-form video creation (Reels / TikTok / Shorts)",
      "Cinematic brand films + commercials",
      "Website hero videos + homepage loops",
      "Professional editing, color correction, and audio cleanup",
      'Serialized content (Interview series, "Behind the Menu")',
    ],
    overview: {
      headline: "Video that carries the full weight of your brand's story.",
      description:
        "Short-form content, cinematic brand films, homepage loops, and serialized series — produced, edited, and color graded to the highest standard for the platforms where your audience lives.",
      problem:
        "Low-quality video undermines even the strongest brands. Most businesses have no scalable video system and fall further behind every month.",
      solution:
        "We produce everything from Reels and TikToks to full brand films, with editing, color correction, and audio cleanup built into every project.",
      execution:
        "A monthly content capture day delivers short-form video plus longer-form assets. Serialized formats like 'Behind the Menu' build a loyal audience over time.",
      results:
        "A consistent, high-quality video presence that builds brand equity and gives your team professional assets across every channel.",
    },
    projects: [
      {
        slug: "behind-the-menu",
        title: "Behind the Menu",
        tags: ["Series", "F&B"],
        descriptor: "Serialized Content",
        img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
        description:
          "Serialized short-form video series for a chef-driven restaurant — behind the scenes of the kitchen, sourcing, and the craft behind each dish. Produced monthly, it built a loyal following and gave the restaurant a consistent reason to show up in the feed.",
      },
      {
        slug: "brand-film",
        title: "Brand Film",
        tags: ["Commercial", "Cinematic"],
        descriptor: "Brand Film",
        img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200",
        description:
          "Cinematic brand film for a hospitality group — shot over two days, fully color graded, and scored to carry the brand's story. Built to anchor the homepage, run as a pre-roll ad, and define what the brand stands for.",
      },
      {
        slug: "reel-pack",
        title: "Reel Pack",
        tags: ["Short-Form", "Social"],
        descriptor: "Short-Form",
        img: "https://images.unsplash.com/photo-1536240478700-b869ad10e2c8?auto=format&fit=crop&q=80&w=1200",
        description:
          "Monthly Reel production package for a fast-growing F&B brand — 8–12 platform-ready Reels per month, cut for maximum watch time with trending audio and on-brand visuals that outperformed static content by 3–5x.",
      },
    ],
  },
  {
    slug: "social-media",
    name: "Social Media",
    color: "#10B981",
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
        "Strategy, content calendars, scheduling, caption writing, and community management — all handled. You focus on the business; we own the feed and build the audience.",
      problem:
        "Inconsistent posting and no community engagement leaves brands invisible on the platforms where customers spend the most time.",
      solution:
        "We take over full social management — strategy, monthly planning, content capture, captions, and community across IG, TikTok, and beyond.",
      execution:
        "Monthly capture days feed a full calendar of posts, Reels bundles, and story packs — written in your brand voice, posted at the optimal time.",
      results:
        "A growing, engaged community with more reach, saves, and DMs — and a social presence that reflects the quality of your brand.",
    },
    projects: [
      {
        slug: "monthly-retainer",
        title: "Monthly Retainer",
        tags: ["IG", "TikTok"],
        descriptor: "Content Strategy",
        img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200",
        description:
          "Full-service social media management for a regional F&B brand across Instagram and TikTok — strategy, scheduling, caption writing, and community management all handled. Grew to 40k+ followers in under 12 months without a single paid post.",
      },
      {
        slug: "reels-bundle",
        title: "Reels Bundle",
        tags: ["Short-Form", "Social"],
        descriptor: "Social Growth",
        img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
        description:
          "Short-form content bundle for a brand's first serious Reels push — 10 videos shot, edited, and captioned in one production day. Each built with a clear hook, platform-native pacing, and a CTA to drive a save, follow, or visit.",
      },
      {
        slug: "launch-campaign",
        title: "Launch Campaign",
        tags: ["F&B", "Organic"],
        descriptor: "Community",
        img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=1200",
        description:
          "Organic social launch for a new F&B concept — strategy, content creation, rollout calendar, and community management for the first 60 days. Built from zero to a loyal early audience before a single paid dollar was spent.",
      },
    ],
  },
  {
    slug: "influencer-ugc",
    name: "Influencer / UGC",
    color: "#6B7280",
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
        "Influencer sourcing, UGC coordination, usage rights, and monthly asset bundles — we handle the relationships, briefs, and delivery so you get content that actually converts.",
      problem:
        "Most brands overpay for influencers or get low-quality UGC with no strategy. Neither drives the results brands are paying for.",
      solution:
        "We source and manage creators aligned to your brand — outreach, creative briefs, usage rights, and full asset delivery so every piece has a purpose.",
      execution:
        "Monthly UGC bundles built around specific goals: new menu items, grand openings, seasonal pushes, and high-performing ad creative.",
      results:
        "Organic-feeling content at scale with full usage rights — more social proof, stronger ad performance, and an audience that trusts your brand.",
    },
    projects: [
      {
        slug: "creator-collab",
        title: "Creator Collab",
        tags: ["IG", "Beverage"],
        descriptor: "Creator Collab",
        img: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=1200",
        description:
          "Influencer campaign for a beverage brand targeting Pittsburgh's lifestyle audience — sourcing, briefing, and managing five local creators across a two-week activation. Full usage rights secured, content repurposed across paid and organic.",
      },
      {
        slug: "ugc-pack",
        title: "UGC Pack",
        tags: ["F&B", "Organic"],
        descriptor: "Organic Growth",
        img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200",
        description:
          "Monthly UGC bundle for a growing F&B brand — eight creators per month delivering authentic, on-brief content for organic posting and paid amplification. Replaced expensive production shoots while driving stronger engagement than polished studio work.",
      },
      {
        slug: "campaign-brief",
        title: "Campaign Brief",
        tags: ["Lifestyle", "Product"],
        descriptor: "UGC Campaign",
        img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200",
        description:
          "End-to-end UGC campaign for a lifestyle product launch — brief, creator sourcing, relationship management, deliverable review, and usage rights. Resulted in 30+ pieces of authentic social proof ready for ads, landing pages, and organic channels.",
      },
    ],
  },
  {
    slug: "launch-event-marketing",
    name: "Launch + Event Marketing",
    color: "#6B7280",
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
        "Most grand openings are under-marketed. The venue looks incredible but no one knows about it until it's too late to build anticipation.",
      solution:
        "We build the full launch ecosystem — promotional strategy, event flyers, digital ads, content capture plan, and a rollout calendar that builds genuine anticipation.",
      execution:
        "Teasers, countdown content, day-of capture, and post-event recap — every phase covered with intentional, high-quality content.",
      results:
        "Lines at the door, packed rooms, and a social moment that lives beyond the night. Your launch becomes your most powerful piece of content.",
    },
    projects: [
      {
        slug: "grand-opening",
        title: "Grand Opening",
        tags: ["F&B", "Launch"],
        descriptor: "Grand Opening",
        img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200",
        description:
          "Grand opening strategy for a new restaurant group — six weeks of pre-launch content, opening week coverage, same-day social delivery, and a full recap package. Opening night sold out before the doors opened, and social content drove reservations for three weeks after.",
      },
      {
        slug: "pop-up-event",
        title: "Pop-Up Event",
        tags: ["Retail", "Activation"],
        descriptor: "Event Strategy",
        img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200",
        description:
          "Event marketing and content capture for a retail pop-up in Pittsburgh's Strip District — promo graphics to live coverage to recap Reels. Drove 800+ visitors over two days and generated more organic UGC than any previous campaign.",
      },
      {
        slug: "soft-launch",
        title: "Soft Launch",
        tags: ["Hospitality", "PR"],
        descriptor: "Launch Rollout",
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
        description:
          "Soft launch content strategy and PR assets for a boutique hospitality concept opening to an invite-only audience — pre-launch calendar, press photography, and a media kit that landed features in two regional publications before public opening.",
      },
    ],
  },
  {
    slug: "motion-graphics",
    name: "Motion Graphics",
    color: "#F97316",
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
        "Logo animations, story templates, kinetic typography, lower thirds, and GIF packs — motion content for every platform. Static graphics scroll by. Motion commands attention.",
      problem:
        "Most brands have no animated assets and fall back on basic templates that look identical to everyone else.",
      solution:
        "Custom animated assets from scratch — logo reveals, animated story templates, kinetic type promos, and full promo sequences.",
      execution:
        "Every animation delivered in multiple formats and sizes, ready to drop into social, ads, presentations, or your website.",
      results:
        "A motion identity that reinforces your brand at every touchpoint and elevates the perception of everything you put out.",
    },
    projects: [
      {
        slug: "logo-pack",
        title: "Logo Pack",
        tags: ["Animation", "Brand"],
        descriptor: "Motion Design",
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
        description:
          "Animated logo pack for a hospitality brand — primary mark, secondary lockup, and icon in transparent, dark, and light versions across multiple styles. Produced in correct specs for social, website headers, email signatures, and decks.",
      },
      {
        slug: "story-templates",
        title: "Story Templates",
        tags: ["IG", "Social"],
        descriptor: "Animation",
        img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
        description:
          "12 branded animated story templates for a restaurant group — daily specials, event announcements, hours, and promos. Delivered as editable CapCut templates the team could update weekly without any design experience.",
      },
      {
        slug: "promo-series",
        title: "Promo Series",
        tags: ["Campaign", "Digital"],
        descriptor: "Kinetic",
        img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=1200",
        description:
          "Kinetic typography promo series for a seasonal campaign — five animated videos using bold type, brand colors, and motion designed to stop the scroll. Delivered in square, vertical, and landscape formats for IG, Reels, TikTok, and digital screens.",
      },
    ],
  },
]
