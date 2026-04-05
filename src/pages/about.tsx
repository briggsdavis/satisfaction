import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { AboutHero } from "../components/about-hero"
import { DeBlurText } from "../components/de-blur-text"
import { useSmoothScroll } from "../components/smooth-scroll"

const values = [
  {
    label: "BUSINESS VALUE",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=600",
    offset: "mt-0",
    delay: 0,
    body: "We measure success in reservations, not impressions. Every campaign is built around a specific business objective — whether that's growing your weekday covers, launching a new concept, or repositioning your brand. Our integrated structure means fewer handoffs, lower overhead, and a direct throughline from strategy to deliverable.",
  },
  {
    label: "CULTURE",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600",
    offset: "mt-20",
    delay: 0.1,
    body: "Culture isn't a backdrop — it's your product. We build content that makes people feel like they're already part of your world, translating your hospitality vision into storytelling that drives aspiration and belonging. When your audience sees themselves in your brand, they come through the door.",
  },
  {
    label: "DYNAMICS",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
    offset: "mt-10",
    delay: 0.2,
    body: "The market doesn't wait. Our in-house production model means we can turn a campaign concept around in days, not weeks. We monitor performance in real time and adapt creative accordingly — keeping your brand responsive to trends, seasons, and competitive shifts without losing cohesion.",
  },
  {
    label: "CREATIVITY",
    img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=600",
    offset: "mt-32",
    delay: 0.3,
    body: "Originality is what makes people stop scrolling. We develop visual identities and campaign narratives unique to each brand — never templated, never recycled. From the tone of a caption to the light in a photograph, every element is intentional and designed to make your brand unmistakable.",
  },
]

const timeline = [
  {
    date: "FEB - 2021",
    client: "TRULY",
    campaign: '"THIS IS GOLD" CAMPAIGN',
    role: "DIGITAL CONTENT CREATOR LEAD",
    description:
      'Created and developed photo and video content for TRULY distribution in the Pittsburgh region. "#THISISGOLD" Introduces the New TRULY Iced Tea Hard Seltzer. Refreshing hard seltzer meets real brewed tea and fruit flavor for a drink that\'s liquid gold.',
  },
  {
    date: "OCT - 2020",
    client: "COORS SELTZER",
    campaign: "HALLOWEEN CAMPAIGN",
    role: "DIGITAL CONTENT CREATOR & EVENT COORDINATOR LEAD",
    description:
      "Created and developed photo and video content for COORS SELTZER distribution in the Greater Pittsburgh Area region leading and ongoing into the Halloween holiday season. Along with developing and creating ads, also planned and coordinated an event for their target audience in the area, that lead to product being pushed to over 40,000 people.",
  },
  {
    date: "2019 - 2020",
    client: "WINES OF AMERICA",
    campaign: null,
    role: "MARKETING DIRECTOR & CREATIVE DIRECTOR",
    description:
      "Lead and fulfilled the rebrand of a nationwide wine distribution company. Created a cohesive brand aesthetic across all social media platforms that helps enhance the brand's story. Oversaw the operation of a company's website or email marketing program and provide analytics review.",
  },
  {
    date: "2019 - PRESENT",
    client: "DOCHERTY:",
    campaign: "MODEL & TALENT AGENCY",
    role: "PHOTOGRAPHER",
    description:
      "Fashion photographer highlighting model and other clothing products in exciting and memorable ways. Worked closely with models and brands to conceptualize and shoot photos that showcase them as effectively as possible.",
  },
  {
    date: "2019 - 2020",
    client: "VANDALS CLOTHING CO.",
    campaign: null,
    role: "CONTENT CREATOR & DESIGNER",
    description:
      "Developed organic creative content for social media platforms and website. Designed and developed clothing graphics. Creative Direction with project ideas, collaborations, etc.",
  },
  {
    date: "2017 - PRESENT",
    client: "SOCIAL SATISFACTION",
    campaign: null,
    role: "FULL-SERVICE MARKETING AGENCY",
    description:
      "A full-service marketing agency delivering photography, videography, graphic design, creative direction, and brand strategy for businesses, entrepreneurs, artists, and advertising agencies.",
  },
]

