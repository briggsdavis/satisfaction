import {
  motion,
  MotionValue,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { useSmoothScroll } from "../components/smooth-scroll"
import { TextReveal } from "../components/text-reveal"

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const Hero = () => {
  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY
  const y = useTransform(activeY, [0, 1000], [0, 120])
  const bgY = useTransform(activeY, [0, 1000], [0, 200])

  return (
    <section className="relative flex h-screen flex-col overflow-hidden bg-black">
      {/* Background hero image with parallax */}
      <div className="absolute inset-0 z-0">
        <motion.div
          style={{ y: bgY }}
          className="h-[120%] w-full bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-25 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
      </div>

      {/* Top metadata bar — in document flow so it never overlaps */}
      <div className="relative z-10 flex items-start justify-between px-8 pt-28 pb-4">
        <div className="text-[9px] font-bold tracking-[0.35em] text-white/30 uppercase leading-relaxed">
          Creative Director<br />Brand Strategist
        </div>
        <div className="text-[9px] font-bold tracking-[0.35em] text-white/30 uppercase leading-relaxed text-right">
          Devon Colebank<br />Pittsburgh, PA
        </div>
      </div>

      {/* Flex spacer pushes headline to bottom */}
      <div className="flex-1" />

      {/* Main stacked headline */}
      <motion.div style={{ y }} className="relative z-10">
        <div className="border-t border-white/20 px-6 py-2 md:px-8">
          <TextReveal
            text="DEVON"
            className="massive-text text-[22vw] leading-none md:text-[18vw]"
          />
        </div>

        <div className="border-t border-white/20 px-8 py-2 flex items-center gap-6">
          <span className="font-display text-[4vw] text-white/40 leading-none">↓</span>
          <span className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">
            Creative Director & Brand Strategist
          </span>
        </div>

        <div className="border-t border-white/20 px-6 py-2 md:px-8">
          <TextReveal
            text="COLEBANK"
            className="massive-text text-[22vw] leading-none md:text-[18vw]"
            delay={0.3}
          />
        </div>

        <div className="border-t border-white/20" />
      </motion.div>

      {/* Bottom metadata */}
      <div className="relative z-10 flex items-center justify-between px-8 py-4 border-t border-white/10">
        <span className="text-[9px] font-bold tracking-[0.35em] text-white/20 uppercase">
          Est. 2017
        </span>
        <span className="text-[9px] font-bold tracking-[0.35em] text-white/20 uppercase">
          Scroll ↓
        </span>
      </div>
    </section>
  )
}

// ─── Word Statement (screenshot 1 — stacked words + dividers) ────────────────
const STATEMENT_WORDS = ["SEVEN", "YEARS", "ONE", "GOAL."]

export const WordStatement = () => (
  <section className="border-t border-white/10 bg-black overflow-hidden">
    {STATEMENT_WORDS.map((word, i) => {
      const isRight = i % 2 === 1
      return (
        <motion.div
          key={word}
          className={`border-b border-white/20 px-6 flex items-end ${isRight ? "justify-end" : "justify-start"}`}
          initial={{ opacity: 0, x: isRight ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="massive-text text-[18vw] leading-[0.88] select-none">
            {word}
          </span>
        </motion.div>
      )
    })}

    {/* Bottom metadata row — mimics the reference exactly */}
    <div className="flex items-start justify-between px-6 py-4">
      <div className="font-mono text-[8px] font-bold tracking-widest text-white/20 uppercase leading-snug">
        <span>2017·2018·2019·2020·2021·2022·2023·2024</span>
        <br />
        <span>Pittsburgh, PA</span>
      </div>
      <div className="text-right font-mono text-[8px] font-bold tracking-widest text-white/20 uppercase leading-snug">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="block">Seven Years. One Goal.</span>
        ))}
      </div>
    </div>
  </section>
)

// ─── Circle Statement (screenshot 2 — rotating ring + central text) ──────────
const CIRCLE_RING_TEXT =
  "Creative Direction · Brand Strategy · Videography · Photography · Graphic Design · "

