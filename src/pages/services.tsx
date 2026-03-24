import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { DeBlurText } from "../components/de-blur-text"
import { TextReveal } from "../components/text-reveal"

const SERVICE_DATA = [
  {
    id: "service-a",
    title: "VIDEOGRAPHY",
    desc: "Cinematic storytelling from brand films to event coverage, crafted with a director's eye and a photographer's instinct for light.",
    expertise:
      "Seven years of motion work across Pittsburgh and beyond. Devon brings a director's precision and a documentarian's patience to every brief, whether it's a commercial for Coors Light or an intimate character portrait shot in a single afternoon.",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000",
    capabilities: [
      {
        label: "Brand & Commercial Films",
        note: "Full-production narratives for forward-thinking brands",
      },
      {
        label: "Documentary & Long-Form",
        note: "Authentic stories told with patience and craft",
      },
      {
        label: "Event & Live Coverage",
        note: "Cultural, corporate, and live performance capture",
      },
      {
        label: "Short-Form & Social Content",
        note: "Scroll-stopping content built for modern platforms",
      },
    ],
    stats: [
      { value: "200+", label: "Films Produced" },
      { value: "7+", label: "Years in Production" },
    ],
  },
  {
    id: "service-b",
    title: "PHOTOGRAPHY",
    desc: "Editorial, commercial, and event photography that captures the decisive moment. Authentic, precise, and deeply considered.",
    expertise:
      "Devon's photographic practice spans editorial portraiture, commercial campaigns, and event coverage. The approach never changes: get close, stay patient, and trust the light to do what it always does.",
    img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1000",
    capabilities: [
      {
        label: "Editorial & Portrait",
        note: "Magazine, press, and talent portraiture",
      },
      {
        label: "Commercial & Product",
        note: "Campaign photography for global brands",
      },
      { label: "Landscape & Fine Art", note: "Personal and collectible works" },
      {
        label: "Event & Documentary",
        note: "Cultural moments preserved with intention",
      },
    ],
    stats: [
      { value: "500+", label: "Shoots Completed" },
      { value: "50+", label: "Brands Served" },
    ],
  },
  {
    id: "service-c",
    title: "GRAPHIC DESIGN",
    desc: "Visual identity systems, art direction, and typographic design that give brands a distinctive, lasting presence.",
    expertise:
      "From startup identity builds to established brand resets, Devon designs with both strategy and soul. Every mark, typeface, and color decision is rooted in the brand's truth, not the trend of the moment.",
    img: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=1000",
    capabilities: [
      {
        label: "Brand Identity Systems",
        note: "Logo, type, colour, and usage guidelines",
      },
      {
        label: "Art Direction",
        note: "Creative direction across print and digital",
      },
      {
        label: "Typographic Design",
        note: "Custom lettering and type-led layouts",
      },
      {
        label: "Print & Collateral",
        note: "Books, packaging, and physical brand assets",
      },
    ],
    stats: [
      { value: "80+", label: "Brands Designed" },
      { value: "7+", label: "Years of Experience" },
    ],
  },
]