export const About = () => {
  const [activeValue, setActiveValue] = useState<string | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const wrapperTopRef = useRef(0)
  const scrollDistanceRef = useRef(0)

  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      }
      if (horizontalRef.current) {
        const dist = Math.max(0, horizontalRef.current.scrollWidth - window.innerWidth)
        scrollDistanceRef.current = dist
        setScrollDistance(dist)
      }
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveValue(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = scrollDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const x = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = scrollDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return -D
    return -(y - T)
  })

  const activeValueData = values.find((v) => v.label === activeValue)

  return (
    <>
      <AboutHero />

      <div className="pt-24">
        {/* Three staggered paragraphs */}
        <div className="mb-32 px-8 md:px-16 lg:px-24">
          <div className="flex justify-start">
            <DeBlurText as="p" noDisplay className="about-glow-text max-w-xs text-sm leading-relaxed text-white/70 font-light">
              Social Satisfaction, founded by Devon Colebank, transforms hospitality and lifestyle brands through cultural storytelling. We blend nostalgia with modern innovation to create resonant identities that bridge the gap between trend-forward messaging and striking visuals.
            </DeBlurText>
          </div>
          <div className="mt-32 flex justify-end">
            <DeBlurText as="p" noDisplay className="about-glow-text max-w-xs text-sm leading-relaxed text-white/70 font-light">
              We replace &ldquo;shoot and share&rdquo; tactics with performance-driven campaigns. As an end-to-end partner, we manage everything from ideation to execution. This streamlined structure ensures every effort is intentional, cohesive, and designed to drive reservations.
            </DeBlurText>
          </div>
          <div className="mt-32 flex justify-center">
            <DeBlurText as="p" noDisplay className="about-glow-text max-w-xs text-sm leading-relaxed text-white/70 font-light text-center">
              By integrating strategy with internal production, we eliminate fragmented communication and multiple vendors. Every piece of content serves a business objective. The result is a consistent, optimized rollout that delivers measurable brand loyalty.
            </DeBlurText>
          </div>
        </div>

        {/* Portfolio Timeline — header pinned inside scrolling section */}
        <div
          ref={wrapperRef}
          className="relative"
          style={{ height: `calc(${scrollDistance}px + 100vh)` }}
        >
          <motion.div
            style={{ y: pinY }}
            className="flex h-screen flex-col overflow-hidden"
          >
            {/* Compact header — 50% less padding than before */}
            <div className="flex-shrink-0 border-b border-white/10 px-8 pt-6 pb-3">
              <h2 className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                PORTFOLIO
              </h2>
              <h3 className="mt-1 text-3xl font-bold tracking-tight uppercase md:text-5xl">
                PAST PROJECTS & CLIENTS
              </h3>
            </div>
            {/* Scrolling cards */}
            <div className="flex flex-1 items-center overflow-hidden">
              <motion.div
                ref={horizontalRef}
                style={{ x }}
                className="flex gap-24 px-8"
              >
                {timeline.map((item) => (
                  <div key={item.client} className="w-[85vw] flex-shrink-0 md:w-[45vw]">
                    <div className="border-white/20 border-l-2 pl-8">
                      <span className="text-white/60 text-sm font-bold tracking-widest">
                        {item.date}
                      </span>
                      <h4 className="massive-text mt-4 text-5xl font-black tracking-tight uppercase md:text-7xl">
                        {item.client}
                      </h4>
                      {item.campaign && (
                        <p className="mt-2 text-2xl font-bold tracking-tight uppercase md:text-3xl">
                          {item.campaign}
                        </p>
                      )}
                      <p className="text-white/60 mt-6 text-xs font-bold tracking-widest uppercase">
                        {item.role}
                      </p>
                      <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Values Images — four staggered portrait images, clickable to modal */}
        <div className="px-8 py-16 md:py-24">
          <div className="flex items-start gap-3 md:gap-5">
            {values.map(({ label, img, offset, delay }) => (
              <motion.button
                key={label}
                className={`flex-1 ${offset} cursor-pointer text-left`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActiveValue(label)}
              >
                <div className="aspect-[2/3] w-full overflow-hidden">
                  <img
                    src={img}
                    alt={label}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
                  {label}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Value modal */}
      <AnimatePresence>
        {activeValue && activeValueData && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveValue(null)}
            />
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="pointer-events-auto relative flex w-full max-w-2xl flex-col overflow-hidden bg-black border border-white/10 md:flex-row"
                initial={{ scale: 0.92, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 30 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image */}
                <div className="aspect-[3/2] w-full flex-shrink-0 overflow-hidden md:aspect-auto md:w-56">
                  <img
                    src={activeValueData.img}
                    alt={activeValueData.label}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-8">
                  <div>
                    <p className="mb-4 text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">
                      Our approach
                    </p>
                    <h3 className="massive-text mb-6 text-3xl text-white">{activeValueData.label}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{activeValueData.body}</p>
                  </div>
                  <button
                    className="mt-8 self-start text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase hover:text-white/60 transition-colors"
                    onClick={() => setActiveValue(null)}
                  >
                    Close ×
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
