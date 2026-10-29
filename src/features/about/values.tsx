import { useQuery } from "convex/react"
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react"
import { useRef, useState } from "react"
import { api } from "../../../convex/_generated/api"
import { ease } from "../../lib/motion"
import type { SiteData } from "../../lib/types"

// Hand-tuned stagger for the three cards.
const OFFSETS = ["mt-20", "mt-10", "mt-32"]

const Card = ({ value, index }: { value: SiteData["values"][number]; index: number }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"])

  return (
    <motion.div
      ref={ref}
      aria-expanded={open}
      className={`relative z-2 min-w-0 flex-1 cursor-pointer max-md:mt-0 ${OFFSETS[index]}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="relative aspect-2/3 w-full overflow-hidden">
        {value.imageUrl && (
          <motion.img
            src={value.imageUrl}
            alt={value.label}
            className="absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover will-change-transform"
            style={{ y }}
          />
        )}
        <span className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
          <span className="h-1.5 w-1.5 shrink-0 bg-white/80" />
          {value.label}
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-xs leading-relaxed text-white/60">{value.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export const Values = () => {
  const values = useQuery(api.site.get)?.values ?? []
  return (
    <div className="px-8 pt-[54px] pb-6 md:px-16 md:pt-[82px] md:pb-8">
      <div className="flex flex-col items-stretch gap-8 md:flex-row md:items-start md:gap-5">
        {values.map((value, i) => (
          <Card key={i} value={value} index={i} />
        ))}
      </div>
    </div>
  )
}
