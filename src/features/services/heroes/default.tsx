import { motion, useMotionValue, useScroll, useTransform } from "motion/react"
import { useEffect } from "react"
import { useTitleDelay, useSize } from "../../../lib/hooks"
import { FitTitle } from "../../../ui/fit-title"
import type { HeroProps } from "./types"

const NAV_H = 96
const FADE = 30

/**
 * Full-bleed image with a centered title that hands off to a fixed header
 * copy as it scrolls under the navbar.
 */
export const DefaultHero = ({ service, onName }: HeroProps) => {
  const delay = useTitleDelay()
  const [ref, title] = useSize<HTMLDivElement>()
  const titleHeight = useMotionValue(0)
  useEffect(() => titleHeight.set(title.height), [titleHeight, title.height])
  const { scrollY } = useScroll()
  // 0 -> 1 across a 60px window centred where the title meets the navbar.
  const handoff = useTransform(() => {
    const y = scrollY.get()
    const at = Math.max(0, (window.innerHeight - titleHeight.get()) / 2 - NAV_H)
    const from = Math.max(0, at - FADE)
    return Math.min(1, Math.max(0, (y - from) / (at + FADE - from)))
  })
  const centered = useTransform(handoff, (p) => 1 - p)
  const name = service.name.toUpperCase()
  const events = onName ? "" : "pointer-events-none"

  return (
    <section className="relative h-screen">
      <div className="absolute inset-0">
        {service.imageUrl && (
          <img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <motion.div
        style={{ opacity: centered }}
        className={`${events} absolute inset-0 flex items-center justify-center px-8 md:px-16`}
      >
        <div ref={ref} className="w-full text-center">
          <FitTitle text={name} slideFrom="left" delay={delay} onCommit={onName} />
        </div>
      </motion.div>
      <motion.div style={{ opacity: handoff }} className={`${events} fixed inset-x-0 top-0 z-50`}>
        <div className="bg-linear-to-b from-black/95 via-black/75 to-transparent px-8 pt-24 pb-20 text-center md:px-16 md:pt-28">
          <FitTitle text={name} immediate onCommit={onName} />
        </div>
      </motion.div>
    </section>
  )
}
