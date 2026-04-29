import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { useSmoothScroll } from "./smooth-scroll"

// ─── Steps (repositioned to give loops room) ──────────────────────────────────
// Checkpoints are spaced ~1200 units apart in a 6500-unit viewBox (580vh tall)
// so each loop has room to breathe without crowding adjacent text.
const STEPS = [
  {
    num: "01",
    title: "Analysis",
    body: "We analyze your brand to identify the core message and set the direction for everything that follows.",
    side: "left" as const,
    cx: 280,
    cy: 900,
  },
  {
    num: "02",
    title: "Concept",
    body: "We craft unique creative concepts and bring them to life with mood boards and visual references.",
    side: "right" as const,
    cx: 720,
    cy: 2100,
  },
  {
    num: "03",
    title: "Visuals & Mockups",
    body: "We build out the look — logos, type, color, and real-world mockups so you can see the brand alive.",
    side: "left" as const,
    cx: 280,
    cy: 3200,
  },
  {
    num: "04",
    title: "Budgeting",
    body: "We map scope to budget — clear deliverables, no surprises, every dollar tied to outcomes.",
    side: "right" as const,
    cx: 720,
    cy: 4400,
  },
  {
    num: "05",
    title: "Planning & Organization",
    body: "We sequence the rollout — milestones, asset handoffs, and timelines built around your launch.",
    side: "left" as const,
    cx: 280,
    cy: 5350,
  },
  {
    num: "06",
    title: "Satisfaction Insured",
    body: "Revisions, polish, and a guarantee that you'll walk away with a brand you're proud to put your name on.",
    side: "right" as const,
    cx: 720,
    cy: 6200,
  },
]

// ─── Loop path ────────────────────────────────────────────────────────────────
// Single continuous cubic Bézier path. At each transition the line overshoots
// into a teardrop loop: the approach and the loop's return arc both pass through
// the same "crossing point" from opposite directions, producing the self-
// intersecting X that makes each node look like a knotted loop.
//
// Right loops  (odd → even steps): crossing sits right-of-center, oval bulges
//              toward x≈1000 (may clip the edge — intentional, matches ref).
// Left loops   (even → odd steps): mirror image toward x≈0.
//
// ViewBox: 0 0 1000 6500  (section height: 580vh)

const VIEWBOX_H = 6500

const PATH_D = [
  "M 500 0",

  // ── ENTRY LOOP (right side) ── crossing C0 ≈ (780, 320) ──────────────────
  // Approach from top: arrives at C0 going mostly DOWN
  "C 640 0, 790 80, 780 320",
  // Loop clockwise — right side, bottom, left, return
  "C 770 560, 880 640, 940 780",
  "C 1000 920, 980 1080, 890 1150",
  "C 800 1220, 670 1180, 630 1040",
  // Return to C0 going RIGHT-UP — crosses the DOWN approach → visible X
  "C 590 900, 650 520, 780 320",
  // Exit C0 sweeping left-down to Step 1
  "C 910 140, 520 520, 280 900",

  // ── LOOP 1 (right side) ── Step1(280,900) → crossing C1≈(760,1450) → Step2(720,2100) ──
  // Approach: LEFT step to C1 going RIGHT-DOWN
  "C 280 1100, 720 1360, 760 1450",
  // Loop clockwise
  "C 800 1540, 930 1670, 970 1840",
  "C 1010 2010, 950 2180, 840 2220",
  "C 730 2260, 630 2170, 620 2010",
  // Return to C1 going RIGHT-UP — crosses approach → X
  "C 610 1850, 700 1530, 760 1450",
  // Exit C1 to Step 2
  "C 840 1370, 790 1790, 720 2100",

  // ── LOOP 2 (left side) ── Step2(720,2100) → crossing C2≈(240,2650) → Step3(280,3200) ──
  // Approach: RIGHT step to C2 going LEFT-DOWN
  "C 720 2300, 280 2580, 240 2650",
  // Loop counter-clockwise (left side)
  "C 200 2720, 70 2830, 30 3000",
  "C -10 3170, 60 3330, 190 3380",
  "C 320 3430, 440 3330, 470 3170",
  // Return to C2 going LEFT-UP — crosses approach → X
  "C 500 3010, 350 2700, 240 2650",
  // Exit C2 to Step 3
  "C 130 2600, 230 2960, 280 3200",

  // ── LOOP 3 (right side) ── Step3(280,3200) → crossing C3≈(760,3750) → Step4(720,4400) ──
  "C 280 3400, 720 3680, 760 3750",
  "C 800 3820, 930 3960, 970 4130",
  "C 1010 4300, 950 4470, 840 4510",
  "C 730 4550, 630 4460, 620 4300",
  // Return to C3 → X
  "C 610 4140, 700 3820, 760 3750",
  // Exit to Step 4
  "C 840 3680, 790 4090, 720 4400",

  // ── LOOP 4 (left side) ── Step4(720,4400) → crossing C4≈(240,4950) → Step5(280,5350) ──
  "C 720 4610, 280 4880, 240 4950",
  "C 200 5020, 70 5130, 30 5300",
  "C -10 5470, 60 5630, 190 5680",
  "C 320 5730, 440 5630, 470 5470",
  // Return to C4 → X
  "C 500 5310, 350 5000, 240 4950",
  // Exit to Step 5
  "C 130 4900, 230 5160, 280 5350",

  // ── LOOP 5 (right side) ── Step5(280,5350) → crossing C5≈(760,5900) → Step6(720,6200) ──
  "C 280 5550, 720 5830, 760 5900",
  "C 800 5970, 930 6080, 960 6230",
  "C 990 6380, 920 6490, 820 6510",
  "C 720 6530, 640 6450, 640 6300",
  // Return to C5 → X
  "C 640 6150, 710 5910, 760 5900",
  // Exit to Step 6
  "C 820 5890, 800 6090, 720 6200",

  // Tail to center
  "C 760 6310, 640 6460, 500 6490",
].join(" ")

