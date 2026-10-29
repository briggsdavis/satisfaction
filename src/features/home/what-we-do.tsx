import { useQuery } from "convex/react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react"
import { useRef, useState, type ReactNode } from "react"
import { api } from "../../../convex/_generated/api"
import { useMobile } from "../../lib/hooks"
import { Link } from "../../ui/link"
import { TextReveal } from "../../ui/text-reveal"

const body = "max-w-lg text-lg leading-relaxed font-light whitespace-pre-line text-white/70"
const label = "text-xs font-bold tracking-[0.35em] text-white/40 uppercase"

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    className="relative flex flex-col md:absolute md:inset-0 md:flex-row"
  >
    <div className="flex items-center border-b border-white/10 px-8 pt-10 pb-4 md:w-[42%] md:border-b-0 md:px-16 md:py-16">
      <TextReveal
        text={title}
        className="massive-text text-2xl leading-none md:text-5xl lg:text-8xl"
        immediate
      />
    </div>
    <div className="flex flex-1 flex-col justify-center gap-6 px-8 pt-4 pb-16 md:px-16 md:py-12">
      {children}
      <Link to="/about" className="btn-industrial-sm inline-block self-start">
        About Us →
      </Link>
    </div>
  </motion.div>
)

/** Two panels that swap halfway through a short (25vh) sticky pin on desktop; stacked on mobile. */
export const WhatWeDoSection = () => {
  const mobile = useMobile()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const whatWeDo = useQuery(api.site.get)?.whatWeDo
  const [second, setSecond] = useState(false)
  // Hysteresis avoids flicker around the threshold.
  useMotionValueEvent(progress, "change", (p) => setSecond((was) => (was ? p > 0.4 : p > 0.5)))
  const cue = useTransform(progress, [0.8, 1], [1, 0])

  return (
    <div ref={ref} className="relative md:h-[125vh]">
      <div className="relative bg-black md:sticky md:top-0 md:h-screen md:overflow-hidden">
        <AnimatePresence mode={mobile ? "sync" : "wait"} initial={false}>
          {(mobile || !second) && (
            <Panel key="what" title="What we do">
              <p className={body}>{whatWeDo?.body}</p>
            </Panel>
          )}
          {(mobile || second) && (
            <Panel key="why" title="Why we're different">
              <div className="flex flex-col gap-8 md:flex-row md:gap-0">
                {[whatWeDo?.left, whatWeDo?.right].map((column, i) => (
                  <div
                    key={i}
                    className={`space-y-3 md:flex-1 ${i ? "md:border-l md:border-white/10 md:pl-8" : "md:pr-8"}`}
                  >
                    <p className={label}>{column?.label}</p>
                    <p className={body}>{column?.body}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </AnimatePresence>
        <motion.div
          style={{ opacity: cue }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-xs font-bold tracking-[0.4em] text-white/15 uppercase md:block"
        >
          Scroll ↓
        </motion.div>
      </div>
    </div>
  )
}
