import { useQuery } from "convex/react"
import { motion } from "motion/react"
import React, { useRef } from "react"
import { Link } from "react-router"
import { api } from "../../../convex/_generated/api"
import type { Doc, Id } from "../../../convex/_generated/dataModel"
import { TextReveal } from "../../components/text-reveal"

type Project = Doc<"projects">
type Category = Doc<"categories">

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

const ProjectImage = ({
  storageId,
}: {
  storageId: Id<"_storage"> | undefined
}) => {
  const url = useQuery(api.files.getUrl, storageId ? { storageId } : "skip")
  if (!url) return null
  return (
    <img
      src={url}
      alt=""
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
  )
}

const ProjectCard = ({
  project,
  category,
}: {
  project: Project
  category?: Category
}) => {
  const href = category
    ? `/portfolio/${category.slug}/${project.slug}`
    : `/portfolio`
  return (
    <Link
      to={href}
      className="group relative block h-full w-full overflow-hidden rounded-3xl bg-neutral-900"
    >
      <ProjectImage storageId={project.coverImage} />
      <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/65" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="px-6 text-center font-display text-sm tracking-[0.2em] text-white uppercase md:text-base">
          {project.title}
        </p>
      </div>
    </Link>
  )
}

// Repeating layout template: capacities [1, 2, 3, 2, 1, 2, 3, 2] = 16 per cycle.
type GroupKind = "tall" | "stacked" | "wideTwo"
const TEMPLATE: GroupKind[] = [
  "tall",
  "stacked",
  "wideTwo",
  "stacked",
  "tall",
  "stacked",
  "wideTwo",
  "stacked",
]
const GROUP_SIZE: Record<GroupKind, number> = {
  tall: 1,
  stacked: 2,
  wideTwo: 3,
}

const Group = ({
  kind,
  projects,
  categoryById,
  delayStart,
}: {
  kind: GroupKind
  projects: Project[]
  categoryById: Map<Id<"categories">, Category>
  delayStart: number
}) => {
  // Pick the first category each project belongs to (for the URL)
  const cat = (p: Project): Category | undefined =>
    p.categoryIds.length > 0 ? categoryById.get(p.categoryIds[0]) : undefined

  if (kind === "tall") {
    return (
      <motion.div
        className="h-full w-[260px] shrink-0 md:w-[280px]"
        {...animProps(delayStart)}
      >
        <ProjectCard project={projects[0]} category={cat(projects[0])} />
      </motion.div>
    )
  }

  if (kind === "stacked") {
    return (
      <div className="flex h-full w-[260px] shrink-0 flex-col gap-4 md:w-[280px]">
        <motion.div className="flex-1" {...animProps(delayStart)}>
          <ProjectCard project={projects[0]} category={cat(projects[0])} />
        </motion.div>
        {projects[1] && (
          <motion.div className="flex-1" {...animProps(delayStart + 0.06)}>
            <ProjectCard project={projects[1]} category={cat(projects[1])} />
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div
      className="flex h-full shrink-0 flex-col gap-4"
      style={{ width: "556px" }}
    >
      <motion.div className="flex-1" {...animProps(delayStart)}>
        <ProjectCard project={projects[0]} category={cat(projects[0])} />
      </motion.div>
      <div className="flex flex-1 gap-4">
        {projects[1] && (
          <motion.div className="flex-1" {...animProps(delayStart + 0.06)}>
            <ProjectCard project={projects[1]} category={cat(projects[1])} />
          </motion.div>
        )}
        {projects[2] && (
          <motion.div className="flex-1" {...animProps(delayStart + 0.12)}>
            <ProjectCard project={projects[2]} category={cat(projects[2])} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export const FeaturedCascade = () => {
  const projects = useQuery(api.portfolio.listFeaturedProjects) ?? []
  const categories = useQuery(api.portfolio.listCategories) ?? []
  const categoryById = new Map(categories.map((c) => [c._id, c] as const))

  const scrollRef = useRef<HTMLElement>(null)
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

  // Walk the template, slicing projects per group.
  const groups: { kind: GroupKind; slice: Project[]; delay: number }[] = []
  let i = 0
  let t = 0
  while (i < projects.length) {
    const kind = TEMPLATE[t % TEMPLATE.length]
    const size = GROUP_SIZE[kind]
    const slice = projects.slice(i, i + size)
    if (slice.length === 0) break
    groups.push({ kind, slice, delay: t * 0.06 })
    i += size
    t++
  }

  return (
    <section className="bg-black pt-12 pb-20">
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

      <section
        ref={scrollRef}
        aria-label="Featured projects"
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
          {groups.map((g, gi) => (
            <Group
              key={gi}
              kind={g.kind}
              projects={g.slice}
              categoryById={categoryById}
              delayStart={g.delay}
            />
          ))}
        </div>
      </section>

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
