import { motion, useScroll, useTransform } from "motion/react"
import { lazy, Suspense, useRef } from "react"
import { ErrorBoundary } from "../../ui/error-boundary"
import { ScatteredImages } from "./scattered-images"

const LaptopScene = lazy(() => import("./laptop-scene"))

/**
 * 300vh section with a sticky 100vh stage: the 3D scene plays across the first
 * 200vh of scroll, then the stage scrolls away with the page.
 */
export const Hero = () => {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  // Backlight rises from below the screen and settles behind the model.
  const lightY = useTransform(progress, [0, 0.65, 1], ["50vh", "0vh", "0vh"])

  return (
    <section
      ref={ref}
      className="relative z-2 h-[300vh]"
      style={{ background: "radial-gradient(ellipse 80% 80% at 50% 42%, #0c0c18 0%, #000000 62%)" }}
    >
      <div className="pointer-events-none sticky top-0 h-screen overflow-hidden">
        <ScatteredImages progress={progress} />
        <div className="absolute top-[52%] left-1/2 h-[75vh] w-[70vw] -translate-1/2">
          <motion.div
            className="h-full w-full"
            style={{
              y: lightY,
              background:
                "radial-gradient(ellipse at center, rgba(210,230,255,0.18) 0%, rgba(170,205,255,0.08) 45%, transparent 72%)",
            }}
          />
        </div>
        {/* WebGL failures degrade to no model, never a blank page. */}
        <ErrorBoundary>
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <LaptopScene progress={progress} />
            </Suspense>
          </div>
        </ErrorBoundary>
        <span className="absolute inset-x-0 bottom-4 text-center text-xs font-bold tracking-[0.35em] text-white/15 uppercase">
          Scroll ↓
        </span>
      </div>
    </section>
  )
}
