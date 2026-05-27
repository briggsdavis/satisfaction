import { motion } from "motion/react"
import type { Doc } from "../../../convex/_generated/dataModel"
import { FitTitle } from "../fit-title"

type Category = Doc<"categories">

const REPEATS = 18
const SECONDS_PER_ITEM = 3.5

export const SocialMediaHero = ({ category }: { category: Category }) => {
  const text = category.name.toUpperCase()
  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <img
          src="/mock/social/two-padded.png"
          alt=""
          className="h-[80%] w-auto max-w-none select-none"
          draggable={false}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <motion.div
          className="flex flex-col"
          animate={{ y: ["-50%", "0%"] }}
          transition={{ duration: REPEATS * SECONDS_PER_ITEM, ease: "linear", repeat: Infinity }}
        >
          {Array.from({ length: REPEATS * 2 }).map((_, i) => (
            <div key={i} className="w-screen px-4 py-3 md:py-0">
              <FitTitle text={text} immediate />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <img
          src="/mock/social/one-padded.png"
          alt=""
          className="h-[80%] w-auto max-w-none select-none"
          draggable={false}
        />
      </div>
    </section>
  )
}