export const CircleStatement = () => (
  <section className="flex items-center justify-center border-t border-white/10 bg-black py-32 px-4">
    <div className="relative" style={{ width: "min(640px, 92vw)", height: "min(640px, 92vw)" }}>
      {/* Rotating ring text via SVG */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 640 640"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="ring-path"
            d="M 320 320 m -275 0 a 275 275 0 1 1 550 0 a 275 275 0 1 1 -550 0"
          />
        </defs>
        <text
          fill="white"
          fontSize="11.5"
          letterSpacing="4"
          fontFamily="Inter Variable, Inter, sans-serif"
          fontWeight="700"
          style={{ textTransform: "uppercase" }}
        >
          <textPath href="#ring-path">
            {(CIRCLE_RING_TEXT).repeat(4)}
          </textPath>
        </text>
      </motion.svg>

      {/* Static circle border */}
      <div className="absolute inset-[6%] rounded-full border border-white/8" />

      {/* Top + bottom cross markers */}
      <span className="absolute top-[8%] left-1/2 -translate-x-1/2 text-white/25 text-xs select-none">+</span>
      <span className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-white/25 text-xs select-none">+</span>

      {/* Small satellite labels */}
      <div className="absolute top-[22%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <span className="font-mono text-[8px] font-bold tracking-[0.3em] text-white/25 uppercase">Devon Colebank</span>
        <span className="massive-text block text-sm leading-none mt-1">FEEL?</span>
      </div>
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <span className="massive-text block text-sm leading-none mb-1">FEEL?</span>
        <span className="font-mono text-[8px] font-bold tracking-[0.3em] text-white/25 uppercase">Pittsburgh, PA</span>
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-16">
        <span className="text-white/20 text-[10px] leading-none">◆</span>
        <TextReveal
          text="WHAT DO YOU WANT PEOPLE TO FEEL?"
          className="massive-text text-[4.5vw] leading-[0.95] md:text-[3vw]"
        />
        <span className="text-white/20 text-[10px] leading-none">◆</span>
      </div>
    </div>
  </section>
)

// ─── Scattered Statement (screenshots 3 & 4 — massive words + floating debris) ─
export const ScatteredStatement = () => (
  <section className="relative overflow-hidden border-t border-white/10 bg-black">

    {/* ── ROW A: "BUILD" ── */}
    <div className="relative border-b border-white/15 px-6 pt-6 pb-0">
      {/* top-right stacked metadata */}
      <div className="absolute right-6 top-6 text-right pointer-events-none z-10">
        <span className="font-mono text-[8px] font-bold tracking-widest text-white/20 uppercase leading-relaxed block">
          Build to last<br />Build to last
        </span>
      </div>
      <TextReveal text="BUILD" className="massive-text text-[22vw] leading-[0.88]" />
    </div>

    {/* ── MIDDLE DEBRIS ZONE A ── */}
    <div className="relative min-h-[28vw] border-b border-white/10">
      {/* top-left small labels */}
      <div className="absolute left-6 top-5 flex gap-5 pointer-events-none">
        <span className="font-mono text-[8px] font-bold tracking-widest text-white/18 uppercase">NO</span>
        <span className="font-mono text-[8px] font-bold tracking-widest text-white/18 uppercase">NO</span>
      </div>
      <span className="absolute right-[8%] top-5 font-mono text-[8px] font-bold tracking-widest text-white/18 uppercase pointer-events-none">NO</span>

      {/* "BOLD." floating top-right */}
      <span className="massive-text absolute right-6 top-8 text-[4vw] leading-none text-white/85 pointer-events-none">BOLD.</span>

      {/* Center: "Build with intention." + smiley */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[11px] font-bold tracking-[0.3em] text-white/50 uppercase block">
          Build with intention.
        </span>
        <span className="mt-2 block text-white/30 text-lg">☺</span>
      </div>

      {/* "← ←" arrows — left-centre */}
      <div className="absolute left-[36%] bottom-5 flex gap-3 pointer-events-none">
        <span className="font-mono text-xl text-white/55">←</span>
        <span className="font-mono text-xl text-white/55">←</span>
      </div>

      {/* Bottom-right: "Devon Colebank / NO SHORTCUTS. / Devon Colebank" */}
      <div className="absolute right-6 bottom-5 text-right pointer-events-none">
        <span className="font-mono text-[8px] font-bold tracking-widest text-white/25 uppercase block">Devon Colebank</span>
        <span className="font-mono text-[12px] font-bold tracking-[0.2em] text-white/55 uppercase block mt-1">NO SHORTCUTS.</span>
        <span className="font-mono text-[8px] font-bold tracking-widest text-white/25 uppercase block mt-1">Devon Colebank</span>
      </div>

      {/* Bottom-left: "NO STORY" */}
      <span className="absolute bottom-5 left-6 font-mono text-[11px] font-bold tracking-[0.3em] text-white/40 uppercase pointer-events-none">
        NO STORY
      </span>
    </div>

    {/* ── ROW B: "WITH" ── */}
    <div className="border-b border-white/15 px-6 pb-0 pt-0">
      <TextReveal text="WITH" className="massive-text text-[22vw] leading-[0.88]" delay={0.1} />
    </div>

    {/* ── MIDDLE DEBRIS ZONE B ── */}
    <div className="relative min-h-[22vw] border-b border-white/10">
      {/* "← ←" arrows — centre */}
      <div className="absolute left-[38%] top-1/2 -translate-y-1/2 flex gap-3 pointer-events-none">
        <span className="font-mono text-xl text-white/50">←</span>
        <span className="font-mono text-xl text-white/50">←</span>
      </div>

      {/* top-right: "Devon Colebank" */}
      <span className="absolute right-6 top-5 font-mono text-[8px] font-bold tracking-widest text-white/25 uppercase pointer-events-none">
        Devon Colebank
      </span>

      {/* "NO RISK." */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-right pointer-events-none">
        <span className="font-mono text-[14px] font-bold tracking-[0.2em] text-white/55 uppercase block">NO RISK.</span>
        <span className="font-mono text-[8px] font-bold tracking-widest text-white/25 uppercase block mt-1">Devon Colebank</span>
      </div>

      {/* "NO LIMITS." — bottom-left */}
      <span className="absolute bottom-5 left-6 font-mono text-[11px] font-bold tracking-[0.3em] text-white/40 uppercase pointer-events-none">
        NO LIMITS.
      </span>
    </div>

    {/* ── ROW C: "PURPOSE." ── */}
    <div className="px-6 pb-8 pt-0">
      <TextReveal text="PURPOSE." className="massive-text text-[16vw] leading-[0.88]" delay={0.2} />
    </div>
  </section>
)

// ─── Marquee ticker ────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "Creative Direction",
  "—",
  "Brand Strategy",
  "—",
  "Videography",
  "—",
  "Photography",
  "—",
  "Graphic Design",
  "—",
  "Pittsburgh, PA",
  "—",
]

export const Ticker = () => (
  <div className="border-t border-b border-white/10 overflow-hidden py-3">
    <div className="marquee-track">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span
          key={i}
          className="mx-6 text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase whitespace-nowrap"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
)

// ─── Word-by-word scroll reveal ───────────────────────────────────────────────
const wordVariant = {
  hidden: { y: "115%" },
  visible: {
    y: "0%",
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const WordReveal = ({
  text,
  className,
  startDelay = 0,
}: {
  text: string
  className?: string
  startDelay?: number
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.028, delayChildren: startDelay },
    },
  }

  return (
    <motion.p
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="mr-[0.3em] inline-block overflow-hidden">
          <motion.span className="inline-block" variants={wordVariant}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  )
}

// ─── Intro Text ───────────────────────────────────────────────────────────────
export const IntroText = () => {
  const para1 =
    "Creative direction, brand identity, and commercial production for the brands and people that shape culture. Seven years of building visual systems that command attention and drive results."
  const para2 =
    "Based in Pittsburgh, Pennsylvania, I work at the intersection of videography, photography, and graphic design. From Coors Light to Red Bull to Maker's Mark, every project starts with one question: what do you want people to feel?"

  return (
    <section className="border-t border-white/10 px-8 py-48 md:px-24">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="overflow-hidden">
          <motion.span
            className="block text-[9px] font-bold tracking-[0.4em] text-white/40 uppercase"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            The Philosophy
          </motion.span>
        </div>

        <WordReveal
          text={para1}
          className="text-3xl leading-[1.35] font-light md:text-4xl lg:text-[2.6rem]"
          startDelay={0.05}
        />

        <WordReveal
          text={para2}
          className="max-w-3xl text-lg leading-relaxed font-light text-white/50"
          startDelay={0.12}
        />
      </div>
    </section>
  )
}

// ─── Featured Projects ────────────────────────────────────────────────────────
const FEATURED = [
  {
    title: "Kinetic Light",
    tags: ["Photography", "Landscape"],
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
    align: "left" as const,
    widthClass: "md:w-3/5",
  },
  {
    title: "Frame Study",
    tags: ["Videography", "Commercial"],
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
    align: "right" as const,
    widthClass: "md:w-[58%]",
  },
  {
    title: "Signal & Form",
    tags: ["Graphic Design", "Branding"],
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    align: "left" as const,
    widthClass: "md:w-1/2",
  },
]

const FeaturedProjectCard = ({
  project,
}: {
  project: (typeof FEATURED)[0]
}) => {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const isRight = project.align === "right"

  return (
    <section
      ref={ref}
      className="border-t border-white/10 px-8 py-32 md:px-16"
    >
      <div
        className={`mx-auto flex max-w-7xl flex-col items-center gap-12 ${
          isRight ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden ${project.widthClass}`}
        >
          <motion.img
            style={{ y: imgY, height: "calc(100% + 160px)", top: "-80px" }}
            src={project.img}
            alt={project.title}
            loading="lazy"
            className="absolute w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Text */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border border-white/30 px-3 py-1 text-[10px] font-bold tracking-[0.35em] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
          <TextReveal
            text={project.title}
            className="massive-text text-5xl md:text-7xl"
          />
          <p className="max-w-xs text-base leading-relaxed text-white/50">
            A focused exploration of form, light, and intention. Crafted with
            precision and purpose.
          </p>
          <Link to="/portfolio" className="btn-industrial mt-2 inline-flex items-center gap-3">
            View Project <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export const FeaturedProjects = () => {
  return (
    <section>
      <div className="border-t border-white/10 px-8 pt-32 pb-0 md:px-16">
        {/* Stacked heading with dividers */}
        <div className="border-b border-white/10 pb-2">
          <TextReveal text="Featured" className="massive-text text-[9vw]" />
        </div>
        <div className="border-b border-white/10 pb-2 pt-2">
          <TextReveal
            text="Projects"
            className="massive-text text-[9vw]"
            delay={0.15}
          />
        </div>
        <div className="pt-2 pb-8">
          <span className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">
            Selected Work
          </span>
        </div>
      </div>

      {FEATURED.map((project) => (
        <FeaturedProjectCard key={project.title} project={project} />
      ))}

      <div className="flex justify-center border-t border-white/10 py-24">
        <Link to="/portfolio" className="btn-industrial">
          See Portfolio
        </Link>
      </div>
    </section>
  )
}

// ─── Value Propositions (Pinned Scroll) ───────────────────────────────────────
const UVP_DATA = [
  {
    title: "Storytelling Through Light",
    text: "Every frame is a deliberate act. From music videos for local artists to national campaigns for Coors Light and Red Bull, Devon turns moments into cinematic statements.",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Brand, Built to Last",
    text: "Great design outlives trends. Devon builds visual identities rooted in strategy, executed with craft, and designed to grow alongside the brands that wear them.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Motion That Moves People",
    text: "Video is connection. From concept to color grade, Devon directs and produces film that carries the full weight of a story worth telling.",
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
  },
]

const UVPPanel = ({
  uvp,
  index,
  total,
  progress,
}: {
  uvp: (typeof UVP_DATA)[0]
  index: number
  total: number
  progress: MotionValue<number>
}) => {
  const crossWidth = 0.13

  const fadeInStart = index === 0 ? 0 : index / total - crossWidth + 0.01
  const fadeInEnd = index === 0 ? 0.01 : index / total
  const fadeOutStart =
    index === total - 1 ? 0.99 : (index + 1) / total - crossWidth
  const fadeOutEnd = index === total - 1 ? 1 : (index + 1) / total

  const opProgress = [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]
  const opValues =
    index === 0
      ? [1, 1, 1, 0]
      : index === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0]

  const opacity = useTransform(progress, opProgress, opValues)

  const imgStartX = index === 0 ? "0%" : index % 2 === 0 ? "-5%" : "5%"
  const imgX = useTransform(
    progress,
    [fadeInStart, fadeInEnd],
    [imgStartX, "0%"],
  )
  const textStartY = index === 0 ? "0px" : "28px"
  const textY = useTransform(
    progress,
    [fadeInStart, fadeInEnd],
    [textStartY, "0px"],
  )

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full flex-col md:flex-row"
    >
      {/* Image */}
      <div className="relative h-1/2 w-full overflow-hidden md:h-full md:w-1/2">
        <motion.img
          style={{ x: imgX }}
          src={uvp.img}
          alt={uvp.title}
          className="h-full w-full scale-105 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Text */}
      <motion.div
        style={{ y: textY }}
        className="flex h-1/2 w-full flex-col justify-center space-y-4 px-6 md:h-full md:w-1/2 md:space-y-6 md:px-16"
      >
        <span className="text-[9px] font-bold tracking-[0.4em] text-white/40 uppercase">
          0{index + 1} / 0{total}
        </span>
        <TextReveal
          text={uvp.title}
          className="massive-text text-4xl md:text-5xl lg:text-6xl"
        />
        <p className="max-w-md text-lg leading-relaxed text-white/50">
          {uvp.text}
        </p>
      </motion.div>
    </motion.div>
  )
}

export const ValuePropositions = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [pinDistance, setPinDistance] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const wrapperTopRef = useRef(0)
  const pinDistanceRef = useRef(0)

  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      const dist = (UVP_DATA.length - 1) * window.innerHeight
      pinDistanceRef.current = dist
      setPinDistance(dist)
    }
    requestAnimationFrame(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const progress = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return 1
    return (y - T) / D
  })

  return (
    <div
      ref={wrapperRef}
      style={{ height: `calc(${pinDistance}px + 100vh)` }}
      className="relative border-t border-white/10"
    >
      <motion.div
        style={{ y: pinY }}
        className="relative h-screen overflow-hidden"
      >
        {UVP_DATA.map((uvp, i) => (
          <UVPPanel
            key={uvp.title}
            uvp={uvp}
            index={i}
            total={UVP_DATA.length}
            progress={progress}
          />
        ))}
      </motion.div>
    </div>
  )
}

