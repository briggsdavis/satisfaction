import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { api } from "../../../convex/_generated/api"
import { chunk } from "../../lib/chunk"
import { preload } from "../../lib/convex"
import { ease } from "../../lib/motion"
import type { Service } from "../../lib/types"
import { Link } from "../../ui/link"
import { PageHeader } from "../../ui/page"

export const loader = async () => {
  await preload(api.services.list)
  return null
}

const Card = ({ service, className }: { service: Service; className: string }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={`/portfolio/${service.slug}`}
      className={`group relative block overflow-hidden rounded-[16px] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {service.imageUrl && (
        <motion.img
          src={service.imageUrl}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.7, ease }}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/95 via-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-x-0 bottom-0 p-6 md:p-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease }}
          >
            <ul className="mb-5 space-y-1.5">
              {service.bullets.map((bullet, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.3, ease }}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-white/70 lowercase"
                >
                  <span className="mt-[3px] shrink-0 text-white/30">-</span>
                  {bullet}
                </motion.li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
              <span className="h-1.5 w-1.5 shrink-0" style={{ backgroundColor: service.color }} />
              {service.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  )
}

// Rows repeat full / pair / wide-over-two: 11 services per cycle.
const TEMPLATE = ["full", "pair", "wide", "pair", "full", "pair"] as const
const SIZES = { full: 1, pair: 2, wide: 3 }

export const Component = () => {
  const services = useQuery(api.services.list) ?? []

  return (
    <div className="pt-32">
      <PageHeader title="PORTFOLIO" eyebrow="Selected Work" />
      <div className="flex flex-col gap-4 px-8 py-8 md:px-16">
        {chunk(services, TEMPLATE, SIZES).map(({ kind, items: [a, b, c], index }) => {
          if (kind === "full")
            return (
              <Card key={index} service={a} className="aspect-4/3 md:aspect-auto md:h-[42vh]" />
            )
          if (kind === "pair")
            return (
              <div key={index} className="flex gap-4">
                <Card
                  service={a}
                  className={`${b ? "aspect-3/4" : "aspect-4/3"} flex-1 md:aspect-auto md:h-[56vh]`}
                />
                {b && <Card service={b} className="aspect-3/4 flex-1 md:aspect-auto md:h-[56vh]" />}
              </div>
            )
          return (
            <div key={index} className="flex flex-col gap-4">
              <Card service={a} className="aspect-video md:aspect-auto md:h-[40vh]" />
              <div className="flex gap-4">
                {b && (
                  <Card
                    service={b}
                    className={`${c ? "aspect-square" : "aspect-4/3"} flex-1 md:aspect-auto md:h-[34vh]`}
                  />
                )}
                {c && (
                  <Card service={c} className="aspect-square flex-1 md:aspect-auto md:h-[34vh]" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
