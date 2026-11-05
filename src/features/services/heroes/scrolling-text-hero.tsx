import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { FitTitle } from "../../../ui/fit-title"

const SECONDS_PER_ITEM = 3.5

/** A full-screen wall of repeating full-width text that scrolls vertically, forever. */
export const ScrollingTextHero = ({ text }: { text: string }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const [repeats, setRepeats] = useState(0)
  const label = text.toUpperCase()

  // Each half of the list must be at least as tall as the viewport so no gap ever shows.
  useEffect(() => {
    const section = sectionRef.current
    const item = itemRef.current
    if (!section || !item) return
    const measure = () => {
      const itemHeight = item.offsetHeight
      // Wait until FitTitle has sized the text, otherwise the height is wrong.
      if (itemHeight > 0 && (item.firstElementChild as HTMLElement | null)?.style.fontSize)
        setRepeats(Math.ceil(section.clientHeight / itemHeight) + 1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(section)
    ro.observe(item)
    return () => ro.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="pointer-events-none relative h-screen overflow-hidden">
      {/* Invisible probe used to measure one row. */}
      <div
        ref={itemRef}
        aria-hidden
        className="invisible absolute inset-x-0 top-0 w-screen px-4 py-3 md:py-0"
      >
        <FitTitle text={label} immediate />
      </div>
      {repeats > 0 && (
        <motion.div
          key={repeats}
          className="flex flex-col"
          animate={{ y: ["-50%", "0%"] }}
          transition={{
            duration: repeats * SECONDS_PER_ITEM,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {Array.from({ length: repeats * 2 }).map((_, i) => (
            <div key={i} className="w-screen px-4 py-3 md:py-0">
              <FitTitle text={label} immediate />
            </div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
