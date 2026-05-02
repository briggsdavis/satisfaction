import { motion } from "motion/react"
import React, { useRef } from "react"
import { Link } from "react-router"
import { TextReveal } from "../../components/text-reveal"

type GridProject = {
  title: string
  descriptor: string
  img: string
  href: string
}

const GRID_PROJECTS: GridProject[] = [
  // — Group 1 (tall) —
  {
    title: "Harvest Menu Drop",
    descriptor: "Creative Direction",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/creative-direction/harvest-menu-drop",
  },
  // — Group 2 (stacked) —
  {
    title: "Hero Dish Series",
    descriptor: "Photography",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/photography/hero-dish-series",
  },
  {
    title: "Interior Story",
    descriptor: "Photography",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/photography/interior-story",
  },
  // — Group 3 (wide top + two bottom) —
  {
    title: "Noire Collective",
    descriptor: "Branding",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/branding/noire-collective",
  },
  {
    title: "Brand Film",
    descriptor: "Production",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/production/brand-film",
  },
  {
    title: "Grand Opening Kit",
    descriptor: "Campaigns",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/campaigns/grand-opening-kit",
  },
  // — Group 4 (stacked) —
  {
    title: "Monthly Retainer",
    descriptor: "Social Media",
    img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/social-media/monthly-retainer",
  },
  {
    title: "Grand Opening",
    descriptor: "Launch + Events",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/launch-event-marketing/grand-opening",
  },
  // — Group 5 (tall) —
  {
    title: "Summer Activation",
    descriptor: "Creative Direction",
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/creative-direction/summer-activation",
  },
  // — Group 6 (stacked) —
  {
    title: "Event Recap",
    descriptor: "Photography",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/photography/event-recap",
  },
  {
    title: "Gather & Co.",
    descriptor: "Branding",
    img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/branding/gather-and-co",
  },
  // — Group 7 (wide top + two bottom) —
  {
    title: "Fall Promo Suite",
    descriptor: "Campaigns",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/campaigns/fall-promo-suite",
  },
  {
    title: "Reel Pack",
    descriptor: "Production",
    img: "https://images.unsplash.com/photo-1536240478700-b869ad10e2c8?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/production/reel-pack",
  },
  {
    title: "Creator Collab",
    descriptor: "Influencer / UGC",
    img: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/influencer-ugc/creator-collab",
  },
  // — Group 8 (stacked) —
  {
    title: "Pop-Up Event",
    descriptor: "Launch + Events",
    img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/launch-event-marketing/pop-up-event",
  },
  {
    title: "Logo Pack",
    descriptor: "Motion Graphics",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
    href: "/portfolio/motion-graphics/logo-pack",
  },
]

const animProps = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: {
    duration: 0.75,
    delay,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
})

const ProjectCard = ({ project }: { project: GridProject }) => (
  <Link
    to={project.href}
    className="group relative block h-full w-full overflow-hidden rounded-3xl bg-neutral-900"
  >
    <img
      src={project.img}
      alt={project.title}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
    {/* Base dark overlay */}
    <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/65" />
    {/* Title — centered, fades in on hover */}
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <p className="px-6 text-center font-display text-sm tracking-[0.2em] text-white uppercase md:text-base">
        {project.title}
      </p>
      <span className="text-2xs font-bold tracking-[0.3em] text-white/60 uppercase">
        {project.descriptor}
      </span>
    </div>
  </Link>
)