// ─── Service Trinity ──────────────────────────────────────────────────────────
const SERVICE_CARDS = [
  {
    title: "Videography",
    description: "Brand films, event coverage, and commercial production.",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    offsetClass: "",
  },
  {
    title: "Photography",
    description: "Editorial, commercial, and event photography.",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    offsetClass: "md:mt-32",
  },
  {
    title: "Graphic Design",
    description: "Brand identity systems and creative direction.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    offsetClass: "md:mt-64",
  },
]

const ServiceCard = ({
  service,
  index,
}: {
  service: (typeof SERVICE_CARDS)[0]
  index: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <motion.div
      ref={ref}
      className={`group min-w-0 flex-1 ${service.offsetClass}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
    >
      <div className="relative mb-8 aspect-[3/4] overflow-hidden">
        <motion.img
          style={{ y: imgY, height: "calc(100% + 60px)", top: "-30px" }}
          src={service.img}
          alt={service.title}
          loading="lazy"
          className="absolute w-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/10" />
      </div>
      <TextReveal
        text={service.title}
        className="massive-text mb-3 text-4xl md:text-5xl"
      />
      <p className="text-sm leading-relaxed text-white/50">
        {service.description}
      </p>
    </motion.div>
  )
}

export const ServiceTrinity = () => {
  return (
    <section className="border-t border-white/10 px-8 py-32 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <div className="border-b border-white/10 pb-2">
            <TextReveal text="Services" className="massive-text text-[13vw]" />
          </div>
          <div className="pt-2 pb-16">
            <span className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">
              What I Do
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-10 md:flex-row md:gap-12">
          {SERVICE_CARDS.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        <div className="mt-32 flex justify-center md:mt-56">
          <Link to="/services" className="btn-industrial">
            Discover More
          </Link>
        </div>
      </div>
    </section>
  )
}
