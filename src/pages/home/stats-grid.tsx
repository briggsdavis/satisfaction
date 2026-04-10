import { motion } from "motion/react"
import React, { useRef } from "react"
import { Link } from "react-router"

type ServiceCardDef = {
  service: string
  tag?: string
  inverted: boolean
  rotate: number
  delay: number
  img: string
}

const ALL_SERVICES: ServiceCardDef[] = [
  {
    service: "Creative Direction",
    inverted: true,
    rotate: -1,
    delay: 0,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
  },
  {
    service: "Photography",
    inverted: false,
    rotate: 0.75,
    delay: 0.08,
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
  },
  {
    service: "Branding & Visual Identity",
    tag: "Videography",
    inverted: true,
    rotate: -0.5,
    delay: 0.16,
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
  },
  {
    service: "Social Media",
    tag: "Videography",
    inverted: false,
    rotate: 1,
    delay: 0.24,
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
  },
  {
    service: "Emails",
    inverted: true,
    rotate: -0.75,
    delay: 0.32,
    img: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=800",
  },
  {
    service: "Graphic Design",
    inverted: false,
    rotate: 0.5,
    delay: 0.4,
    img: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&q=80&w=800",
  },
  {
    service: "Motion Graphics",
    inverted: true,
    rotate: -1.25,
    delay: 0.48,
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
  },
]

const ServicesGridCard = ({ card }: { card: ServiceCardDef }) => (
  <Link to="/services" className="group block">
    <motion.div
      style={{ borderRadius: 0, rotate: card.rotate }}
      className="relative aspect-[3/4] overflow-hidden ring-1 ring-white/20"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{
        duration: 0.65,
        delay: card.delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      {/* Background image */}
      <img
        src={card.img}
        alt={card.service}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      {/* Dark overlay — uniform across all cards */}
      <div className="absolute inset-0 bg-black/65 transition-opacity duration-500 group-hover:bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white md:p-7">
        {/* Top — discipline tag */}
        <div>
          {card.tag ? (
            <span className="text-xs font-bold tracking-[0.35em] text-white/60 uppercase">
              {card.tag}
            </span>
          ) : (
            <span className="block h-4" aria-hidden />
          )}
        </div>

        {/* Bottom — service name + rule */}
        <div>
          <div className="mb-3 h-px w-full bg-white/25" />
          <p className="font-display text-xl leading-tight uppercase md:text-2xl">
            {card.service}
          </p>
        </div>
      </div>
    </motion.div>
  </Link>
)

export const StatsGrid = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    const walk = (x - startX.current) * 1.5
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const stopDrag = () => {
    isDragging.current = false
  }

  return (
    <section className="relative overflow-hidden bg-black pt-16 pb-12">
      <p className="mb-10 px-8 text-xs font-bold tracking-[0.4em] text-white/30 uppercase md:px-16">
        Our Services
      </p>
      {/* Horizontal scroll track — shows ~3.5 cards */}
      <div
        ref={scrollRef}
        className="cursor-grab overflow-x-auto px-8 py-6 active:cursor-grabbing md:px-16"
        style={{ touchAction: "pan-x", overflowY: "clip" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {ALL_SERVICES.map((card, i) => (
            <div key={i} className="relative z-[2] w-[72vw] shrink-0 md:w-[26vw]">
              <ServicesGridCard card={card} />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 px-8 text-xs font-bold tracking-[0.35em] text-white/30 uppercase md:px-16">
        Scroll horizontally to see all services →
      </p>
    </section>
  )
}