export const FeaturedCascade = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftRef = useRef(0)

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    scrollLeftRef.current = scrollRef.current?.scrollLeft ?? 0
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    const walk = (x - startX.current) * 1.5
    if (scrollRef.current)
      scrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const stopDrag = () => {
    isDragging.current = false
  }

  const [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15] =
    GRID_PROJECTS

  return (
    <section className="bg-black pt-12 pb-20">
      {/* Header — keep exactly as before */}
      <div className="mb-12 flex items-end justify-between px-8 md:px-16">
        <div>
          <p className="mb-5 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
            Selected Work
          </p>
          <TextReveal
            text="Featured Projects"
            className="massive-text text-xl leading-none md:text-4xl lg:text-6xl"
          />
        </div>
        <Link
          to="/portfolio"
          className="btn-industrial-sm hidden items-center gap-2 md:inline-flex"
        >
          View All <span>→</span>
        </Link>
      </div>

      {/* Horizontal scroll masonry grid */}
      <div
        ref={scrollRef}
        className="cursor-grab overflow-x-auto px-8 active:cursor-grabbing md:px-16"
        style={{ touchAction: "pan-x", overflowY: "clip" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div
          className="flex gap-4"
          style={{ width: "max-content", height: "580px" }}
        >
          {/* Group 1: single tall card */}
          <motion.div
            className="h-full w-[260px] shrink-0 md:w-[280px]"
            {...animProps(0)}
          >
            <ProjectCard project={p0} />
          </motion.div>

          {/* Group 2: two stacked portrait cards */}
          <div className="flex h-full w-[260px] shrink-0 flex-col gap-4 md:w-[280px]">
            <motion.div className="flex-1" {...animProps(0.08)}>
              <ProjectCard project={p1} />
            </motion.div>
            <motion.div className="flex-1" {...animProps(0.14)}>
              <ProjectCard project={p2} />
            </motion.div>
          </div>

          {/* Group 3: wide landscape top + two portrait bottom */}
          <div
            className="flex h-full shrink-0 flex-col gap-4"
            style={{ width: "556px" }}
          >
            <motion.div className="flex-1" {...animProps(0.18)}>
              <ProjectCard project={p3} />
            </motion.div>
            <div className="flex flex-1 gap-4">
              <motion.div className="flex-1" {...animProps(0.24)}>
                <ProjectCard project={p4} />
              </motion.div>
              <motion.div className="flex-1" {...animProps(0.3)}>
                <ProjectCard project={p5} />
              </motion.div>
            </div>
          </div>

          {/* Group 4: two stacked portrait cards */}
          <div className="flex h-full w-[260px] shrink-0 flex-col gap-4 md:w-[280px]">
            <motion.div className="flex-1" {...animProps(0.36)}>
              <ProjectCard project={p6} />
            </motion.div>
            <motion.div className="flex-1" {...animProps(0.42)}>
              <ProjectCard project={p7} />
            </motion.div>
          </div>

          {/* Group 5: single tall card */}
          <motion.div
            className="h-full w-[260px] shrink-0 md:w-[280px]"
            {...animProps(0.48)}
          >
            <ProjectCard project={p8} />
          </motion.div>

          {/* Group 6: two stacked portrait cards */}
          <div className="flex h-full w-[260px] shrink-0 flex-col gap-4 md:w-[280px]">
            <motion.div className="flex-1" {...animProps(0.54)}>
              <ProjectCard project={p9} />
            </motion.div>
            <motion.div className="flex-1" {...animProps(0.58)}>
              <ProjectCard project={p10} />
            </motion.div>
          </div>

          {/* Group 7: wide landscape top + two portrait bottom */}
          <div
            className="flex h-full shrink-0 flex-col gap-4"
            style={{ width: "556px" }}
          >
            <motion.div className="flex-1" {...animProps(0.62)}>
              <ProjectCard project={p11} />
            </motion.div>
            <div className="flex flex-1 gap-4">
              <motion.div className="flex-1" {...animProps(0.66)}>
                <ProjectCard project={p12} />
              </motion.div>
              <motion.div className="flex-1" {...animProps(0.7)}>
                <ProjectCard project={p13} />
              </motion.div>
            </div>
          </div>

          {/* Group 8: two stacked portrait cards */}
          <div className="flex h-full w-[260px] shrink-0 flex-col gap-4 md:w-[280px]">
            <motion.div className="flex-1" {...animProps(0.74)}>
              <ProjectCard project={p14} />
            </motion.div>
            <motion.div className="flex-1" {...animProps(0.78)}>
              <ProjectCard project={p15} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="mt-10 flex justify-center px-8 md:hidden">
        <Link
          to="/portfolio"
          className="btn-industrial inline-flex items-center gap-3"
        >
          View All Projects <span className="text-sm">→</span>
        </Link>
      </div>
    </section>
  )
}
