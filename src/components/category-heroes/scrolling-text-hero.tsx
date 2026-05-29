import { motion } from "motion/react"
import { FitTitle } from "../fit-title"

const REPEATS = 18
const SECONDS_PER_ITEM = 3.5

/** A full-screen wall of repeating full-width text that scrolls vertically, forever. */
export const ScrollingTextHero = ({ text }: { text: string }) => {
  const label = text.toUpperCase()
  return (
    <section className="pointer-events-none relative h-screen overflow-hidden">
      <motion.div
        className="flex flex-col"
        animate={{ y: ["-50%", "0%"] }}
        transition={{ duration: REPEATS * SECONDS_PER_ITEM, ease: "linear", repeat: Infinity }}
      >
        {Array.from({ length: REPEATS * 2 }).map((_, i) => (
          <div key={i} className="w-screen px-4 py-3 md:py-0">
            <FitTitle text={label} immediate />
          </div>
        ))}
      </motion.div>
    </section>
  )
}
