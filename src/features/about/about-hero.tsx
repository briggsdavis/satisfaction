import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

// Ends with separator so the seam between two copies is identical to all other gaps
const marqueeText = Array(10).fill("SOCIAL SATISFACTION").join("  \u00B7  ").concat("  \u00B7  ")

const spanClass = "massive-text text-xs tracking-[0.25em] text-white/30 uppercase whitespace-nowrap"

const BorderMarquee = ({ opacity }: { opacity: MotionValue<number> }) => {
  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity }}>
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

/** Fixed "WHO WE ARE" overlay that zooms through over the first half-viewport of scroll. */
export const AboutHero = () => {
  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, (y) => Math.min(1, y / (window.innerHeight * 0.5)))
  // Cut the overlay away almost instantly once the zoom completes.
  const opacity = useTransform(scrollY, (y) => {
    const end = window.innerHeight * 0.5
    return Math.min(1, Math.max(0, 1 - (y - end) / 6))
  })
  const scale = useTransform(progress, [0, 0.5, 1], [1, 5, 28])
  const textOpacity = useTransform(progress, [0, 0.35, 0.65], [1, 1, 0])
  const bgOpacity = useTransform(progress, [0.4, 0.75], [1, 0])

  return (
    <>
      {/* In-flow spacer: the scroll range the zoom plays over. */}
      <div className="h-[50vh]" />
      <motion.div
        style={{ opacity }}
        className="pointer-events-none fixed inset-0 z-998 flex items-center justify-center overflow-hidden bg-black"
      >
        <BorderMarquee opacity={bgOpacity} />
        <motion.h1
          className="relative z-10 text-center font-display text-4xl font-black tracking-tight text-white uppercase md:text-7xl lg:text-9xl"
          style={{ scale, opacity: textOpacity }}
        >
          WHO WE ARE
        </motion.h1>
      </motion.div>
    </>
  )
}
