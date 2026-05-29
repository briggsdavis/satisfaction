import { useQuery } from "convex/react"
import { motion } from "motion/react"
import { useRef } from "react"
import { Link } from "react-router"
import { api } from "../../../convex/_generated/api"
import type { Doc, Id } from "../../../convex/_generated/dataModel"
import { useDragScroll } from "../../hooks/use-drag-scroll"

type Service = Doc<"categories">

const CardImage = ({ storageId, alt }: { storageId: Id<"_storage"> | undefined; alt: string }) => {
  const url = useQuery(api.files.getUrl, storageId ? { storageId } : "skip")
  if (!url) return null
  return (
    <img
      src={url}
      alt={alt}
      draggable={false}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out select-none group-hover:scale-110"
    />
  )
}

const ServicesGridCard = ({
  service,
  rotate,
  delay,
}: {
  service: Service
  rotate: number
  delay: number
}) => (
  <Link to={`/portfolio/${service.slug}`} className="group block" draggable={false}>
    <motion.div
      style={{ borderRadius: 16, rotate }}
      className="relative aspect-[3/4] overflow-hidden ring-1 ring-white/20"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      <CardImage storageId={service.image} alt={service.name} />
      <div className="absolute inset-0 bg-black/65 transition-opacity duration-500 group-hover:bg-black/50" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white md:p-7">
        <div>
          <span className="block h-4" aria-hidden />
        </div>

        <div>
          <div className="mb-3 h-px w-full bg-white/25" />
          <p className="text-center font-display text-xl leading-tight uppercase md:text-2xl">
            {service.name}
          </p>
        </div>
      </div>
    </motion.div>
  </Link>
)

// Per-card rotation/delay are derived from the service's index so the
// carousel keeps its hand-tuned alternating rhythm at any service count.
const cardRotate = (i: number) => {
  const magnitudes = [2.5, 2, 1.5, 2.5, 2, 1.75, 1.75, 2.75, 2.25]
  const m = magnitudes[i % magnitudes.length]
  return i % 2 === 0 ? -m : m
}

export const ServicesCarousel = () => {
  const services = useQuery(api.portfolio.listCategories) ?? []
  const scrollRef = useRef<HTMLElement>(null)
  useDragScroll(scrollRef, { threshold: 5 })

  return (
    <section className="relative overflow-hidden bg-black pt-10 pb-12">
      <p className="mb-10 px-8 text-xs font-bold tracking-[0.4em] text-white/30 uppercase md:px-16">
        Our Services
      </p>
      <section
        ref={scrollRef}
        aria-label="Services"
        className="cursor-grab overflow-x-auto px-8 py-8 select-none active:cursor-grabbing md:px-16"
        style={{ touchAction: "pan-x", overflowY: "clip" }}
      >
        <div className="flex" style={{ width: "max-content" }}>
          {services.map((service, i) => (
            <div
              key={service._id}
              className="relative w-[72vw] shrink-0 md:w-[26vw]"
              style={{ marginLeft: i === 0 ? 0 : "-40px", zIndex: i + 1 }}
            >
              <ServicesGridCard service={service} rotate={cardRotate(i)} delay={i * 0.08} />
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
