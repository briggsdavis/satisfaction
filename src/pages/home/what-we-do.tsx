import { useQuery } from "convex/react"
import { AnimatePresence, motion, useMotionValueEvent, useTransform } from "motion/react"
import { useRef, useState } from "react"
import { Link } from "react-router"
import { api } from "../../../convex/_generated/api"
import { TextReveal } from "../../components/text-reveal"
import { usePinnedScroll } from "../../hooks/use-pinned-scroll"

const whatWeDoDistance = () => window.innerHeight * 0.25

export const WhatWeDoSection = () => {
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
    <div ref={wrapperRef} style={{ height: `calc(${pinDistance}px + 100vh)` }} className="relative">
      <motion.div style={{ y: pinY }} className="relative h-screen overflow-hidden bg-black">
        <AnimatePresence mode="wait" initial={false}>
          {!showSecond ? (
            <motion.div
              key="panel1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex flex-col md:flex-row"
            >
              <div className="flex items-center border-b border-white/10 px-8 py-16 md:w-[42%] md:border-b-0 md:px-16">
                <TextReveal
                  text="What we do"
                  className="massive-text text-2xl leading-none md:text-5xl lg:text-8xl"
                  immediate
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-8 px-8 py-12 md:px-16">
                <p className="max-w-lg text-lg leading-relaxed font-light whitespace-pre-line text-white/70">
                  {homepage?.whatWeDoPanel1Body}
                </p>
                <Link to="/about" className="btn-industrial-sm inline-block self-start">
                  About Us →
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="panel2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex flex-col md:flex-row"
            >
              <div className="flex items-center border-b border-white/10 px-8 py-16 md:w-[42%] md:border-b-0 md:px-16">
                <TextReveal
                  text="Why we're different"
                  className="massive-text text-2xl leading-none md:text-5xl lg:text-8xl"
                  immediate
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-8 px-8 py-12 md:px-16">
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold tracking-[0.4em] text-white/15 uppercase"
        >
          Scroll ↓
        </motion.div>
      </motion.div>
    </div>
  )
}
