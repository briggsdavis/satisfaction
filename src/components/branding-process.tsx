import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"

type Side = "right" | "left"

type Waypoint = {
  x: number
  y: number
  side: Side
  tag: string
  title: string
  body: string
}

// viewBox is portrait 730 × 1520 — same aspect family as the reference squiggle.
const VIEW_W = 730
const VIEW_H = 1520

// Vertical stretch factor. The path data stays in its original VIEW_H units;
// rendering scales y by this factor inside an SVG <g>, while the container's
// aspect-ratio uses the scaled height so the box itself grows taller. Strokes
// keep uniform width via `vector-effect="non-scaling-stroke"`.
const Y_SCALE = 1.35
const VIEW_H_RENDER = VIEW_H * Y_SCALE

// Hand-crafted cubic-bezier squiggle. Each segment has its own pull strength and
// horizontal overshoot so amplitudes vary instead of marching back and forth at
// fixed extents. The waypoints below sit on the actual curve at the spots where
// each cubic segment ends.
const PATH_D_RAW = [
  "M 440 30",
  // Start → W1 (sweep down-left, gentle entry)
  "C 380 170, 260 150, 180 230",
  // W1 → mid-curl (push right, then dip back)
  "C 180 340, 460 300, 380 380",
  // mid-curl → W2 (tight little hook before settling on right side)
  "C 320 430, 620 360, 590 420",
  // W2 → W3 (long sweep across to left, lower amplitude)
  "C 590 580, 240 540, 240 660",
  // W3 → soft detour (gentle drift right before swinging across)
  "C 240 720, 400 700, 380 780",
  // detour → W4 (push past 620 then settle back, asymmetric pull)
  "C 360 850, 700 800, 620 880",
  // W4 → W5 (aggressive crossing — strong horizontal overshoot both ends)
  "C 540 1020, 60 990, 140 1110",
  // W5 → reverse-kink (small bend backward, breaking the rhythm)
  "C 140 1170, 320 1190, 290 1240",
  // kink → W6 (sweep right with overshoot past 640)
  "C 270 1290, 720 1250, 640 1310",
  // W6 → End (diagonal settle with slight left bow)
  "C 620 1410, 450 1430, 370 1490",
].join(" ")

// Scale every y-coordinate in a path string by `sy`. Matches "<num> <num>" pairs
// (each cubic-bezier coord pair); commas between pairs prevent over-matching.
function scalePathY(d: string, sy: number): string {
  return d.replace(
    /([\d.]+)\s+([\d.]+)/g,
    (_, x, y) => `${x} ${parseFloat(y) * sy}`,
  )
}

const PATH_D = scalePathY(PATH_D_RAW, Y_SCALE)

// Waypoints, in path order. Each `(x,y)` is exactly the endpoint of the cubic
// segment that ends at that checkpoint, so the dot sits on the line.
const WAYPOINTS: Waypoint[] = [
  {
    x: 180,
    y: 230,
    side: "right",
    tag: "// 01",
    title: "Analysis",
    body: "We analyze your brand to identify the core message and set the direction for everything that follows.",
  },
  {
    x: 590,
    y: 420,
    side: "left",
    tag: "// 02",
    title: "Concept",
    body: "We craft unique creative concepts and bring them to life with mood boards and visual references.",
  },
  {
    x: 240,
    y: 660,
    side: "right",
    tag: "// 03",
    title: "Visuals & Mockups",
    body: "We build out the look — logos, type, color, and real-world mockups so you can see the brand alive.",
  },
  {
    x: 620,
    y: 880,
    side: "left",
    tag: "// 04",
    title: "Budgeting",
    body: "We map scope to budget — clear deliverables, no surprises, every dollar tied to outcomes.",
  },
  {
    x: 140,
    y: 1110,
    side: "right",
    tag: "// 05",
    title: "Planning & Organization",
    body: "We sequence the rollout — milestones, asset handoffs, and timelines built around your launch.",
  },
  {
    x: 640,
    y: 1310,
    side: "left",
    tag: "// 06",
    title: "Satisfaction Insured",
    body: "Revisions, polish, and a guarantee that you'll walk away with a brand you're proud to put your name on.",
  },
]

