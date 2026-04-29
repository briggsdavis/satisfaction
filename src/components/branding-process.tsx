import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { useSmoothScroll } from "./smooth-scroll"

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Analysis",
    body: "We analyze your brand to identify the core message and set the direction for everything that follows.",
    side: "left" as const,
    cx: 250,
    cy: 600,
  },
  {
    num: "02",
    title: "Concept",
    body: "We craft unique creative concepts and bring them to life with mood boards and visual references.",
    side: "right" as const,
    cx: 750,
    cy: 1200,
  },
  {
    num: "03",
    title: "Visuals & Mockups",
    body: "We build out the look — logos, type, color, and real-world mockups so you can see the brand alive.",
    side: "left" as const,
    cx: 250,
    cy: 1800,
  },
  {
    num: "04",
    title: "Budgeting",
    body: "We map scope to budget — clear deliverables, no surprises, every dollar tied to outcomes.",
    side: "right" as const,
    cx: 750,
    cy: 2400,
  },
  {
    num: "05",
    title: "Planning & Organization",
    body: "We sequence the rollout — milestones, asset handoffs, and timelines built around your launch.",
    side: "left" as const,
    cx: 250,
    cy: 3000,
  },
  {
    num: "06",
    title: "Satisfaction Insured",
    body: "Revisions, polish, and a guarantee that you'll walk away with a brand you're proud to put your name on.",
    side: "right" as const,
    cx: 750,
    cy: 3600,
  },
]

// ─── Path ─────────────────────────────────────────────────────────────────────
// Each turn sits at the Y-midpoint between adjacent steps, at x=75 (left) or
// x=925 (right). Both the incoming and outgoing control points share the same
// x-coordinate as the turn endpoint, giving a purely-vertical tangent there.
// That makes the leftmost/rightmost extent of each C-curve land exactly on the
// turn node — no micro-jog before the sweep, no visible kink.
// All segment junctions are G1-continuous: each cp1 is the reflection of the
// previous segment's cp2 across the shared endpoint.
const PATH_D = [
  "M 500 0",
  "C 600 100, 850 150, 750 350",
  "C 650 550, 400 500, 250 600",      // → Step 1 (left)
  "C 100 700, 75 800, 75 900",        // approach left turn  (vertical tangent at 75,900)
  "C 75 1000, 600 1100, 750 1200",    // → Step 2 (right)
  "C 900 1300, 925 1400, 925 1500",   // approach right turn (vertical tangent at 925,1500)
  "C 925 1600, 400 1700, 250 1800",   // → Step 3 (left)
  "C 100 1900, 75 2000, 75 2100",     // approach left turn  (vertical tangent at 75,2100)
  "C 75 2200, 600 2300, 750 2400",    // → Step 4 (right)
  "C 900 2500, 925 2600, 925 2700",   // approach right turn (vertical tangent at 925,2700)
  "C 925 2800, 400 2900, 250 3000",   // → Step 5 (left)
  "C 100 3100, 75 3200, 75 3300",     // approach left turn  (vertical tangent at 75,3300)
  "C 75 3400, 600 3500, 750 3600",    // → Step 6 (right)
  "C 900 3700, 700 3850, 500 3950",   // end at center
].join(" ")

// SVG viewBox height — used for Y→pathFraction mapping
const SVG_H = 4000

// ─── Step text — fades in as scroll passes its checkpoint ─────────────────────
const StepText = ({
  step,
  progress,
  index,
  total,
}: {
  step: (typeof STEPS)[0]
  progress: import("motion/react").MotionValue<number>
  index: number
  total: number
}) => {
  const center = (index + 1) / (total + 1)
  const fadeIn = Math.max(0, center - 0.06)
  const peak = center + 0.02

  const opacity = useTransform(progress, [fadeIn, peak], [0, 1])
  const y = useTransform(progress, [fadeIn, peak], [24, 0])
  const blur = useTransform(progress, [fadeIn, peak], [12, 0])
  const filter = useTransform(blur, (b: number) => `blur(${b}px)`)

  const topPct = (step.cy / SVG_H) * 100

  const sideClasses =
    step.side === "left"
      ? "left-[5%] right-[55%] text-right items-end"
      : "left-[55%] right-[5%] text-left items-start"

  return (
    <motion.div
      style={{ opacity, y, filter, top: `${topPct}%` }}
      className={`pointer-events-none absolute flex flex-col gap-2 ${sideClasses} -translate-y-1/2`}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-display text-sm tracking-[0.3em] text-white/40 italic">
          {step.num}.
        </span>
        <span className="h-2 w-2 rounded-full bg-white/80" />
      </div>
      <h3 className="font-display text-3xl leading-[0.95] font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
        {step.title.toLowerCase()}
      </h3>
      <p className="max-w-xs text-sm leading-relaxed text-white/55 md:text-base">
        {step.body}
      </p>
    </motion.div>
  )
}

