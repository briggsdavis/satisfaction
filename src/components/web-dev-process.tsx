import { AnimatePresence, motion, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { usePinnedScroll } from "../hooks/use-pinned-scroll"

// ─── Step data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    tag: "// init",
    title: "Discovery Call",
    body: "A console-style deep-dive where we map exactly what you need built — goals, audience, features, and everything that shapes the project before we start.",
  },
  {
    num: "02",
    tag: "// agreement",
    title: "Scope of Work",
    body: "Full transparency before a single pixel moves. We define deliverables, timeline, and pricing in a clear written agreement — no surprises, ever.",
  },
  {
    num: "03",
    tag: "// design",
    title: "Prototype",
    body: "We take your branding and brief and build custom prototypes specifically for you — real designs, not templates. You'll see exactly what your site feels like before we build it.",
  },
  {
    num: "04",
    tag: "// iterate",
    title: "Revision Rounds",
    body: "Three dedicated rounds to refine and perfect. We present, you respond, we adjust. Your input shapes every stage of the final product.",
  },
  {
    num: "05",
    tag: "// deploy",
    title: "Hand Off",
    body: "Full-service launch — hosting, domain connection, and go-live support. We hand over everything you need to own it, and stay on as you grow.",
  },
]

// ─── Step 01: Terminal / discovery console ────────────────────────────────────
const DiscoveryVisual = () => {
  const lines = [
    { label: ">", text: "start_discovery(client)", accent: true },
    { label: "//", text: "goals: brand_presence + e-commerce", accent: false },
    { label: "//", text: "audience: lifestyle, 25–40", accent: false },
    {
      label: "//",
      text: "features: [booking, portfolio, blog]",
      accent: false,
    },
    { label: "//", text: "timeline: Q2 launch", accent: false },
    { label: ">", text: "session.record() ✓", accent: true },
  ]
  return (
    <div className="w-full max-w-md overflow-hidden rounded-[16px] border border-white/10 bg-neutral-950">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/70" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <div className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-3 font-mono text-xs text-white/30">
          discovery.sh
        </span>
      </div>
      <div className="p-5 font-mono text-sm">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.28 + 0.15, duration: 0.3 }}
            className="mb-2 flex gap-3"
          >
            <span className={line.accent ? "text-cyan-400" : "text-white/25"}>
              {line.label}
            </span>
            <span
              className={
                i === lines.length - 1 ? "text-green-400" : "text-white/65"
              }
            >
              {line.text}
            </span>
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
          className="font-mono text-cyan-400"
        >
          ▊
        </motion.span>
      </div>
    </div>
  )
}

// ─── Step 02: Scope of work document ─────────────────────────────────────────
const ScopeVisual = () => {
  const items = [
    "Custom design system",
    "12-page responsive build",
    "E-commerce integration",
    "3× revision rounds",
    "Launch + hosting support",
  ]
  return (
    <div className="w-full max-w-md overflow-hidden rounded-[16px] border border-white/10 bg-neutral-950 p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.2em] text-white/35 uppercase">
          scope_of_work.pdf
        </span>
        <span className="font-mono text-xs text-white/20">v1.0</span>
      </div>
      <div className="mb-6 space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.22 + 0.1, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-white/20"
              animate={{
                borderColor: "rgba(34,211,238,0.7)",
                backgroundColor: "rgba(34,211,238,0.08)",
              }}
              transition={{ delay: i * 0.22 + 0.45, duration: 0.3 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: i * 0.22 + 0.55,
                  duration: 0.25,
                  type: "spring",
                }}
                className="text-[9px] text-cyan-400"
              >
                ✓
              </motion.span>
            </motion.div>
            <span className="text-sm text-white/60">{item}</span>
          </motion.div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-4">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <div className="h-px flex-1 bg-white/15" />
          <motion.span
            className="font-mono text-xs tracking-[0.25em] text-cyan-400 uppercase"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.85, duration: 0.4, type: "spring" }}
          >
            agreed ✓
          </motion.span>
          <div className="h-px flex-1 bg-white/15" />
        </motion.div>
      </div>
    </div>
  )
}

