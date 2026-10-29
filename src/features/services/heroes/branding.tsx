import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { FitTitle } from "../../../ui/fit-title"
import type { HeroProps } from "./types"

const COUNT = 10
const INTERVAL_MS = 3000
const images = Array.from({ length: COUNT }, (_, i) => `/heroes/branding/billboard-${i + 1}.jpg`)

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
            className="absolute inset-0 h-full w-full object-cover select-none"
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
        className={`${onName ? "" : "pointer-events-none"} absolute inset-x-0 bottom-0 z-10 translate-y-1/2 text-white`}
      >
        <FitTitle text={service.name} immediate onCommit={onName} />
      </div>
    </section>
  )
}
