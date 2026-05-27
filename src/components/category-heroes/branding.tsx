import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import type { Doc } from "../../../convex/_generated/dataModel"

type Category = Doc<"categories">

const COUNT = 10
const INTERVAL_MS = 3000
const images = Array.from({ length: COUNT }, (_, i) => `/mock/branding/billboard-${i + 1}.jpg`)

export const BrandingHero = ({ category: _category }: { category: Category }) => {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % COUNT), INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {images.map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}
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
    </section>
  )
}
