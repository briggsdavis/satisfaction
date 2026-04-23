import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useState } from "react"
import { useContent } from "../../admin/context/content-context"
import { LaptopScene } from "../../components/laptop-scene"
import { ScatteredImages } from "../../components/scattered-images"
import { useSmoothScroll } from "../../components/smooth-scroll"

// ─── HeroCanvas ───────────────────────────────────────────────────────────────
export const HeroCanvas = () => {
  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY
  const [vh, setVh] = useState(0)

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Animation completes over 2vh of the 3vh hero
  const animationEnd = vh * 2
  const scrollProgress = useTransform(activeY, [0, animationEnd || 1], [0, 1])

  // Once animation is done, convert the scroll overshoot into a Y offset
  // so the canvas scrolls with the page
  const scrollOffset = useTransform(activeY, (y) =>
    y > animationEnd ? -(y - animationEnd) : 0,
  )

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[4]"
      style={{ y: scrollOffset }}
    >
      <ScatteredImages scrollProgress={scrollProgress} />

      <div className="pointer-events-none fixed inset-0 z-[5]">
        <LaptopScene scrollProgress={scrollProgress} />
      </div>
    </motion.div>
  )
}

// ─── HeroHeading ──────────────────────────────────────────────────────────────
export const HeroHeading = () => {
  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY
  const [vh, setVh] = useState(0)

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const animationEnd = vh * 2
  const scrollProgress = useTransform(activeY, [0, animationEnd || 1], [0, 1])
  const opacity = useTransform(scrollProgress, [0, 0.7], [1, 0])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[6] flex items-center justify-center"
      style={{ opacity }}
    >
      <h1 className="hero-shine-text massive-text font-black text-[11vw] leading-none select-none">
        SATISFACTION
      </h1>
    </motion.div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const Hero = () => {
  const { content } = useContent()
  const { topLeft, topRight, bottomLeft } = content.hero

  return (
    <section
      className="relative h-[300vh]"
      style={{
        background:
          "radial-gradient(ellipse 80% 80% at 50% 42%, #0c0c18 0%, #000000 62%)",
      }}
    >
      {/* Subtle centre glow — gives the iMac a slight halo effect */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "55vw",
          height: "55vh",
          background:
            "radial-gradient(ellipse at center, rgba(80,90,180,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex h-screen flex-col">
        {/* Top metadata bar */}
        <div className="flex items-start justify-between px-8 pt-28 pb-4 md:px-16">
          <div className="text-xs leading-relaxed font-bold tracking-[0.35em] whitespace-pre-line text-white/25 uppercase">
            {topLeft}
          </div>
          <div className="text-right text-xs leading-relaxed font-bold tracking-[0.35em] whitespace-pre-line text-white/25 uppercase">
            {topRight}
          </div>
        </div>

        {/* Flex spacer — HeroHeading is rendered above the canvas at z-[6] */}
        <div className="flex-1" />

        {/* Bottom metadata */}
        <div className="flex items-center justify-between px-8 py-4 md:px-16">
          <span className="text-xs font-bold tracking-[0.35em] text-white/15 uppercase">
            {bottomLeft}
          </span>
          <span className="text-xs font-bold tracking-[0.35em] text-white/15 uppercase">
            Scroll ↓
          </span>
        </div>
      </div>
    </section>
  )
}