// ─── Step 03: Browser wireframe assembling ────────────────────────────────────
const PrototypeVisual = () => (
  <div className="w-full max-w-md overflow-hidden rounded-[16px] border border-white/10 bg-neutral-950">
    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
      <div className="h-3 w-3 rounded-full bg-red-500/50" />
      <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
      <div className="h-3 w-3 rounded-full bg-green-500/50" />
      <div className="ml-3 flex-1 rounded bg-white/5 px-3 py-1">
        <span className="font-mono text-xs text-white/25">yourdomain.com</span>
      </div>
    </div>
    <div className="space-y-2 p-4">
      {/* Nav bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex h-8 items-center gap-2"
      >
        <div className="h-full w-16 rounded bg-white/10" />
        <div className="flex-1" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2.5 w-10 rounded bg-white/8" />
        ))}
        <div className="h-6 w-16 rounded border border-cyan-400/30 bg-cyan-400/15" />
      </motion.div>

      {/* Hero block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex h-24 items-center justify-center rounded-[8px] border border-white/10 bg-white/5"
      >
        <div className="space-y-2 text-center">
          <div className="mx-auto h-3 w-32 rounded bg-white/20" />
          <div className="mx-auto h-2 w-20 rounded bg-white/10" />
          <div className="mx-auto mt-2 h-5 w-16 rounded border border-cyan-400/30 bg-cyan-400/20" />
        </div>
      </motion.div>

      {/* Card row */}
      <div className="flex gap-2">
        {[0, 0.12, 0.24].map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + d, duration: 0.4 }}
            className="h-16 flex-1 rounded-[8px] border border-white/8 bg-white/5"
          />
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.4 }}
        className="h-8 rounded border border-white/8 bg-white/5"
      />

      {/* "Design complete" flash */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ delay: 1.3, duration: 1.6, times: [0, 0.1, 0.75, 1] }}
        className="flex items-center justify-center gap-2 pt-1"
      >
        <span className="font-mono text-xs text-cyan-400">
          prototype_ready.fig ✓
        </span>
      </motion.div>
    </div>
  </div>
)

