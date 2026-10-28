import { useQuery } from "convex/react"
import { AnimatePresence, motion, useMotionValueEvent, useTransform } from "motion/react"
import { useRef, useState } from "react"
import { Link } from "react-router"
import { api } from "../../../convex/_generated/api"
import { TextReveal } from "../../components/text-reveal"
import { useMobile } from "../../hooks/use-mobile"
import { usePinnedScroll } from "../../hooks/use-pinned-scroll"

const whatWeDoDistance = () => window.innerHeight * 0.25

export const WhatWeDoSection = () => {
  const mobile = useMobile()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { pinY, progress, pinDistance } = usePinnedScroll(wrapperRef, whatWeDoDistance)
  const homepage = useQuery(api.homepage.get)

  // Once scroll progress crosses the threshold, play the full transition.
  // Slight hysteresis avoids flicker when hovering around the threshold.
  const [showSecond, setShowSecond] = useState(false)
  useMotionValueEvent(progress, "change", (p) => {
    setShowSecond((prev) => (prev ? p > 0.4 : p > 0.5))
  })
  const indicatorOpacity = useTransform(progress, [0.8, 1], [1, 0])

  return (
    <div
      ref={wrapperRef}
      style={{ height: mobile ? "auto" : `calc(${pinDistance}px + 100vh)` }}
      className="relative"
    >
      <motion.div
        style={{ y: mobile ? 0 : pinY }}
        className="relative bg-black md:h-screen md:overflow-hidden"
      >
        <AnimatePresence mode={mobile ? "sync" : "wait"} initial={false}>
          {(mobile || !showSecond) && (
            <motion.div
              key="panel1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative flex flex-col md:absolute md:inset-0 md:flex-row"
            >
              <div className="flex items-center border-b border-white/10 px-8 pt-10 pb-4 md:w-[42%] md:border-b-0 md:px-16 md:py-16">
                <TextReveal
                  text="What we do"
                  className="massive-text text-2xl leading-none md:text-5xl lg:text-8xl"
                  immediate
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-6 px-8 pt-4 pb-16 md:px-16 md:py-12">
                <p className="max-w-lg text-lg leading-relaxed font-light whitespace-pre-line text-white/70">
                  {homepage?.whatWeDoPanel1Body}
                </p>
                <Link to="/about" className="btn-industrial-sm inline-block self-start">
                  About Us →
                </Link>
              </div>
            </motion.div>
          )}
          {(mobile || showSecond) && (
            <motion.div
              key="panel2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative flex flex-col md:absolute md:inset-0 md:flex-row"
            >
              <div className="flex items-center border-b border-white/10 px-8 pt-10 pb-4 md:w-[42%] md:border-b-0 md:px-16 md:py-16">
                <TextReveal
                  text="Why we're different"
                  className="massive-text text-2xl leading-none md:text-5xl lg:text-8xl"
                  immediate
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-6 px-8 pt-4 pb-16 md:px-16 md:py-12">
                <div className="flex flex-col gap-8 md:flex-row md:gap-0">
                  <div className="space-y-3 md:flex-1 md:pr-8">
                    <p className="text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
                      {homepage?.whatWeDoPanel2Col1Label}
                    </p>
                    <p className="max-w-lg text-lg leading-relaxed font-light whitespace-pre-line text-white/70">
                      {homepage?.whatWeDoPanel2Col1Body}
                    </p>
                  </div>
                  <div className="space-y-3 md:flex-1 md:border-l md:border-white/10 md:pl-8">
                    <p className="text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
                      {homepage?.whatWeDoPanel2Col2Label}
                    </p>
                    <p className="max-w-lg text-lg leading-relaxed font-light whitespace-pre-line text-white/70">
                      {homepage?.whatWeDoPanel2Col2Body}
                    </p>
                  </div>
                </div>
                <Link to="/about" className="btn-industrial-sm inline-block self-start">
                  About Us →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-xs font-bold tracking-[0.4em] text-white/15 uppercase md:block"
        >
          Scroll ↓
        </motion.div>
      </motion.div>
    </div>
  )
}
