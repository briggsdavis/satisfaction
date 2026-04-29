import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef } from "react"
import { Link } from "react-router"
import { useSmoothScroll } from "./smooth-scroll"

// ─── Steps ────────────────────────────────────────────────────────────────────
// Path checkpoint positions (in 1000×4000 viewBox).
// Steps alternate left (x=250) / right (x=750) so the line snakes between them.
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

// Each consecutive pair of steps is connected by a single cubic bezier —
// no intermediate turnaround waypoints, so there are zero junction kinks.
// G1 is maintained at every step checkpoint: the departure cp1 is the
// reflection of the arrival cp2 through the checkpoint, giving the same
// tangent direction on both sides.
const PATH_D = [
  "M 500 0",
  "C 600 100, 850 150, 750 350",   // opening swirl …
  "C 650 550, 400 500, 250 600",   // … → Step 1 (left)
  "C 100 700, 600 1100, 750 1200", // → Step 2 (right)
  "C 900 1300, 400 1700, 250 1800", // → Step 3 (left)
  "C 100 1900, 600 2300, 750 2400", // → Step 4 (right)
  "C 900 2500, 400 2900, 250 3000", // → Step 5 (left)
  "C 100 3100, 600 3500, 750 3600", // → Step 6 (right)
  "C 900 3700, 650 3900, 500 3950", // → end at centre
].join(" ")

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
  // Each step's "active" point along the scroll. Spaced evenly with padding.
  const center = (index + 1) / (total + 1)
  const fadeIn = Math.max(0, center - 0.06)
  const peak = center + 0.02

  const opacity = useTransform(progress, [fadeIn, peak], [0, 1])
  const y = useTransform(progress, [fadeIn, peak], [24, 0])
  const blur = useTransform(progress, [fadeIn, peak], [12, 0])
  const filter = useTransform(blur, (b: number) => `blur(${b}px)`)

  // Position along section: matches checkpoint y in viewBox 0–4000.
  const topPct = (step.cy / 4000) * 100

  // Side: left text right-aligned and ending before the line; right text starts after the line.
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
// Binary-search the path for the arc-length fraction where the path's y
// coordinate (in viewBox space, 0–4000) equals targetCy.  Used once on
// mount to calibrate the scroll offset so the glowing tip tracks at
// viewport-centre as each step checkpoint scrolls into view.
function arcFractionAtCy(path: SVGPathElement, targetCy: number): number {
  const total = path.getTotalLength()
  let lo = 0
  let hi = total
  for (let i = 0; i < 52; i++) {
    const mid = (lo + hi) / 2
    if (path.getPointAtLength(mid).y < targetCy) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2 / total
}

export const BrandingProcess = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const sectionTopRef = useRef(0)
  const sectionHeightRef = useRef(1)
  // Scroll offset (px) so the line tip is at viewport-centre when each step
  // is at viewport-centre.  Calibrated at mount from actual arc lengths.
  const scrollOffsetRef = useRef(
    typeof window !== "undefined" ? window.innerHeight * 0.5 : 400,
  )
  const pathRef = useRef<SVGPathElement>(null)

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
      if (pathRef.current && sectionHeightRef.current > 0) {
        const path = pathRef.current
        const H = sectionHeightRef.current
        const vh = window.innerHeight
        // Average the required offset across all step checkpoints so one
        // linear formula keeps the tip near viewport-centre throughout.
        let sum = 0
        for (const step of STEPS) {
          const frac = arcFractionAtCy(path, step.cy)
          sum += H * (frac - step.cy / 4000) + vh * 0.5
        }
        scrollOffsetRef.current = sum / STEPS.length
      }
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  // Progress 0 → 1 as the section travels through the viewport.
  // The offset is calibrated so the glowing tip aligns with the step that
  // is currently at viewport-centre, compensating for the opening swirl
  // being arc-length-longer than the uniform step-to-step segments.
  const progress = useTransform(activeY, (y: number) => {
    const T = sectionTopRef.current
    const H = sectionHeightRef.current
    const offset = scrollOffsetRef.current
    const start = T - offset
    const end = T + H - offset
    const range = end - start
    if (range <= 0) return 0
    return Math.max(0, Math.min(1, (y - start) / range))
  })

  const pathLength = useTransform(progress, [0, 1], [0, 1])

  // Color: faint white at start, light blue once the line has filled past ~15%.
  const strokeColor = useTransform(
    progress,
    [0, 0.15, 1],
    ["rgba(255,255,255,0.5)", "rgba(180,210,255,0.85)", "rgba(180,210,255,0.95)"],
  )

  // CTA enters the viewport at ~progress 0.97; fade-in completes right as it
  // reaches viewport center so it's fully legible when the user sees it.
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
        {/* Faint white track */}
        <path
          d={PATH_D}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        {/* Foreground filled line — pathLength animates the draw */}
        <motion.path
          ref={pathRef}
          d={PATH_D}
          stroke={strokeColor}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
          // Soft glow via SVG filter
          filter="url(#brand-glow)"
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

        <defs>
          <filter id="brand-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Reduce the visible side-stretching that "preserveAspectRatio=none"
            causes by hiding bounding rects (none used) — keep the SVG clean. */}
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

      {/* The path drawn but hidden — used for `getTotalLength()` measurement.
          Renders into the same SVG above; we still need a ref. */}
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
  // Outer ring opacity: appears just before the dot fills.
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
