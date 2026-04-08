import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { AboutHero } from "../components/about-hero"
import { useSmoothScroll } from "../components/smooth-scroll"

// Splits text into sentences and blurs each in on scroll
const BlurInLines = ({
  text,
  className,
  align,
}: {
  text: string
  className?: string
  align?: string
}) => {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  return (
    <div className={className}>
      {sentences.map((sentence, i) => (
        <motion.p
          key={i}
          className={`mb-4 text-xl leading-loose font-light text-white/70 ${align ?? ""}`}
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 1,
            delay: i * 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {sentence}
        </motion.p>
      ))}
    </div>
  )
}

const values = [
  {
    label: "BUSINESS VALUE",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=600",
    offset: "mt-0",
    delay: 0,
    body: "We measure success in reservations, not impressions. Every campaign is built around a specific business objective — whether that's growing your weekday covers, launching a new concept, or repositioning your brand.",
  },
  {
    label: "CULTURE",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600",
    offset: "mt-20",
    delay: 0.1,
    body: "Culture isn't a backdrop — it's your product. We build content that makes people feel like they're already part of your world, translating your hospitality vision into storytelling that drives aspiration and belonging.",
  },
  {
    label: "DYNAMICS",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
    offset: "mt-10",
    delay: 0.2,
    body: "The market doesn't wait. Our in-house production model means we can turn a campaign concept around in days, not weeks — keeping your brand responsive to trends, seasons, and competitive shifts without losing cohesion.",
  },
  {
    label: "CREATIVITY",
    img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=600",
    offset: "mt-32",
    delay: 0.3,
    body: "Originality is what makes people stop scrolling. We develop visual identities and campaign narratives unique to each brand — never templated, never recycled. Every element is intentional and designed to make your brand unmistakable.",
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

const ValueCard = ({ value }: { value: (typeof values)[0] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const imgY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"])

  return (
    <motion.div
      ref={containerRef}
      className={`flex-1 ${value.offset} cursor-pointer text-left`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: value.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => setIsOpen((v) => !v)}
    >
      {/* Image with parallax */}
      <div className="relative aspect-2/3 w-full overflow-hidden">
        <motion.img
          src={value.img}
          alt={value.label}
          className="absolute inset-0 h-[130%] w-full object-cover will-change-transform [backface-visibility:hidden]"
          style={{ y: imgY, top: "-15%" }}
        />
        {/* Tag overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
            {value.label}
          </span>
        </div>
      </div>

      {/* Inline expand drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-xs leading-relaxed text-white/60">
              {value.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export const About = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  // Fade content in as the WHO WE ARE overlay exits (matches AboutHero's scrollDistance = 50vh)
  const heroEnd = typeof window !== "undefined" ? window.innerHeight * 0.5 : 0
  const contentOpacity = useTransform(activeY, [heroEnd - 10, heroEnd + 10], [0, 1])

  const wrapperTopRef = useRef(0)
  const scrollDistanceRef = useRef(0)

  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      }
      if (horizontalRef.current) {
        const leftOffset = window.innerWidth >= 768 ? 64 : 32
        const dist = Math.max(
          0,
          horizontalRef.current.scrollWidth - (window.innerWidth - leftOffset),
        )
        scrollDistanceRef.current = dist
        setScrollDistance(dist)
      }
    }
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

      <motion.div style={{ opacity: contentOpacity }} className="pt-[62vh]">
        {/* Three staggered paragraphs — line-by-line blur-in */}
        <div className="mb-12 px-8 md:px-16">
          <div className="flex justify-start">
            <BlurInLines
              className="about-glow-text max-w-sm"
              text="Social Satisfaction, founded by Devon Colebank, transforms hospitality and lifestyle brands through cultural storytelling. We blend nostalgia with modern innovation to create resonant identities that bridge the gap between trend-forward messaging and striking visuals."
            />
          </div>
          <div className="mt-32 flex justify-end">
            <BlurInLines
              className="about-glow-text max-w-sm text-right"
              text={
                "We replace \u201cshoot and share\u201d tactics with performance-driven campaigns. As an end-to-end partner, we manage everything from ideation to execution. This streamlined structure ensures every effort is intentional, cohesive, and designed to drive reservations."
              }
              align="text-right"
            />
          </div>
          <div className="mt-32 flex justify-center">
            <BlurInLines
              className="about-glow-text max-w-sm"
              text="By integrating strategy with internal production, we eliminate fragmented communication and multiple vendors. Every piece of content serves a business objective. The result is a consistent, optimized rollout that delivers measurable brand loyalty."
              align="text-center"
            />
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
            {/* Compact header */}
            <div className="flex-shrink-0 px-8 pt-40 pb-[3px] md:px-16">
              <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase">
                PORTFOLIO
              </h2>
              <h3 className="mt-1 text-3xl font-bold tracking-tight uppercase md:text-5xl">
                PAST PROJECTS & CLIENTS
              </h3>
            </div>
            {/* Scrolling cards */}
            <div className="ml-8 md:ml-16 flex flex-1 items-start pt-6 overflow-hidden">
              <motion.div
                ref={horizontalRef}
                style={{ x }}
                className="flex gap-24 pr-8 md:pr-16"
              >
                {timeline.map((item) => (
                  <div
                    key={item.client}
                    className="w-[85vw] flex-shrink-0 md:w-[45vw]"
                  >
                    <div>
                      <span className="text-sm font-bold tracking-widest text-white/60">
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
                      <p className="mt-6 text-xs font-bold tracking-widest text-white/60 uppercase">
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

        {/* Values Images — four staggered portrait images, click to expand text */}
        <div className="px-8 pt-16 pb-6 md:px-16 md:pt-24 md:pb-8">
          <div className="flex items-start gap-3 md:gap-5">
            {values.map((value) => (
              <ValueCard key={value.label} value={value} />
            ))}
          </div>
        </div>

        {/* Discover Our Services CTA */}
        <div className="flex justify-center py-12">
          <Link to="/services" className="btn-industrial">
            Discover Our Services
          </Link>
        </div>
      </motion.div>
    </>
  )
}
