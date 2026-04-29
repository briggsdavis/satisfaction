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

// Single continuous cubic Bézier path.
// G1 continuity is maintained at every junction: each outgoing cp1 is the
// reflection of the incoming cp2 through the shared endpoint, so there are
// no tangent discontinuities ("elbows") at the connection points.
const PATH_D = [
  "M 500 0",
  // entry swirl → Step 1 (left, cy=600)
  "C 600 100, 850 200, 750 380",
  "C 650 560, 380 520, 250 600",
  // Step 1 → turnaround left → Step 2 (right, cy=1200)
  "C 120 680, 60 920, 120 1080",
  "C 180 1240, 620 1140, 750 1200",
  // Step 2 → turnaround right → Step 3 (left, cy=1800)
  "C 880 1260, 940 1500, 880 1680",
  "C 820 1860, 380 1740, 250 1800",
  // Step 3 → turnaround left → Step 4 (right, cy=2400)
  "C 120 1860, 60 2100, 120 2280",
  "C 180 2460, 620 2340, 750 2400",
  // Step 4 → turnaround right → Step 5 (left, cy=3000)
  "C 880 2460, 940 2700, 880 2880",
  "C 820 3060, 380 2940, 250 3000",
  // Step 5 → turnaround left → Step 6 (right, cy=3600)
  "C 120 3060, 60 3300, 120 3480",
  "C 180 3660, 620 3540, 750 3600",
  // Step 6 → center exit
  "C 880 3660, 700 3860, 500 3950",
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
  const center = (index + 1) / (total + 1)
  const fadeIn = Math.max(0, center - 0.06)
  const peak = center + 0.02

  const opacity = useTransform(progress, [fadeIn, peak], [0, 1])
  const y = useTransform(progress, [fadeIn, peak], [24, 0])
  const blur = useTransform(progress, [fadeIn, peak], [12, 0])
  const filter = useTransform(blur, (b: number) => `blur(${b}px)`)

  const topPct = (step.cy / 4000) * 100

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
  const grayPathRef = useRef<SVGPathElement>(null)
  const bluePathRef = useRef<SVGPathElement>(null)
  const [totalLength, setTotalLength] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  // Measure section geometry and path length. Re-runs on resize.
  useEffect(() => {
    const measure = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        sectionTopRef.current = rect.top + (smoothY?.get() ?? window.scrollY)
        sectionHeightRef.current = rect.height
      }
      if (grayPathRef.current) {
        const len = grayPathRef.current.getTotalLength()
        setTotalLength(len)
      }
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  // Apply dasharray once path length is known, and keep dashoffset in sync
  // with the current scroll position (so a hard-refresh at mid-page is correct).
  useEffect(() => {
    if (!bluePathRef.current || totalLength <= 0) return
    const bp = bluePathRef.current
    bp.style.strokeDasharray = `${totalLength} ${totalLength}`
    bp.style.strokeDashoffset = String(totalLength) // start fully hidden
  }, [totalLength])

  // Progress 0 → 1 as the section travels through the viewport.
  // 0 = section top at viewport center; 1 = section bottom at viewport center.
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

  // Drive the blue line's stroke-dashoffset directly from the progress motion
  // value. This bypasses React rendering entirely for the scroll-tick update,
  // eliminating the frame lag that caused the illuminated segment to sit above
  // the visible portion of the SVG.
  useEffect(() => {
    if (totalLength <= 0) return
    // Sync immediately with current progress
    if (bluePathRef.current) {
      bluePathRef.current.style.strokeDashoffset = String(
        totalLength * (1 - progress.get()),
      )
    }
    return progress.on("change", (v: number) => {
      if (bluePathRef.current) {
        bluePathRef.current.style.strokeDashoffset = String(totalLength * (1 - v))
      }
    })
  }, [progress, totalLength])

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
      {/* Section label */}
      <div className="pointer-events-none absolute top-12 right-12 z-10 md:top-16 md:right-16">
        <p className="font-display text-base tracking-tight text-white/80 italic md:text-xl">
          process.
        </p>
      </div>

      {/* SVG line — fills the full section height */}
      <svg
        viewBox="0 0 1000 4000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <filter id="brand-glow" x="-60%" y="-10%" width="220%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Gray base — always fully visible as the static track */}
        <path
          ref={grayPathRef}
          d={PATH_D}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />

        {/* Blue illuminated overlay — dashoffset updated imperatively on scroll.
            stroke-dasharray / stroke-dashoffset are set via the DOM (not Framer
            Motion's pathLength) so the segment is always aligned with the gray
            base and stays inside the viewport as expected. */}
        <path
          ref={bluePathRef}
          d={PATH_D}
          stroke="rgba(100,185,255,0.92)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          filter="url(#brand-glow)"
        />

        {/* Checkpoint dots */}
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

      {/* End CTA */}
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

// ─── Checkpoint dot ───────────────────────────────────────────────────────────
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
        stroke="rgba(100,185,255,1)"
        strokeWidth={2}
        style={{ opacity: ringOpacity }}
        vectorEffect="non-scaling-stroke"
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={9}
        style={{ opacity: fill }}
        fill="rgba(100,185,255,1)"
      />
    </g>
  )
}
