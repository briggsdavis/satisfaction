import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { AboutHero } from "../components/about-hero"
import { AsymmetricalSection } from "../components/asymmetrical-section"
import { DeBlurText } from "../components/de-blur-text"
import { useSmoothScroll } from "../components/smooth-scroll"
import { ValuePropositions } from "./home"

export const About = () => {
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
        const dist = Math.max(
          0,
          horizontalRef.current.scrollWidth - window.innerWidth,
        )
        scrollDistanceRef.current = dist
        setScrollDistance(dist)
      }
    }

    // Double-RAF ensures the hero section above has finished setting its height
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

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

  return (
    <>
    <AboutHero />
    <div className="pt-24">
      {/* Three staggered paragraphs */}
      <div className="mb-32 px-8 md:px-16 lg:px-24">
        {/* Paragraph 1 — Left aligned */}
        <div className="flex justify-start">
          <DeBlurText as="p" noDisplay className="about-glow-text max-w-xs text-sm leading-relaxed text-white/70 font-light">
            Social Satisfaction, founded by Devon Colebank, transforms hospitality and lifestyle brands through cultural storytelling. We blend nostalgia with modern innovation to create resonant identities that bridge the gap between trend-forward messaging and striking visuals.
          </DeBlurText>
        </div>

        {/* Paragraph 2 — Right aligned, further down */}
        <div className="mt-32 flex justify-end">
          <DeBlurText as="p" noDisplay className="about-glow-text max-w-xs text-sm leading-relaxed text-white/70 font-light">
            We replace &ldquo;shoot and share&rdquo; tactics with performance-driven campaigns. As an end-to-end partner, we manage everything from ideation to execution. This streamlined structure ensures every effort is intentional, cohesive, and designed to drive reservations.
          </DeBlurText>
        </div>

        {/* Paragraph 3 — Center aligned, further down */}
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
          {/* Header stays visible throughout the horizontal scroll */}
          <div className="flex-shrink-0 border-b border-white/10 px-8 pb-6 pt-12">
            <h2 className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              PORTFOLIO
            </h2>
            <h3 className="mt-2 text-3xl font-bold tracking-tight uppercase md:text-5xl">
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
                <div
                  key={item.client}
                  className="w-[85vw] flex-shrink-0 md:w-[45vw]"
                >
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

      {/* Values Images — four staggered portrait images */}
      {(() => {
        const values = [
          {
            label: "BUSINESS VALUE",
            img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=600",
            offset: "mt-0",
            delay: 0,
          },
          {
            label: "CULTURE",
            img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600",
            offset: "mt-20",
            delay: 0.1,
          },
          {
            label: "DYNAMICS",
            img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
            offset: "mt-10",
            delay: 0.2,
          },
          {
            label: "CREATIVITY",
            img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=600",
            offset: "mt-32",
            delay: 0.3,
          },
        ]
        return (
          <div className="px-8 py-16 md:py-24">
            <div className="flex items-start gap-3 md:gap-5">
              {values.map(({ label, img, offset, delay }) => (
                <motion.div
                  key={label}
                  className={`flex-1 ${offset}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="aspect-[2/3] w-full overflow-hidden">
                    <img
                      src={img}
                      alt={label}
                      className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                    />
                  </div>
                  <p className="mt-3 text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )
      })()}

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200"
        title="Portrait Mastery"
        subtitle="Editorial Photography"
        align="right"
      />

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200"
        title="Cinematic Vision"
        subtitle="Documentary Film"
        align="left"
      />

      <ValuePropositions />
    </div>
    </>
  )
}