// ─── Step text ────────────────────────────────────────────────────────────────
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

  const topPct = (step.cy / VIEWBOX_H) * 100

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

// ─── BrandingProcessLoop ──────────────────────────────────────────────────────
export const BrandingProcessLoop = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const sectionTopRef = useRef(0)
  const sectionHeightRef = useRef(1)
  const grayPathRef = useRef<SVGPathElement>(null)
  const bluePathRef = useRef<SVGPathElement>(null)
  const [totalLength, setTotalLength] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  useEffect(() => {
    const measure = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        sectionTopRef.current = rect.top + (smoothY?.get() ?? window.scrollY)
        sectionHeightRef.current = rect.height
      }
      if (grayPathRef.current) {
        setTotalLength(grayPathRef.current.getTotalLength())
      }
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  useEffect(() => {
    if (!bluePathRef.current || totalLength <= 0) return
    const bp = bluePathRef.current
    bp.style.strokeDasharray = `${totalLength} ${totalLength}`
    bp.style.strokeDashoffset = String(totalLength)
  }, [totalLength])

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

  useEffect(() => {
    if (totalLength <= 0) return
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

  const ctaOpacity = useTransform(progress, [0.93, 0.97], [0, 1])
  const ctaY = useTransform(progress, [0.93, 0.97], [40, 0])
  const ctaBlur = useTransform(progress, [0.93, 0.97], [16, 0])
  const ctaFilter = useTransform(ctaBlur, (b: number) => `blur(${b}px)`)
  const ctaScale = useTransform(progress, [0.93, 0.98], [0.92, 1])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-white/10 bg-black"
      style={{ height: "580vh" }}
    >
      {/* Label — distinguishes this variant */}
      <div className="pointer-events-none absolute top-12 right-12 z-10 md:top-16 md:right-16">
        <p className="font-display text-base tracking-tight text-white/80 italic md:text-xl">
          process.
        </p>
      </div>

      <svg
        viewBox={`0 0 1000 ${VIEWBOX_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          {/* Unique filter id to avoid conflict with the first section's filter */}
          <filter id="loop-glow" x="-60%" y="-10%" width="220%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Gray base track */}
        <path
          ref={grayPathRef}
          d={PATH_D}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />

        {/* Blue illuminated overlay */}
        <path
          ref={bluePathRef}
          d={PATH_D}
          stroke="rgba(100,185,255,0.92)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          filter="url(#loop-glow)"
        />

        {STEPS.map((step, i) => (
          <LoopDot
            key={i}
            cx={step.cx}
            cy={step.cy}
            progress={progress}
            index={i}
            total={STEPS.length}
          />
        ))}
      </svg>

      {STEPS.map((step, i) => (
        <StepText
          key={i}
          step={step}
          progress={progress}
          index={i}
          total={STEPS.length}
        />
      ))}

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
const LoopDot = ({
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
