import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { AboutHero } from "../components/about-hero"
import { useSmoothScroll } from "../components/smooth-scroll"
import { BrandsCarousel } from "./home/brands-carousel"
import { FeaturedCascade } from "./home/featured-cascade"

// ─── BlurInLines ─────────────────────────────────────────────────────────────
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

// ─── Values data + card ───────────────────────────────────────────────────────
const values = [
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

const timeline = [
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
    campaign: null,
    role: "DIGITAL & PHYSICAL TRANSFORMATION",
    description:
      "Executed end-to-end digital and physical transformations for hospitality clients including Yuzu Kitchen, Lilith, EYV, and Shorty's. Delivered website redesigns, SEO optimization, and social media management to increase foot traffic through cohesive storytelling.",
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
      className={`relative z-[2] flex-1 ${value.offset} cursor-pointer text-left`}
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
      <div className="relative aspect-2/3 w-full overflow-hidden">
        <motion.img
          src={value.img}
          alt={value.label}
          className="absolute inset-0 h-[130%] w-full object-cover will-change-transform [backface-visibility:hidden]"
          style={{ y: imgY, top: "-15%" }}
        />
        <div className="absolute bottom-3 left-3 z-10">
          <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
            {value.label}
          </span>
        </div>
      </div>
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

// ─── Wheel section ────────────────────────────────────────────────────────────
const WHEEL_PAIRS = [
  {
    number: "01",
    heading: "Who We Are",
    text: "Social Satisfaction, founded by Devon Colebank, transforms hospitality and lifestyle brands through cultural storytelling. We blend nostalgia with modern innovation to create resonant identities that bridge the gap between trend-forward messaging and striking visuals.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=900",
  },
  {
    number: "02",
    heading: "How We Work",
    text: "We replace 'shoot and share' tactics with performance-driven campaigns. As an end-to-end partner, we manage everything from ideation to execution. This streamlined structure ensures every effort is intentional, cohesive, and designed to drive reservations.",
    img: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=900",
  },
  {
    number: "03",
    heading: "What We Deliver",
    text: "By integrating strategy with internal production, we eliminate fragmented communication and multiple vendors. Every piece of content serves a business objective. The result is a consistent, optimized rollout that delivers measurable brand loyalty.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=900",
  },
]

// Individual wheel item — hooks called at component level (not in a loop)
const WheelPair = ({
  item,
  index,
  n,
  progress,
}: {
  item: (typeof WHEEL_PAIRS)[0]
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  // Sequential visibility: each section is fully invisible outside its range.
  // The boundary between item i and i+1 is the midpoint of their centers.
  // Item i fades out over [boundary - fade, boundary]; item i+1 fades in over
  // [boundary, boundary + fade] — so they are never simultaneously visible.
  const leftBound = index === 0 ? 0 : (2 * index - 1) / (2 * (n - 1))
  const rightBound = index === n - 1 ? 1 : (2 * index + 1) / (2 * (n - 1))
  const fade = 0.08
  const opacityInput =
    index === 0
      ? [0, Math.max(0, rightBound - fade), rightBound]
      : index === n - 1
        ? [leftBound, Math.min(1, leftBound + fade), 1]
        : [leftBound, leftBound + fade, rightBound - fade, rightBound]
  const opacityOutput =
    index === 0 ? [1, 1, 0] : index === n - 1 ? [0, 1, 1] : [0, 1, 1, 0]
  const opacity = useTransform(progress, opacityInput, opacityOutput)

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-8 pt-24 md:flex-row md:gap-16 md:px-16"
    >
      {/* Left: text — always left-aligned */}
      <div className="flex-1">
        <p className="mb-3 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
          {item.number}
        </p>
        <h3 className="massive-text mb-6 text-4xl leading-tight font-bold uppercase md:text-6xl lg:text-7xl">
          {item.heading}
        </h3>
        <p className="max-w-lg text-lg leading-relaxed font-light text-white/70">
          {item.text}
        </p>
      </div>

      {/* Right: image */}
      <div className="hidden w-[42%] shrink-0 md:block">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={item.img}
            alt={item.heading}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </motion.div>
  )
}

// Progress dots (right-side indicator)
const WheelDot = ({
  index,
  n,
  progress,
}: {
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  const center = n === 1 ? 0 : index / (n - 1)
  const dotOpacity = useTransform(
    progress,
    [Math.max(0, center - 0.3), center, Math.min(1, center + 0.3)],
    [0.25, 1, 0.25],
  )
  const dotScale = useTransform(
    progress,
    [Math.max(0, center - 0.3), center, Math.min(1, center + 0.3)],
    [0.7, 1.4, 0.7],
  )
  return (
    <motion.div
      className="h-1.5 w-1.5 rounded-full bg-white"
      style={{ opacity: dotOpacity, scale: dotScale }}
    />
  )
}

const WheelSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const wrapperTopRef = useRef(0)
  const pinDistRef = useRef(0)
  const [pinDist, setPinDist] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  useEffect(() => {
    const measure = () => {
      const dist = window.innerHeight * (WHEEL_PAIRS.length - 1)
      pinDistRef.current = dist
      setPinDist(dist)
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      }
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistRef.current
    if (D === 0 || y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const progress = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistRef.current
    if (D === 0 || y <= T) return 0
    if (y >= T + D) return 1
    return (y - T) / D
  })

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: `calc(${pinDist}px + 100vh)` }}
    >
      <motion.div style={{ y: pinY }} className="relative h-screen">
        {/* Right-side progress dots */}
        <div className="pointer-events-none absolute top-1/2 right-8 z-10 flex -translate-y-1/2 flex-col gap-3 md:right-16">
          {WHEEL_PAIRS.map((_, i) => (
            <WheelDot
              key={i}
              index={i}
              n={WHEEL_PAIRS.length}
              progress={progress}
            />
          ))}
        </div>

        <div className="h-full">
          {WHEEL_PAIRS.map((item, i) => (
            <WheelPair
              key={i}
              item={item}
              index={i}
              n={WHEEL_PAIRS.length}
              progress={progress}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ─── About page ───────────────────────────────────────────────────────────────
export const About = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const heroEnd = typeof window !== "undefined" ? window.innerHeight * 0.5 : 0
  const contentOpacity = useTransform(
    activeY,
    [
      heroEnd,
      heroEnd +
        (typeof window !== "undefined" ? window.innerHeight * 0.3 : 300),
    ],
    [0, 1],
  )

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
    // Initial measurement
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    // Re-measure whenever the document height changes — this fires after child
    // components (e.g. WheelSection) setState and re-render, so wrapperTopRef
    // always reflects the true post-layout position of the timeline wrapper.
    const ro = new ResizeObserver(() => requestAnimationFrame(measure))
    ro.observe(document.documentElement)
    return () => {
      window.removeEventListener("resize", measure)
      ro.disconnect()
    }
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

  // Progress for the timeline indicator line (0 → 1)
  const timelineProgress = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = scrollDistanceRef.current
    if (D === 0 || y <= T) return 0
    if (y >= T + D) return 1
    return (y - T) / D
  })

  return (
    <>
      <AboutHero />

      {/* Decorative column lines */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className={`column-line${i % 2 !== 0 ? " hidden md:block" : ""}`}
          style={{
            left: `${(100 / 6) * i}%`,
            opacity: contentOpacity,
            ...({ ["--sweep-delay"]: `${i * 0.75}s` } as React.CSSProperties),
          }}
        />
      ))}

      <motion.div style={{ opacity: contentOpacity }} className="pt-[62vh]">
        {/* ── Wheel section (new) ───────────────────────────────────────── */}
        <WheelSection />

        {/* ── Three staggered paragraphs ────────────────────────────────── */}
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
              text="We replace \u201cshoot and share\u201d tactics with performance-driven campaigns. As an end-to-end partner, we manage everything from ideation to execution. This streamlined structure ensures every effort is intentional, cohesive, and designed to drive reservations."
              align="text-right"
            />
          </div>
          <div className="mt-32 flex justify-start">
            <BlurInLines
              className="about-glow-text max-w-sm"
              text="By integrating strategy with internal production, we eliminate fragmented communication and multiple vendors. Every piece of content serves a business objective. The result is a consistent, optimized rollout that delivers measurable brand loyalty."
            />
          </div>
        </div>

        {/* ── Portfolio Timeline ────────────────────────────────────────── */}
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
              <h3 className="mt-1 font-display text-3xl font-bold tracking-tight uppercase md:text-5xl">
                PAST PROJECTS &amp; CLIENTS
              </h3>
            </div>

            {/* Progress bar */}
            <div className="relative mx-8 mt-5 mb-1 h-[3px] bg-white/10 md:mx-16">
              <motion.div
                className="absolute inset-y-0 left-0 h-full w-full bg-white/70"
                style={{
                  scaleX: timelineProgress,
                  transformOrigin: "left center",
                }}
              />
            </div>

            {/* Scrolling cards */}
            <div className="ml-8 flex flex-1 items-start overflow-hidden pt-5 md:ml-16">
              <motion.div
                ref={horizontalRef}
                style={{ x }}
                className="flex gap-24 pr-8 md:pr-16"
              >
                {timeline.map((item) => (
                  <div
                    key={item.date + "-" + item.client}
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
                      {item.description && (
                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Values Images ─────────────────────────────────────────────── */}
        <div className="px-8 pt-[54px] pb-6 md:px-16 md:pt-[82px] md:pb-8">
          <div className="flex items-start gap-3 md:gap-5">
            {values.map((value) => (
              <ValueCard key={value.label} value={value} />
            ))}
          </div>
        </div>

        {/* ── Discover CTA ──────────────────────────────────────────────── */}
        <div className="flex justify-center py-12">
          <Link to="/services" className="btn-industrial">
            Discover Our Services
          </Link>
        </div>

        {/* ── Brands carousel ───────────────────────────────────────────── */}
        <BrandsCarousel />

        {/* ── Featured projects ─────────────────────────────────────────── */}
        <FeaturedCascade />
      </motion.div>
    </>
  )
}
