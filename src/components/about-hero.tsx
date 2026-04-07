import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useSmoothScroll } from "./smooth-scroll"

// Ends with separator so the seam between two copies is identical to all other gaps
const marqueeText = Array(10)
  .fill("SOCIAL SATISFACTION")
  .join("  \u00B7  ")
  .concat("  \u00B7  ")

const spanClass =
  "massive-text text-xs tracking-[0.25em] text-white/30 uppercase whitespace-nowrap"

const BorderMarquee = ({
  opacity,
}: {
  opacity: ReturnType<typeof useTransform<number, number>>
}) => {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ opacity }}
    >
      {/* Bottom — horizontal, inset so corners don't overlap */}
      <div className="absolute right-[28px] bottom-0 left-[28px] z-10 h-[28px] overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          }}
        >
          <span className={`${spanClass} leading-[28px]`}>{marqueeText}</span>
          <span className={`${spanClass} leading-[28px]`} aria-hidden>
            {marqueeText}
          </span>
        </motion.div>
      </div>

      {/* Left — vertical, writing-mode on the outer div; flex (= row = inline axis = vertical stacking in vertical-rl) */}
      <div
        className="absolute top-0 bottom-[28px] left-0 w-[28px] overflow-hidden"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        <motion.div
          className="flex"
          animate={{ y: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          }}
          style={{ willChange: "transform" }}
        >
          <span className={spanClass}>{marqueeText}</span>
          <span className={spanClass} aria-hidden>
            {marqueeText}
          </span>
        </motion.div>
      </div>

      {/* Right — same but without rotation */}
      <div
        className="absolute top-0 right-0 bottom-[28px] w-[28px] overflow-hidden"
        style={{ writingMode: "vertical-rl" }}
      >
        <motion.div
          className="flex"
          animate={{ y: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          }}
          style={{ willChange: "transform" }}
        >
          <span className={spanClass}>{marqueeText}</span>
          <span className={spanClass} aria-hidden>
            {marqueeText}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export const AboutHero = () => {
  const [scrollDistance, setScrollDistance] = useState(
    () => window.innerHeight * 0.5,
  )
  const scrollDistanceRef = useRef(scrollDistance)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  useEffect(() => {
    const update = () => {
      scrollDistanceRef.current = window.innerHeight * 0.5
      setScrollDistance(window.innerHeight * 0.5)
    }
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const heroProgress = useTransform(activeY, (y: number) => {
    const D = scrollDistanceRef.current
    if (D === 0) return 0
    return Math.max(0, Math.min(1, y / D))
  })

  // Cut the overlay away almost instantly after animation — near-zero transition
  const heroOpacity = useTransform(activeY, (y: number) => {
    const D = scrollDistanceRef.current
    if (y <= D) return 1
    if (y >= D + 6) return 0
    return 1 - (y - D) / 6
  })

  const scale = useTransform(heroProgress, [0, 0.5, 1], [1, 5, 28])
  const textOpacity = useTransform(heroProgress, [0, 0.35, 0.65], [1, 1, 0])
  const bgOpacity = useTransform(heroProgress, [0.4, 0.75], [1, 0])

  return (
    <>
      {/* Spacer gives the scroll range for the animation */}
      <div style={{ height: scrollDistance }} />

      {/* Fixed overlay — exits immediately after animation, no 100vh black hold */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center overflow-hidden bg-black"
      >
        <BorderMarquee opacity={bgOpacity} />
        <motion.h1
          className="relative z-10 text-center font-sans text-4xl font-black tracking-tight text-white uppercase md:text-7xl lg:text-9xl"
          style={{ scale, opacity: textOpacity }}
        >
          WHO WE ARE
        </motion.h1>
      </motion.div>
    </>
  )
}
