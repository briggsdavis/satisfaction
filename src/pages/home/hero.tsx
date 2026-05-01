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

  // Radial backlight rises from below the screen and settles behind the model.
  // Using vh strings keeps this viewport-relative from the first render.
  const lightY = useTransform(
    scrollProgress,
    [0, 0.65, 1],
    ["50vh", "0vh", "0vh"],
  )

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[4]"
      style={{ y: scrollOffset }}
    >
      <ScatteredImages scrollProgress={scrollProgress} />

      {/* Scroll-driven white-blue backlight */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          top: "52%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "75vh",
          zIndex: 4,
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            y: lightY,
            background:
              "radial-gradient(ellipse at center, rgba(210,230,255,0.18) 0%, rgba(170,205,255,0.08) 45%, transparent 72%)",
          }}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 z-[5]">
        <LaptopScene scrollProgress={scrollProgress} />
      </div>
    </motion.div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const Hero = () => {
  const { content } = useContent()
  const { bottomLeft } = content.hero

  return (
    <section
      className="relative h-[300vh]"
      style={{
        background:
          "radial-gradient(ellipse 80% 80% at 50% 42%, #0c0c18 0%, #000000 62%)",
      }}
    >
      <div className="relative z-10 flex h-screen flex-col">
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