// Individual capability row — text rises from behind a clip mask
const CapabilityRow = ({
  cap,
  index,
}: {
  cap: { label: string; note: string }
  index: number
}) => (
  <div className="border-b border-current/10">
    <div className="flex items-center justify-between gap-8 py-5">
      {/* Label: slides up from below the overflow-hidden mask */}
      <div className="overflow-hidden">
        <motion.span
          className="massive-text block text-xl md:text-2xl"
          initial={{ y: "115%" }}
          animate={{ y: "0%" }}
          transition={{
            duration: 0.55,
            delay: 0.08 + index * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {cap.label}
        </motion.span>
      </div>

      {/* Note: fades in after the label appears */}
      <motion.span
        className="hidden max-w-[38%] shrink-0 text-right text-[10px] tracking-[0.25em] uppercase opacity-50 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.45, delay: 0.22 + index * 0.07 }}
      >
        {cap.note}
      </motion.span>
    </div>
  </div>
)

// Animated +/× toggle icon
const ToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
  <motion.span
    className="relative flex h-4 w-4 flex-shrink-0 items-center justify-center"
    animate={{ rotate: isOpen ? 45 : 0 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
  >
    <span className="bg-white/40 absolute h-[1px] w-full" />
    <span className="bg-white/40 absolute h-full w-[1px]" />
  </motion.span>
)

export const Services = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <div className="pt-40">
      <div className="mb-32 px-8">
        <DeBlurText className="text-[12vw] leading-none">
          Our
          <br />
          <span className="text-white/60">Services</span>
        </DeBlurText>
      </div>

      <div className="space-y-0">
        {SERVICE_DATA.map((service, i) => {
          const isOpen = openId === service.id

          return (
            <section
              key={service.id}
              id={service.id}
              className="relative border-t border-current/10"
            >
              {/* Ambient neon glow on hover */}
              <div className="bg-white/40 pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-700 hover:opacity-[0.03]" />

              <div className="relative z-10 px-8 py-24 md:py-32">
                <TextReveal
                  text={service.title}
                  className="massive-text text-[15vw] leading-none"
                />

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mt-8 max-w-xl text-xl text-white/60"
                >
                  {service.desc}
                </motion.p>

                {/* ── Toggle trigger ── */}
                <button
                  onClick={() => toggle(service.id)}
                  aria-expanded={isOpen}
                  className="group mt-12 flex cursor-pointer items-center gap-5"
                >
                  <span className="text-white/60 text-[10px] font-bold tracking-[0.35em] uppercase">
                    {isOpen ? "Close" : "Capabilities"}
                  </span>

                  {/* Animated connector line */}
                  <motion.span
                    className="bg-white/40 block h-[1px]"
                    animate={{ width: isOpen ? "72px" : "32px" }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <ToggleIcon isOpen={isOpen} />
                </button>

                {/* ── Expandable detail panel ── */}
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pt-12 pb-8"
                      >
                        {/* Animated divider line — draws left to right */}
                        <motion.div
                          className="bg-white/40/30 mb-10 h-[1px]"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />

                        {/* Expertise paragraph — full width */}
                        <motion.p
                          className="mb-10 max-w-2xl text-lg leading-relaxed text-white/60"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.08 }}
                        >
                          {service.expertise}
                        </motion.p>

                        {/* Two-column: capabilities list + slide-in image */}
                        <div className="flex flex-col items-start gap-12 lg:flex-row">
                          {/* Left: capabilities + stats */}
                          <div className="min-w-0 flex-1">
                            <div className="border-t border-current/10">
                              {service.capabilities.map((cap, j) => (
                                <CapabilityRow
                                  key={cap.label}
                                  cap={cap}
                                  index={j}
                                />
                              ))}
                            </div>

                            {/* Stats */}
                            <motion.div
                              className="mt-2 flex gap-16 pt-12"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.48, duration: 0.5 }}
                            >
                              {service.stats.map((stat) => (
                                <div key={stat.label}>
                                  <div className="massive-text text-white/60 text-5xl leading-none md:text-6xl">
                                    {stat.value}
                                  </div>
                                  <div className="mt-3 text-[10px] tracking-widest text-white/60 uppercase">
                                    {stat.label}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          </div>

                          {/* Right: image — wipe in from the right, image pans left simultaneously */}
                          <motion.div
                            className="w-full flex-shrink-0 overflow-hidden lg:w-[38%]"
                            initial={{ clipPath: "inset(0 100% 0 0)" }}
                            animate={{ clipPath: "inset(0 0% 0 0)" }}
                            transition={{
                              duration: 0.75,
                              delay: 0.18,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <motion.div
                              className="relative aspect-[3/4]"
                              initial={{ x: 48 }}
                              animate={{ x: 0 }}
                              transition={{
                                duration: 0.95,
                                delay: 0.12,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            >
                              <img
                                src={service.img}
                                alt={service.title}
                                loading="lazy"
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {/* Subtle neon tint overlay */}
                              <div className="bg-white/40/[0.06] pointer-events-none absolute inset-0 mix-blend-screen" />
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Section number watermark */}
              <div className="massive-text pointer-events-none absolute right-8 bottom-8 text-[20vw] font-black opacity-5 select-none">
                0{i + 1}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
