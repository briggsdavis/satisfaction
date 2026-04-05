import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useSmoothScroll } from "./smooth-scroll"

// Ends with separator so the seam between two copies is identical to all other gaps
const marqueeText = Array(10)
  .fill("SOCIAL SATISFACTION")
  .join("  \u00B7  ")
  .concat("  \u00B7  ")

const spanClass = "massive-text text-[11px] tracking-[0.25em] text-white/30 uppercase whitespace-nowrap"

const BorderMarquee = ({ opacity }: { opacity: ReturnType<typeof useTransform<number, number>> }) => {
  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity }}>

      {/* Bottom — horizontal, inset so corners don't overlap */}
      <div className="absolute bottom-0 left-[28px] right-[28px] z-10 h-[28px] overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" }}
        >
          <span className={`${spanClass} leading-[28px]`}>{marqueeText}</span>
          <span className={`${spanClass} leading-[28px]`} aria-hidden>{marqueeText}</span>
        </motion.div>
      </div>

      {/* Left — vertical, writing-mode on the outer div; flex (= row = inline axis = vertical stacking in vertical-rl) */}
      <div
        className="absolute left-0 top-0 bottom-[28px] w-[28px] overflow-hidden"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        <motion.div
          className="flex"
          animate={{ y: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" }}
          style={{ willChange: "transform" }}
        >
          <span className={spanClass}>{marqueeText}</span>
          <span className={spanClass} aria-hidden>{marqueeText}</span>
        </motion.div>
      </div>

      {/* Right — same but without rotation */}
      <div
        className="absolute right-0 top-0 bottom-[28px] w-[28px] overflow-hidden"
        style={{ writingMode: "vertical-rl" }}
      >
        <motion.div
          className="flex"
          animate={{ y: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" }}
          style={{ willChange: "transform" }}
        >
          <span className={spanClass}>{marqueeText}</span>
          <span className={spanClass} aria-hidden>{marqueeText}</span>
        </motion.div>
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
