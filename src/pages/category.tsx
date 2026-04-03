import { motion } from "motion/react"
import { Link, useParams } from "react-router"
import { CATEGORIES, type Project } from "../lib/categories"
import { TextReveal } from "../components/text-reveal"

// ─── Project card — same structure as CategoryCard, no bullet expansion ───────
const ProjectCard = ({
  project,
  className = "",
  index = 0,
}: {
  project: Project
  className?: string
  index?: number
}) => (
  <motion.div
    className={`group relative block overflow-hidden ${className}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{
      duration: 0.7,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    }}
  >
    {/* Background image */}
    <img
      src={project.img}
      alt={project.title}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />

    {/* Permanent gradient from bottom */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

    {/* Bottom-left overlay — identical pill language to portfolio cards */}
    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-[9px] font-bold tracking-[0.22em] uppercase text-white backdrop-blur-sm">
          <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-white/80" />
          {project.title}
        </span>
        <span className="bg-black/60 px-2.5 py-1 text-[9px] font-bold tracking-[0.22em] uppercase text-white/45 backdrop-blur-sm">
          {project.descriptor}
        </span>
      </div>
    </div>

    {/* Top-right CTA chip — appears on hover */}
    <div className="absolute right-5 top-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <span className="block bg-white px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase text-black">
        View Work →
      </span>
    </div>
  </motion.div>
)

// ─── Category page ────────────────────────────────────────────────────────────
// 3 projects laid out as: full → 2-column split (mirrors portfolio pattern)
export const CategoryPage = () => {
  const { category: slug } = useParams<{ category: string }>()
  const category = CATEGORIES.find((c) => c.slug === slug)

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8">
        <TextReveal text="NOT FOUND" className="massive-text text-[8vw]" immediate />
        <Link to="/portfolio" className="btn-industrial">
          ← Back to Portfolio
        </Link>
      </div>
    )
  }

  const [p0, p1, p2] = category.projects

  return (
    <div className="pt-32">
      {/* Header — same structure as portfolio header */}
      <section className="border-b border-white/10 px-8 pb-16 md:px-16">
        <Link
          to="/portfolio"
          className="mb-6 block text-[9px] font-bold tracking-[0.4em] uppercase text-white/30 transition-colors hover:text-white"
        >
          ← Portfolio
        </Link>
        <TextReveal
          text={category.name.toUpperCase()}
          className="massive-text text-[clamp(3rem,10vw,9rem)] leading-none"
        />
      </section>

      {/* Overview section — headline / description + 4-col breakdown */}
      <section className="border-b border-white/10 px-8 py-20 md:px-16">
        {/* Top row: headline + description */}
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl">
            {category.overview.headline}
          </h2>
          <p className="text-base leading-relaxed text-white/55 md:text-lg">
            {category.overview.description}
          </p>
        </div>

        {/* Bottom row: 4-col breakdown */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {(
            [
              { label: "Problem", body: category.overview.problem },
              { label: "Solution", body: category.overview.solution },
              { label: "Execution", body: category.overview.execution },
              { label: "Results", body: category.overview.results },
            ] as const
          ).map(({ label, body }) => (
            <div key={label}>
              <span className="mb-5 block text-[9px] font-bold tracking-[0.4em] uppercase text-white/35">
                {label}
              </span>
              <p className="text-sm leading-relaxed text-white/55">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project grid — px-8 + gap-8 matches portfolio page exactly */}
      <div className="flex flex-col gap-8 px-4 py-8 md:px-8">

        {/* Row 1 — full width */}
        <ProjectCard project={p0} className="h-[62vh] md:h-[68vh]" index={0} />

        {/* Row 2 — 2 columns */}
        <div className="flex flex-col gap-8 md:flex-row">
          <ProjectCard project={p1} className="h-[72vh] flex-1" index={1} />
          <ProjectCard project={p2} className="h-[72vh] flex-1" index={2} />
        </div>

      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between border-t border-white/10 px-8 py-16 md:px-16">
        <Link to="/portfolio" className="btn-industrial">
          ← All Categories
        </Link>
        <Link to="/contact" className="btn-industrial">
          Start a Project →
        </Link>
      </div>
    </div>
  )
}
