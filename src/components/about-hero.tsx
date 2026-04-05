import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useSmoothScroll } from "./smooth-scroll"

const marqueeText = Array(8)
  .fill("SOCIAL SATISFACTION")
  .join(" \u2022 ")
  .concat(" \u2022 ")

const BorderMarquee = ({ opacity }: { opacity: ReturnType<typeof useTransform<number, number>> }) => {
  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity }}>
      {/* Bottom border — inset by side border widths */}
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
      const dist = window.innerHeight * 0.5
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

  const scale = useTransform(heroProgress, [0, 0.5, 1], [1, 5, 28])
  const textOpacity = useTransform(heroProgress, [0, 0.35, 0.65], [1, 1, 0])
  const bgOpacity = useTransform(heroProgress, [0.4, 0.75], [1, 0])

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
        <BorderMarquee opacity={bgOpacity} />

        <motion.h1
          className="relative z-10 text-center text-[12vw] font-sans font-black uppercase tracking-tight text-white"
          style={{ scale, opacity: textOpacity }}
        >
          WHO WE ARE
        </motion.h1>
      </motion.div>
    </div>
  )
}
