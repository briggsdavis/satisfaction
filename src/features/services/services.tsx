import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { api } from "../../../convex/_generated/api"
import { preload } from "../../lib/convex"
import { useMobile } from "../../lib/hooks"
import { ease } from "../../lib/motion"
import type { Service } from "../../lib/types"
import { Link } from "../../ui/link"
import { PageHeader } from "../../ui/page"

export const loader = async () => {
  await preload(api.services.list)
  return null
}

const SIZE_HEIGHTS: Record<Service["size"], string> = {
  short: "min-h-[360px]",
  medium: "min-h-[420px]",
  tall: "min-h-[480px]",
  xtall: "min-h-[540px]",
}

const ServiceImage = ({
  src,
  alt,
  hovered,
}: {
  src: string | null
  alt: string
  hovered: boolean
}) => {
  const mobile = useMobile()
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700"
      onLoad={(event) => (event.currentTarget.style.opacity = "1")}
      style={{ opacity: mobile ? 0 : 1, transform: hovered ? "scale(1.05)" : "scale(1)" }}
    />
  )
}

const ServiceCell = ({ service, index }: { service: Service; index: number }) => {
  const mobile = useMobile()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link to={`/portfolio/${service.slug}`} className="group block">
      <motion.div
        className={`relative border-b-2 border-white/15 bg-black ${SIZE_HEIGHTS[service.size]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{
          duration: 0.6,
          delay: (index % 3) * 0.1,
          ease,
        }}
      >
        <motion.div
          className="absolute inset-3 overflow-hidden rounded-[16px]"
          animate={{ scale: mobile ? 1 : [1, 1.0194, 1] }}
          transition={{
            duration: 3.5 + (index % 4) * 0.65,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: index * 0.45,
          }}
        >
          <ServiceImage src={service.imageUrl} alt={service.name} hovered={isHovered} />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

          <motion.div
            className="pointer-events-none absolute inset-0 bg-black"
            animate={{ opacity: isHovered ? 0.4 : 0 }}
            transition={{ duration: 0.35 }}
          />

          <div className="absolute inset-0 flex flex-col p-5 md:p-6">
            <div className="flex flex-1 flex-col justify-end">
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3, ease }}
                    className="mb-4"
                  >
                    <ul className="space-y-1.5">
                      {service.bullets.map((bullet, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: i * 0.04,
                            duration: 0.3,
                            ease,
                          }}
                          className="flex list-none items-start gap-2 text-xs leading-relaxed text-white/80 lowercase"
                        >
                          <span className="mt-[3px] shrink-0 text-white/40">–</span>
                          {bullet}
                        </motion.li>
                      ))}
                    </ul>
                    <span className="mt-4 inline-block text-xs font-bold tracking-[0.2em] text-white/70 lowercase underline underline-offset-4 transition-opacity group-hover:text-white">
                      see portfolio
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <span className="block font-display text-3xl leading-[0.85] text-white uppercase md:text-4xl">
                {service.name}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}

export const Component = () => {
  const services = useQuery(api.services.list) ?? []

  return (
    <div className="pt-32">
      <PageHeader title="SERVICES" eyebrow="What We Do" rule="border-b-2 border-white/15" />
      <div className="flex flex-col divide-y-2 divide-white/15 md:flex-row md:divide-x-2 md:divide-y-0">
        {[0, 1, 2].map((col) => (
          <div key={col} className="flex flex-1 flex-col">
            {services
              .filter((_, i) => i % 3 === col)
              .map((service, row) => (
                <ServiceCell key={service._id} service={service} index={col + row * 3} />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
