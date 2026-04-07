import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link } from "react-router"
import { TextReveal } from "../components/text-reveal"

const SERVICES = [
  {
    name: "Creative Direction",
    tag: "Strategy",
    desc: "Full art direction and campaign concepting — from moodboards to shoot day.",
    bullets: [
      "Creative direction + art direction",
      "Campaign concepting (menu drops, seasonal, events)",
      "Shot lists + production planning",
      "Moodboards + visual references",
      "Location scouting + talent coordination",
    ],
    inverted: false,
    minH: "min-h-[300px]",
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
    minH: "min-h-[360px]",
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
    minH: "min-h-[260px]",
  },
  {
    name: "Visual Identity",
    tag: "Design",
    desc: "Cohesive visual systems — color, type, patterns, and a full brand asset library.",
    bullets: [
      "Visual identity systems",
      "Color palette + typography system",
      "Patterns / textures + iconography",
      "Social media look + feel system",
      "Brand asset library",
    ],
    inverted: false,
    minH: "min-h-[320px]",
  },
  {
    name: "Social Media",
    tag: "Content",
    desc: "Full social media management — strategy, content, scheduling, and community.",
    bullets: [
      "Full social media management (IG, TikTok, FB, etc.)",
      "Social strategy + monthly planning",
      "Posting + scheduling",
      "Caption writing + brand voice development",
      "Community management (comments + DMs)",
    ],
    inverted: false,
    minH: "min-h-[260px]",
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
    minH: "min-h-[340px]",
  },
  {
    name: "Graphic Design",
    tag: "Design",
    desc: "Full-service graphic design — print, digital, and everything in between.",
    bullets: [
      "Full-service graphic design + promotional design",
      "Menu + insert design support",
      "Print + in-house collateral (flyers, posters, table tents)",
      "Digital assets (social graphics, headers, templates)",
      "Monthly graphic drops + highlight covers",
    ],
    inverted: true,
    minH: "min-h-[280px]",
  },
  {
    name: "Motion Graphics",
    tag: "Video / Motion",
    desc: "Animated content that moves — logo animation, kinetic type, and promo templates.",
    bullets: [
      "Logo animation (transparent + background versions)",
      "Text + photo animation",
      "Animated promo design + story templates",
      "Kinetic typography promos",
      "Lower thirds + title sequences",
    ],
    inverted: false,
    minH: "min-h-[380px]",
  },
]

const ServiceCell = ({
  service,
  index,
}: {
  service: (typeof SERVICES)[0]
  index: number
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className={`relative flex flex-col justify-between border-b p-7 ${service.minH} ${
        service.inverted
          ? "border-black/25 bg-white text-black"
          : "border-white/40 bg-black text-white"
      }`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      {/* Top — tag + description */}
      <div className="pb-12">
        <span
          className={`mb-4 block text-xs font-bold tracking-[0.35em] uppercase ${
            service.inverted ? "text-black/40" : "text-white/30"
          }`}
        >
          {service.tag}
        </span>
        <p
          className={`text-sm leading-relaxed ${
            service.inverted ? "text-black/60" : "text-white/60"
          }`}
        >
          {service.desc}
        </p>

        {/* Expandable bullets */}
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-5">
                {service.bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`flex list-none items-start gap-2 text-xs leading-relaxed ${
                      service.inverted ? "text-black/70" : "text-white/70"
                    }`}
                  >
                    <span
                      className={`mt-[3px] shrink-0 text-xs ${
                        service.inverted ? "text-black/30" : "text-white/30"
                      }`}
                    >
                      —
                    </span>
                    {bullet}
                  </motion.li>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: service.bullets.length * 0.06 + 0.1,
                  duration: 0.35,
                }}
                className="pt-5"
              >
                <Link
                  to="/portfolio"
                  className={`text-xs font-bold tracking-[0.2em] uppercase underline underline-offset-4 transition-opacity hover:opacity-60 ${
                    service.inverted ? "text-black/60" : "text-white/60"
                  }`}
                >
                  Visit Portfolio
                </Link>
              </motion.div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Plus — absolutely centered in the card */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-fit items-center justify-center py-2 text-5xl leading-none font-thin transition-opacity hover:opacity-60 ${
          service.inverted ? "text-black/40" : "text-white/40"
        }`}
        aria-label={isOpen ? `Close ${service.name}` : `Expand ${service.name}`}
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          +
        </motion.span>
      </button>

      {/* Bottom — service name large */}
      <div className="overflow-hidden pt-12">
        <span className="block font-display text-3xl leading-[0.85] uppercase md:text-4xl">
          {service.name}
        </span>
      </div>
    </motion.div>
  )
}

export const Services = () => (
  <div className="pt-32">
    {/* Page header */}
    <section className="border-b border-white/10 px-8 pb-16 md:px-16">
      <span className="mb-6 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
        What We Do
      </span>
      <TextReveal
        text="SERVICES"
        className="massive-text text-6xl leading-none md:text-10xl lg:text-11xl"
      />
    </section>

    {/* Asymmetric bento grid — 3 flex columns so cards stack flush */}
    <div className="flex flex-col divide-y divide-white/40 md:flex-row md:divide-x md:divide-y-0">
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