// ─── Step 04: Three revision rings ────────────────────────────────────────────
const RevisionVisual = () => {
  const CIRCUMFERENCE = 2 * Math.PI * 36
  const rounds = [
    { label: "Initial Review", color: "#22D3EE" },
    { label: "Second Pass", color: "#818CF8" },
    { label: "Final Polish", color: "#34D399" },
  ]
  return (
    <div className="flex items-center justify-center gap-8">
      {rounds.map((round, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.3,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col items-center gap-3"
        >
          <div className="relative">
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle
                cx="44"
                cy="44"
                r="36"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="4"
              />
              <motion.circle
                cx="44"
                cy="44"
                r="36"
                fill="none"
                stroke={round.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  delay: i * 0.55 + 0.4,
                  duration: 1.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ rotate: -90, transformOrigin: "44px 44px" }}
              />
            </svg>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.55 + 0.25, duration: 0.3 }}
            >
              <span className="font-mono text-xl font-bold text-white">
                0{i + 1}
              </span>
            </motion.div>
          </div>
          <motion.span
            className="text-center text-xs tracking-[0.1em] text-white/35 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.55 + 0.7, duration: 0.35 }}
          >
            {round.label}
          </motion.span>
          <motion.span
            className="font-mono text-xs"
            style={{ color: round.color }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: i * 0.55 + 1.85,
              duration: 0.3,
              type: "spring",
              stiffness: 300,
            }}
          >
            ✓ approved
          </motion.span>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Step 05: Deploy / hand off terminal ─────────────────────────────────────
const HandOffVisual = () => {
  const statusLines = [
    { text: "npm run build", delay: 0.1, cls: "text-white/45" },
    { text: "Build complete ✓", delay: 0.55, cls: "text-green-400" },
    { text: "Connecting domain...", delay: 1.0, cls: "text-white/45" },
    { text: "SSL configured ✓", delay: 1.4, cls: "text-green-400" },
    { text: "Performance score: 98 ✓", delay: 1.8, cls: "text-green-400" },
    { text: "✓  SITE IS LIVE", delay: 2.3, cls: "text-green-400 font-bold" },
  ]
  return (
    <div className="w-full max-w-md overflow-hidden rounded-[16px] border border-white/10 bg-neutral-950">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-green-500/70" />
        <div className="h-3 w-3 rounded-full bg-green-500/70" />
        <div className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-3 font-mono text-xs text-white/30">deploy.sh</span>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-4 pb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-mono text-xs text-white/30">Deploying</span>
          <motion.span
            className="font-mono text-xs text-cyan-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            100%
          </motion.span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              delay: 0.15,
              duration: 1.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      </div>

      {/* Output lines */}
      <div className="space-y-1.5 px-5 pb-5 font-mono text-sm">
        {statusLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: line.delay, duration: 0.2 }}
            className={line.cls}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Visuals map ─────────────────────────────────────────────────────────────
const VISUALS = [
  DiscoveryVisual,
  ScopeVisual,
  PrototypeVisual,
  RevisionVisual,
  HandOffVisual,
]

// ─── Main component ───────────────────────────────────────────────────────────
export const WebDevProcess = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { pinY, progress, pinDistance } = usePinnedScroll(
    wrapperRef,
    () => window.innerHeight * 5,
  )

  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    return progress.on("change", (p) => {
      const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))
      setStepIndex(idx)
    })
  }, [progress])

  // Segment fill within the current step (0→1)
  const segmentFill = useTransform(progress, (p) => (p * STEPS.length) % 1)

  // Scroll hint fades out once you start scrolling into the section
  const hintOpacity = useTransform(progress, [0, 0.04], [1, 0])

  const Visual = VISUALS[stepIndex]

  return (
    <div
      ref={wrapperRef}
      style={{ height: `calc(${pinDistance}px + 100vh)` }}
      className="relative"
    >
      <motion.div
        style={{ y: pinY }}
        className="relative h-screen overflow-hidden border-b border-white/10 bg-black"
      >
        {/* Section label */}
        <div className="pointer-events-none absolute top-8 right-8 z-10 md:top-12 md:right-14">
          <p className="font-mono text-xs tracking-[0.3em] text-white/25 uppercase">
            process
          </p>
        </div>

        {/* ── Step progress bar (5 segments) ── */}
        <div className="absolute inset-x-0 top-0 z-20 flex h-0.5 gap-px">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-cyan-400"
                animate={{
                  scaleX: stepIndex > i ? 1 : stepIndex === i ? undefined : 0,
                }}
                style={stepIndex === i ? { scaleX: segmentFill } : undefined}
                initial={{ scaleX: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                /* transformOrigin left so the bar fills left→right */
              />
            </div>
          ))}
        </div>

        {/* ── Main layout: spacer pushes both panels into the lower portion ── */}
        <div className="flex h-full flex-col">
          {/* Top spacer — keeps content clear of the hero title */}
          <div className="h-[48vh] shrink-0" />

          {/* Content row — text left, visual right, both share the same zone */}
          <div className="flex min-h-0 flex-1 flex-col gap-6 md:flex-row">
            {/* Left: step info */}
            <div className="flex flex-col justify-start px-8 md:w-[44%] md:px-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -28 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="mb-3 font-mono text-xs tracking-[0.3em] text-cyan-400/60">
                    {STEPS[stepIndex].tag}
                  </p>
                  <div className="mb-5 flex items-baseline gap-4">
                    <span className="font-mono text-5xl font-bold text-white/8 md:text-7xl">
                      {STEPS[stepIndex].num}
                    </span>
                    <h3 className="text-2xl leading-tight font-bold tracking-tight text-white md:text-4xl">
                      {STEPS[stepIndex].title}
                    </h3>
                  </div>
                  <p className="max-w-sm text-base leading-relaxed text-white/50">
                    {STEPS[stepIndex].body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: animated visual — same vertical zone as text */}
            <div className="flex flex-1 items-start justify-center px-8 md:px-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, scale: 0.94, x: 32 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.94, x: -32 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex w-full justify-center"
                >
                  <Visual />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Step dots (bottom center) ── */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full"
              animate={{
                width: stepIndex === i ? "24px" : "6px",
                backgroundColor:
                  stepIndex === i
                    ? "rgba(34,211,238,0.85)"
                    : "rgba(255,255,255,0.18)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* ── Scroll hint (step 0 only) / Get Started Now (step 5 only) ── */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute right-10 bottom-8 font-mono text-xs tracking-[0.35em] text-white/15 uppercase md:right-16"
        >
          Scroll ↓
        </motion.div>

        <AnimatePresence>
          {stepIndex === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto absolute right-10 bottom-8 z-10 md:right-16"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 border border-white/60 bg-black/60 px-8 py-3 backdrop-blur-sm transition-all duration-500 hover:border-white hover:bg-white"
              >
                <span className="font-mono text-sm font-bold tracking-[0.2em] text-white uppercase transition-colors duration-500 group-hover:text-black">
                  Get Started Now
                </span>
                <span className="text-white transition-colors duration-500 group-hover:text-black">
                  →
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