export const BrandingProcess = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  // Tilda's reference uses a tight scroll range so the line draws ahead of the
  // reader. Mirror that: fill starts as the section enters from the bottom and
  // completes well before it exits, so any visible portion of the line below
  // the current scroll position is already drawn.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.5", "end 0.9"],
  })

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Measure each waypoint's t-value along the actual rendered path so the
  // checkpoint reveal lines up with where the stroke fill genuinely reaches.
  const [tValues, setTValues] = useState<number[]>(() => fallbackTValues())

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const measure = () => {
      const total = path.getTotalLength()
      if (!total) return
      const N = 800
      const samples = new Float32Array(N + 1)
      const xs = new Float32Array(N + 1)
      const ys = new Float32Array(N + 1)
      for (let i = 0; i <= N; i++) {
        const l = (i / N) * total
        const p = path.getPointAtLength(l)
        samples[i] = l
        xs[i] = p.x
        ys[i] = p.y
      }
      const ts = WAYPOINTS.map(({ x, y }) => {
        let bestL = 0
        let bestD = Infinity
        for (let i = 0; i <= N; i++) {
          const dx = xs[i] - x
          const dy = ys[i] - y
          const d = dx * dx + dy * dy
          if (d < bestD) {
            bestD = d
            bestL = samples[i]
          }
        }
        return bestL / total
      })
      setTValues(ts)
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const buttonBlurPx = useTransform(scrollYProgress, [0.88, 1.0], [12, 0], {
    clamp: true,
  })
  const buttonFilter = useTransform(buttonBlurPx, (b) => `blur(${b}px)`)
  const buttonOpacity = useTransform(scrollYProgress, [0.87, 0.99], [0, 1], {
    clamp: true,
  })

  return (
    <section
      ref={containerRef}
      className="relative border-b border-white/10 px-8 py-28 md:px-16 md:py-40"
    >
      <div className="pointer-events-none absolute top-10 right-8 z-10 md:top-14 md:right-14">
        <p className="font-mono text-xs tracking-[0.3em] text-white/25 uppercase">
          process
        </p>
      </div>

      {/* Outer container: full width — labels anchor to its left/right edges.
          Its content height is set by the inner squiggle box (the only flow
          child), so labels using `top: yPct%` resolve to the same vertical
          position as their dot. */}
      <div className="relative mx-auto w-full max-w-6xl">
        {/* Inner squiggle box: width clamps so there's always gutter space for
            labels at every breakpoint. */}
        <div
          className="relative mx-auto"
          style={{
            aspectRatio: `${VIEW_W} / ${VIEW_H_RENDER}`,
            width: "clamp(280px, 60%, 700px)",
          }}
        >
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H_RENDER}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full overflow-visible"
            fill="none"
          >
            <path
              ref={pathRef}
              d={PATH_D}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1.5}
              strokeLinecap="butt"
            />
            <motion.path
              d={PATH_D}
              stroke="#3B82F6"
              strokeWidth={2}
              strokeLinecap="butt"
              style={{ pathLength }}
            />
          </svg>

          {/* Dots sit inside the squiggle box so they ride on the line */}
          {WAYPOINTS.map((wp, i) => (
            <Dot key={i} wp={wp} t={tValues[i]} progress={scrollYProgress} />
          ))}
        </div>

        {/* Labels live in the outer container, pinned to its edges */}
        {WAYPOINTS.map((wp, i) => (
          <Label key={i} wp={wp} t={tValues[i]} progress={scrollYProgress} />
        ))}
      </div>

      {/* CTA button — unblurs as the line finishes drawing */}
      <motion.div
        className="mt-16 flex justify-center"
        style={{ filter: buttonFilter, opacity: buttonOpacity }}
      >
        <Link
          to="/contact"
          className="btn-industrial inline-flex items-center gap-3"
        >
          start your project now <span className="text-sm">→</span>
        </Link>
      </motion.div>
    </section>
  )
}

const Dot = ({
  wp,
  t,
  progress,
}: {
  wp: Waypoint
  t: number
  progress: MotionValue<number>
}) => {
  const scale = useTransform(progress, [t - 0.005, t + 0.005], [0, 1], {
    clamp: true,
  })
  const opacity = useTransform(progress, [t - 0.005, t + 0.005], [0, 1], {
    clamp: true,
  })
  return (
    <motion.div
      className="pointer-events-none absolute h-3 w-3 rounded-full bg-[#3B82F6]"
      style={{
        left: `${(wp.x / VIEW_W) * 100}%`,
        top: `${(wp.y / VIEW_H) * 100}%`,
        x: "-50%",
        y: "-50%",
        scale,
        opacity,
      }}
    />
  )
}

const Label = ({
  wp,
  t,
  progress,
}: {
  wp: Waypoint
  t: number
  progress: MotionValue<number>
}) => {
  const blurPx = useTransform(progress, [t - 0.05, t + 0.03], [10, 0], {
    clamp: true,
  })
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`)
  const opacity = useTransform(progress, [t - 0.06, t + 0.02], [0.15, 1], {
    clamp: true,
  })

  const isRight = wp.side === "right"
  const yPct = (wp.y / VIEW_H) * 100

  return (
    <motion.div
      className={`pointer-events-none absolute -translate-y-1/2 ${
        isRight ? "right-0 text-left" : "left-0 text-right"
      } w-28 sm:w-36 md:w-48 lg:w-60 xl:w-72`}
      style={{
        top: `${yPct}%`,
        filter,
        opacity,
        willChange: "filter, opacity",
      }}
    >
      <p className="mb-0.5 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase md:text-xs">
        {wp.tag}
      </p>
      <h3 className="mb-2 font-display text-3xl leading-tight font-bold tracking-tight text-white lowercase md:text-5xl">
        {wp.title}
      </h3>
      <p className="text-sm leading-relaxed text-white/55 md:text-base">
        {wp.body}
      </p>
    </motion.div>
  )
}

// Cumulative chord-length fractions used as initial t-values before the SVG
// path mounts and we can measure real arc length.
function fallbackTValues(): number[] {
  // approximate; will be replaced by measurement on mount
  return [0.13, 0.31, 0.46, 0.6, 0.77, 0.9]
}
