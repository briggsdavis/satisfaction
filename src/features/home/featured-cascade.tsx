import { useQuery } from "convex/react"
import { motion } from "motion/react"
import { useRef } from "react"
import { api } from "../../../convex/_generated/api"
import { chunk } from "../../lib/chunk"
import { reveal } from "../../lib/motion"
import type { ProjectCard } from "../../lib/types"
import { useDragScroll } from "../../lib/use-drag-scroll"
import { Link } from "../../ui/link"
import { Eyebrow } from "../../ui/page"
import { TextReveal } from "../../ui/text-reveal"

const Card = ({ project, delay }: { project: ProjectCard; delay: number }) => (
  <motion.div
    className="min-h-0 flex-1"
    {...reveal(delay, 28, 0.75)}
    viewport={{ once: true, margin: "-80px" }}
  >
    <Link
      to={`/work/${project.slug}`}
      className="group relative block h-full w-full overflow-hidden rounded-3xl bg-neutral-900"
    >
      {project.coverUrl && (
        <img
          src={project.coverUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/65" />
      <p className="absolute inset-0 flex items-center justify-center px-6 text-center font-display text-sm tracking-[0.2em] text-white uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-base">
        {project.title}
      </p>
    </Link>
  </motion.div>
)

// Columns repeat tall / stacked / wide-over-two: 16 projects per cycle.
const TEMPLATE = ["tall", "stacked", "wide", "stacked"] as const
const SIZES = { tall: 1, stacked: 2, wide: 3 }

export const FeaturedCascade = () => {
  const projects = useQuery(api.projects.featured) ?? []
  const scrollRef = useRef<HTMLElement>(null)
  useDragScroll(scrollRef, { speed: 1.5 })

  return (
    <section className="relative z-10 bg-black pt-12 pb-20 md:z-auto">
      <div className="mb-12 flex items-end justify-between px-8 md:px-16">
        <div>
          <Eyebrow className="mb-5">Selected Work</Eyebrow>
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

      <section
        ref={scrollRef}
        aria-label="Featured projects"
        className="cursor-grab overflow-x-auto overflow-y-clip px-8 active:cursor-grabbing md:px-16"
      >
        <div className="flex h-[580px] w-max gap-4">
          {chunk(projects, TEMPLATE, SIZES).map(({ kind, items, index }) => {
            const delay = (i: number) => index * 0.06 + i * 0.06
            if (kind === "wide")
              return (
                <div key={index} className="flex h-full w-[556px] shrink-0 flex-col gap-4">
                  <Card project={items[0]} delay={delay(0)} />
                  {items.length > 1 && (
                    <div className="flex min-h-0 flex-1 gap-4">
                      {items.slice(1).map((p, i) => (
                        <Card key={p._id} project={p} delay={delay(i + 1)} />
                      ))}
                    </div>
                  )}
                </div>
              )
            return (
              <div
                key={index}
                className="flex h-full w-[260px] shrink-0 flex-col gap-4 md:w-[280px]"
              >
                {items.map((p, i) => (
                  <Card key={p._id} project={p} delay={delay(i)} />
                ))}
              </div>
            )
          })}
        </div>
      </section>

      <div className="mt-10 flex justify-center px-8 md:hidden">
        <Link to="/portfolio" className="btn-industrial inline-flex items-center gap-3">
          View All Projects <span className="text-sm">→</span>
        </Link>
      </div>
    </section>
  )
}
