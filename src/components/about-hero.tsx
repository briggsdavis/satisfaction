import { motion, useMotionValue, useTransform } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSmoothScroll } from "./smooth-scroll"

interface WaveSource {
  x: number
  y: number
  birthTime: number
  speed: number
}

const RipplingDotsCanvas = ({ opacity }: { opacity: ReturnType<typeof useTransform<number, number>> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef(0)
  const wavesRef = useRef<WaveSource[]>([])
  const lastWaveTimeRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const now = performance.now() / 1000
    const spacing = 30
    const sigma = 20
    const twoSigmaSq = 2 * sigma * sigma

    // Spawn new wave every 2-4s
    if (now - lastWaveTimeRef.current > 2 + Math.random() * 2) {
      wavesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        birthTime: now,
        speed: 120 + Math.random() * 80,
      })
      lastWaveTimeRef.current = now
    }

    // Spawn center wave initially
    if (wavesRef.current.length === 0) {
      wavesRef.current.push({
        x: w / 2,
        y: h / 2,
        birthTime: now,
        speed: 150,
      })
      lastWaveTimeRef.current = now
    }

    const maxDist = Math.sqrt(w * w + h * h)
    wavesRef.current = wavesRef.current.filter(
      (wave) => (now - wave.birthTime) * wave.speed < maxDist * 1.5,
    )

    for (let gx = spacing / 2; gx < w; gx += spacing) {
      for (let gy = spacing / 2; gy < h; gy += spacing) {
        let boost = 0
        for (const wave of wavesRef.current as WaveSource[]) {
          const waveFront = wave.speed * (now - wave.birthTime)
          const dx = gx - wave.x
          const dy = gy - wave.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const delta = Math.abs(dist - waveFront)
          boost += Math.exp(-(delta * delta) / twoSigmaSq)
        }

        const alpha = Math.min(0.06 + boost * 0.2, 0.3)
        const radius = (1.5 + boost * 1) * dpr

        ctx.globalAlpha = alpha
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.arc(gx * dpr, gy * dpr, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    animFrameRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [draw])

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity }}
    />
  )
}

const marqueeText = Array(8)
  .fill("SOCIAL SATISFACTION")
  .join(" \u2022 ")
  .concat(" \u2022 ")

const BorderMarquee = ({ opacity }: { opacity: ReturnType<typeof useTransform<number, number>> }) => {
  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity }}>
      {/* Bottom border — inset by side border widths, sits on top at corners */}
      <div className="absolute bottom-0 left-[28px] right-[28px] z-10 h-[28px] overflow-hidden">
        <div className="animate-marquee-horizontal flex whitespace-nowrap">
          <span className="massive-text text-[11px] leading-[28px] tracking-[0.3em] text-white/30 uppercase">
            {marqueeText}
          </span>
          <span className="massive-text text-[11px] leading-[28px] tracking-[0.3em] text-white/30 uppercase">
            {marqueeText}
          </span>
        </div>
      </div>

      {/* Left border — stops at bottom border */}
      <div className="absolute top-0 left-0 bottom-[28px] w-[28px] overflow-hidden" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
        <div className="animate-marquee-vertical-reverse flex h-max flex-col whitespace-nowrap">
          <span className="massive-text text-[11px] tracking-[0.3em] text-white/30 uppercase">
            {marqueeText}
          </span>
          <span className="massive-text text-[11px] tracking-[0.3em] text-white/30 uppercase">
            {marqueeText}
          </span>
        </div>
      </div>

      {/* Right border — stops at bottom border */}
      <div className="absolute top-0 right-0 bottom-[28px] w-[28px] overflow-hidden">
        <div className="animate-marquee-vertical-reverse flex h-max flex-col whitespace-nowrap" style={{ writingMode: "vertical-rl" }}>
          <span className="massive-text text-[11px] tracking-[0.3em] text-white/30 uppercase">
            {marqueeText}
          </span>
          <span className="massive-text text-[11px] tracking-[0.3em] text-white/30 uppercase">
            {marqueeText}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export const AboutHero = () => {
  const [heroScrollDistance, setHeroScrollDistance] = useState(0)
  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const heroWrapperTopRef = useRef(0)
  const heroScrollDistanceRef = useRef(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  useEffect(() => {
    const measure = () => {
      const dist = window.innerHeight * 0.75
      heroScrollDistanceRef.current = dist
      setHeroScrollDistance(dist)

      if (heroWrapperRef.current) {
        const rect = heroWrapperRef.current.getBoundingClientRect()
        heroWrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      }
    }

    requestAnimationFrame(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  const heroPinY = useTransform(activeY, (y: number) => {
    const T = heroWrapperTopRef.current
    const D = heroScrollDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const heroProgress = useTransform(activeY, (y: number) => {
    const T = heroWrapperTopRef.current
    const D = heroScrollDistanceRef.current
    if (D === 0) return 0
    return Math.max(0, Math.min(1, (y - T) / D))
  })

  const scale = useTransform(heroProgress, [0, 0.6, 1], [1, 4, 22])
  const textOpacity = useTransform(heroProgress, [0, 0.4, 0.75], [1, 1, 0])
  const textX = useTransform(heroProgress, [0, 0.5, 1], [0, -60, -250])
  const textY = useTransform(heroProgress, [0, 0.5, 1], [0, -40, -180])
  const textRotate = useTransform(heroProgress, [0, 0.5, 1], [0, -3, -8])
  const bgOpacity = useTransform(heroProgress, [0.5, 0.8], [1, 0])

  return (
    <div
      ref={heroWrapperRef}
      className="relative"
      style={{ height: `calc(${heroScrollDistance}px + 100vh)` }}
    >
      <motion.div
        style={{ y: heroPinY }}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      >
        <RipplingDotsCanvas opacity={bgOpacity} />
        <BorderMarquee opacity={bgOpacity} />

        <motion.h1
          className="massive-text relative z-10 text-center text-[12vw] text-white"
          style={{ scale, opacity: textOpacity, x: textX, y: textY, rotate: textRotate }}
        >
          WHO WE ARE
        </motion.h1>
      </motion.div>
    </div>
  )
}
