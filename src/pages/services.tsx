import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link } from "react-router"
import { TextReveal } from "../components/text-reveal"

const SERVICES = [
  {
    name: "Creative Direction",
    tag: "Strategy",
    color: "#F59E0B",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600&h=800",
    desc: "Full art direction and campaign concepting, from moodboards to shoot day.",
    bullets: [
      "Creative direction + art direction",
      "Campaign concepting (menu drops, seasonal, events)",
      "Shot lists + production planning",
      "Moodboards + visual references",
      "Location scouting + talent coordination",
    ],
    minH: "min-h-[414px]",
  },
  {
    name: "Photography",
    tag: "Photo",
    color: "#3B82F6",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600&h=800",
    desc: "Food, lifestyle, and event photography built for brands that demand presence.",
    bullets: [
      "Food and beverage photography (hero dishes, menu items, action shots)",
      'Lifestyle photography (guests, staff, ambiance, "vibe" shots)',
      "Interior / hospitality photography",
      "Event photography + recap coverage",
      "Product photography (retail items, merch, packaged goods)",
    ],
    minH: "min-h-[497px]",
  },
  {
    name: "Branding",
    tag: "Design",
    color: "#8B5CF6",
    img: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=600&h=800",
    desc: "Brand development and identity systems built to outlast trends and grow with you.",
    bullets: [
      "Branding development + refresh",
      "Visual identity systems",
      "Brand voice + messaging support",
      "Logo suite (primary, secondary, icons, stacked marks)",
      "Brand guidelines / brand book",
    ],
    minH: "min-h-[359px]",
  },
  {
    name: "Visual Identity",
    tag: "Design",
    color: "#EC4899",
    img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=600&h=800",
    desc: "Cohesive visual systems: color, type, patterns, and a full brand asset library.",
    bullets: [
      "Visual identity systems",
      "Color palette + typography system",
      "Patterns / textures + iconography",
      "Social media look + feel system",
      "Brand asset library",
    ],
    minH: "min-h-[442px]",
  },
  {
    name: "Social Media",
    tag: "Content",
    color: "#10B981",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600&h=800",
    desc: "Full social media management: strategy, content, scheduling, and community.",
    bullets: [
      "Full social media management (IG, TikTok, FB, etc.)",
      "Social strategy + monthly planning",
      "Posting + scheduling",
      "Caption writing + brand voice development",
      "Community management (comments + DMs)",
    ],
    minH: "min-h-[359px]",
  },
  {
    name: "Email Marketing",
    tag: "Email",
    color: "#EF4444",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600&h=800",
    desc: "Email strategy, design, and campaigns that drive opens, clicks, and conversions.",
    bullets: [
      "Email strategy + campaign planning",
      "Email design + copywriting",
      "Template building + list growth support",
      "Monthly email campaigns + promotional blasts",
      "Performance reporting (open rates, CTR)",
    ],
    minH: "min-h-[469px]",
  },
  {
    name: "Graphic Design",
    tag: "Design",
    color: "#06B6D4",
    img: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&q=80&w=600&h=800",
    desc: "Full-service graphic design: print, digital, and everything in between.",
    bullets: [
      "Full-service graphic design + promotional design",
      "Menu + insert design support",
      "Print + in-house collateral (flyers, posters, table tents)",
      "Digital assets (social graphics, headers, templates)",
      "Monthly graphic drops + highlight covers",
    ],
    minH: "min-h-[386px]",
  },
  {
    name: "Motion Graphics",
    tag: "Video / Motion",
    color: "#F97316",
    img: "https://images.unsplash.com/photo-1574717024453-354056afd6fc?auto=format&fit=crop&q=80&w=600&h=800",
    desc: "Animated content that moves: logo animation, kinetic type, and promo templates.",
    bullets: [
      "Logo animation (transparent + background versions)",
      "Text + photo animation",
      "Animated promo design + story templates",
      "Kinetic typography promos",
      "Lower thirds + title sequences",
    ],
    minH: "min-h-[524px]",
  },
  {
    name: "Videography",
    tag: "Video",
    color: "#6366F1",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600&h=800",
    desc: "Professional video production: brand films, reels, event coverage, and scroll-stopping content.",
    bullets: [
      "Brand films + short-form video",
      "Social media reels + TikTok content",
      "Event coverage + recap videos",
      "Product + promotional video",
      "Testimonial + interview production",
    ],
    minH: "min-h-[414px]",
  },
]

const ServiceCell = ({
  service,
  index,
}: {
  service: (typeof SERVICES)[0]
  index: number
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative border-b border-white/10 bg-black ${service.minH}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      {/* Image inset — gap from card edge with rounded corners.
          Uses rounded-[16px] not rounded-2xl because index.css overrides
          .rounded-xl and .rounded-2xl to border-radius:0 !important. */}
      <div className="absolute inset-3 overflow-hidden rounded-[16px]">
        {/* Photo */}
        <img
          src={service.img}
          alt={service.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />

        {/* Permanent gradient — keeps bottom text legible */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

        {/* Hover darkening */}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-black"
          animate={{ opacity: isHovered ? 0.4 : 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col p-5 md:p-6">
          {/* Bottom area: hover bullets above the service name */}
          <div className="flex flex-1 flex-col justify-end">
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-4"
                >
                  <ul className="space-y-1.5">
                    {service.bullets.map((bullet, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: i * 0.04,
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex list-none items-start gap-2 text-xs leading-relaxed text-white/80"
                      >
                        <span className="mt-[3px] shrink-0 text-white/40">–</span>
                        {bullet}
                      </motion.li>
                    ))}
                  </ul>
                  <Link
                    to="/portfolio"
                    className="mt-4 inline-block text-xs font-bold tracking-[0.2em] text-white/70 uppercase underline underline-offset-4 transition-opacity hover:text-white"
                  >
                    See Portfolio
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Service name — always at bottom */}
            <span className="block font-display text-3xl leading-[0.85] uppercase text-white md:text-4xl">
              {service.name}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const Services = () => (
  <div className="pt-32">
    {/* Page header — centered */}
    <section className="border-b border-white/10 px-8 pb-16 text-center md:px-16">
      <span className="mb-6 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
        What We Do
      </span>
      <TextReveal
        text="SERVICES"
        className="massive-text justify-center text-6xl leading-none md:text-10xl lg:text-11xl"
      />
    </section>

    {/* 3-column bento grid */}
    <div className="flex flex-col divide-y divide-white/10 md:flex-row md:divide-x md:divide-y-0">
      {[0, 1, 2].map((col) => {
        const colServices = SERVICES.filter((_, i) => i % 3 === col)
        return (
          <div key={col} className="flex flex-1 flex-col">
            {colServices.map((service, row) => (
              <ServiceCell
                key={service.name}
                service={service}
                index={col + row * 3}
              />
            ))}
          </div>
        )
      })}
    </div>
  </div>
)
