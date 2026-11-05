import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { FitTitle } from "../../../ui/fit-title"
import type { HeroProps } from "./types"

const COUNT = 10
const INTERVAL_MS = 3000
const images = Array.from({ length: COUNT }, (_, i) => `/heroes/branding/billboard-${i + 1}.jpg`)

// Photos are 3:2 with the billboard spanning ~57% of the width. Cover the screen when it's landscape,
// but cap the width at 167vw so portrait screens still show the whole billboard (edges fade to black).

export const BrandingHero = ({ service, onName }: HeroProps) => {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % COUNT), INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative h-screen bg-black">
      {images.map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={i}
            src={images[i]}
            alt=""
            className="absolute top-1/2 left-1/2 h-auto w-[max(100vw,min(150vh,167vw))] max-w-none -translate-1/2 mask-y-from-85% select-none"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black to-transparent" />
      </div>
      <div
        className={`${onName ? "" : "pointer-events-none"} absolute inset-x-0 bottom-0 z-10 translate-y-1/2 text-white max-md:top-[calc(50%+58vw)] max-md:bottom-auto max-md:translate-y-0 max-md:px-[8%]`}
      >
        <FitTitle text={service.name} immediate onCommit={onName} />
      </div>
    </section>
  )
}