// ─── Branding Process Section ─────────────────────────────────────────────────
export const BrandingProcess = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const sectionTopRef = useRef(0)
  const sectionHeightRef = useRef(1)
  const [pathLengthPx, setPathLengthPx] = useState(0)
  const pathRef = useRef<SVGPathElement>(null)

  // Lookup table: maps SVG Y coordinate → normalized path fraction (0–1).
  // Built once after the path mounts so that pathLength can track the viewport
  // center precisely regardless of how unevenly path length is distributed in Y.
  const yToFractionRef = useRef<{ y: number; t: number }[]>([])

  // Ref to the <rect> inside the glow clipPath — updated imperatively on every
  // scroll frame so the glow only covers the path near the current tip.
  const clipRectRef = useRef<SVGRectElement>(null)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  useEffect(() => {
    const measure = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        sectionTopRef.current = rect.top + (smoothY?.get() ?? 0)
        sectionHeightRef.current = rect.height
      }
      if (pathRef.current) {
        const totalLen = pathRef.current.getTotalLength()
        setPathLengthPx(totalLen)

        // Sample the path at N evenly-spaced arc-length positions and record
        // each sample's SVG Y coordinate.  Used by the pathLength transform.
        const N = 400
        const lut: { y: number; t: number }[] = []
        for (let i = 0; i <= N; i++) {
          const t = i / N
          const pt = pathRef.current.getPointAtLength(t * totalLen)
          lut.push({ y: pt.y, t })
        }
        yToFractionRef.current = lut
      }
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  const progress = useTransform(activeY, (y: number) => {
    const T = sectionTopRef.current
    const H = sectionHeightRef.current
    const vh = window.innerHeight
    const start = T - vh * 0.5
    const end = T + H - vh * 0.5
    const range = end - start
    if (range <= 0) return 0
    return Math.max(0, Math.min(1, (y - start) / range))
  })

  // Convert scroll progress (linear in Y) → path fraction using the LUT.
  // This keeps the drawn tip anchored to the viewport center even though path
  // length is not uniformly distributed along the SVG's Y axis.
  const pathLength = useTransform(progress, (p: number) => {
    const lut = yToFractionRef.current
    if (lut.length === 0) return p
    const targetY = p * SVG_H
    let lo = 0,
      hi = lut.length - 1
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1
      if (lut[mid].y <= targetY) lo = mid
      else hi = mid
    }
    const { y: y0, t: t0 } = lut[lo]
    const { y: y1, t: t1 } = lut[lo + 1] ?? lut[lo]
    if (y1 <= y0) return t0
    return Math.max(0, Math.min(1, t0 + ((t1 - t0) * (targetY - y0)) / (y1 - y0)))
  })

  // Keep the glow clip window in sync with the line tip on every scroll frame.
  // The window extends ~1.5× viewport-heights above the tip so that the glowing
  // portion of the path is always visible inside the viewport, no matter how far
  // the user has scrolled into the section.
  useEffect(() => {
    const update = (p: number) => {
      if (!clipRectRef.current) return
      const tipY = p * SVG_H
      // ~1 400 SVG units ≈ 1.5 viewport heights (section = 420vh, SVG = 4000 u)
      const top = Math.max(0, tipY - 1400)
      const bottom = Math.min(SVG_H, tipY + 200)
      clipRectRef.current.setAttribute("y", String(top))
      clipRectRef.current.setAttribute("height", String(Math.max(0, bottom - top)))
    }
    update(progress.get())
    return progress.on("change", update)
  }, [progress])

  const strokeColor = useTransform(
    progress,
    [0, 0.15, 1],
    ["rgba(255,255,255,0.5)", "rgba(180,210,255,0.85)", "rgba(180,210,255,0.95)"],
  )

  const ctaOpacity = useTransform(progress, [0.92, 0.97], [0, 1])
  const ctaY = useTransform(progress, [0.92, 0.97], [40, 0])
  const ctaBlur = useTransform(progress, [0.92, 0.97], [16, 0])
  const ctaFilter = useTransform(ctaBlur, (b: number) => `blur(${b}px)`)
  const ctaScale = useTransform(progress, [0.92, 0.98], [0.92, 1])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-white/10 bg-black"
      style={{ height: "420vh" }}
    >
      {/* Section header — pinned at top with the rest scrolling underneath */}
      <div className="pointer-events-none absolute top-12 right-12 z-10 md:top-16 md:right-16">
        <p className="font-display text-base tracking-tight text-white/80 italic md:text-xl">
          process.
        </p>
      </div>

      {/* SVG line — fills the whole section */}
      <svg
        viewBox="0 0 1000 4000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          {/* Clip window that follows the line tip — restricts the glow filter
              to a viewport-sized band around the current draw position so the
              illumination stays visible as the user scrolls down. */}
          <clipPath id="brand-glow-clip" clipPathUnits="userSpaceOnUse">
            <rect ref={clipRectRef} x="-10" y="0" width="1020" height="200" />
          </clipPath>

          <filter id="brand-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Faint white track — always fully visible */}
        <path
          d={PATH_D}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />

        {/* Solid drawn line — no glow filter, draws from start to current tip */}
        <motion.path
          ref={pathRef}
          d={PATH_D}
          stroke={strokeColor}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
        />

        {/* Glow overlay — same draw progress but clipped to the viewport-following
            window so the bright halo tracks the visible portion of the line. */}
        <motion.path
          d={PATH_D}
          stroke={strokeColor}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
          filter="url(#brand-glow)"
          clipPath="url(#brand-glow-clip)"
        />

        {/* Checkpoint dots — each appears when its step's progress arrives */}
        {STEPS.map((step, i) => (
          <CheckpointDot
            key={i}
            cx={step.cx}
            cy={step.cy}
            progress={progress}
            index={i}
            total={STEPS.length}
          />
        ))}
      </svg>

      {/* Step text overlays */}
      {STEPS.map((step, i) => (
        <StepText
          key={i}
          step={step}
          progress={progress}
          index={i}
          total={STEPS.length}
        />
      ))}

      {/* End CTA — fades in dramatically at the bottom of the line */}
      <motion.div
        style={{
          opacity: ctaOpacity,
          y: ctaY,
          filter: ctaFilter,
          scale: ctaScale,
        }}
        className="pointer-events-auto absolute bottom-[3%] left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <p className="mb-4 font-display text-xs tracking-[0.4em] text-white/40 uppercase">
          Ready to begin?
        </p>
        <Link
          to="/contact?branding=1"
          className="group relative inline-flex items-center gap-3 border border-white/60 bg-black/40 px-10 py-4 backdrop-blur-sm transition-all duration-500 hover:border-white hover:bg-white"
        >
          <span className="font-display text-base font-bold tracking-[0.25em] text-white uppercase transition-colors duration-500 group-hover:text-black md:text-lg">
            Start Now
          </span>
          <span className="text-white transition-colors duration-500 group-hover:text-black">
            →
          </span>
        </Link>
      </motion.div>
    </section>
  )
}

// ─── Checkpoint dot — outlined when not reached, filled when reached ─────────
const CheckpointDot = ({
  cx,
  cy,
  progress,
  index,
  total,
}: {
  cx: number
  cy: number
  progress: import("motion/react").MotionValue<number>
  index: number
  total: number
}) => {
  const center = (index + 1) / (total + 1)
  const reach = Math.max(0, center - 0.04)
  const fill = useTransform(progress, [reach, center], [0, 1])
  const ringOpacity = useTransform(
    progress,
    [Math.max(0, center - 0.12), reach],
    [0.2, 0.9],
  )

  return (
    <g>
      <motion.circle
        cx={cx}
        cy={cy}
        r={18}
        fill="none"
        stroke="rgba(180,210,255,1)"
        strokeWidth={2}
        style={{ opacity: ringOpacity }}
        vectorEffect="non-scaling-stroke"
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={9}
        style={{ opacity: fill }}
        fill="rgba(180,210,255,1)"
      />
    </g>
  )
}
