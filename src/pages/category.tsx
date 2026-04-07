import { motion } from "motion/react"
import { Link, useParams } from "react-router"
import { TextReveal } from "../components/text-reveal"
import { CATEGORIES, type Project } from "../lib/categories"

// ─── Project card — same structure as CategoryCard, no bullet expansion ───────
const ProjectCard = ({
  project,
  categorySlug,
  className = "",
  index = 0,
}: {
  project: Project
  categorySlug: string
  className?: string
  index?: number
}) => (
  <Link to={`/portfolio/${categorySlug}/${project.slug}`} className="block">
    <motion.div
      className={`group relative overflow-hidden [backface-visibility:hidden] ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      {/* Background image */}
      <motion.img
        src={project.img}
        alt={project.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Permanent gradient from bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      {/* Bottom border line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />

      {/* Bottom-left overlay — identical pill language to portfolio cards */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
            <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-white/80" />
            {project.title}
          </span>
          <span className="bg-black/60 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white/50 uppercase backdrop-blur-sm">
            {project.descriptor}
          </span>
        </div>
      </div>
    </motion.div>
  </Link>
)

// ─── Category page ────────────────────────────────────────────────────────────
// 3 projects laid out as: full → 2-column split (mirrors portfolio pattern)
export const CategoryPage = () => {
  const { category: slug } = useParams<{ category: string }>()
  const category = CATEGORIES.find((c) => c.slug === slug)

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8">
        <TextReveal
          text="NOT FOUND"
          className="massive-text text-3xl md:text-6xl lg:text-8xl"
          immediate
        />
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
          className="mb-6 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase transition-colors hover:text-white"
        >
          ← Portfolio
        </Link>
        <TextReveal
          text={category.name.toUpperCase()}
          className="massive-text text-4xl leading-none md:text-7xl lg:text-9xl"
        />
      </section>

      {/* Overview section — headline / description + 4-col breakdown */}
      <section className="border-b border-white/10 px-8 py-20 md:px-16">
        {/* Top row: headline + description — uses same 4-col grid so description aligns with Execution below */}
        <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <h2 className="text-3xl leading-[1.15] font-bold tracking-tight md:col-span-2 md:text-4xl">
            {category.overview.headline}
          </h2>
          <p className="text-base leading-relaxed text-white/60 md:col-span-2 md:text-lg">
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
              <span className="mb-5 block text-xs font-bold tracking-[0.4em] text-white/40 uppercase">
                {label}
              </span>
              <p className="text-sm leading-relaxed text-white/60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project grid — px-8 + gap-8 matches portfolio page exactly */}
      <div className="flex flex-col gap-8 px-8 py-8 md:px-16">
        {/* Row 1 — full width */}
        <ProjectCard
          project={p0}
          categorySlug={category.slug}
          className="h-[62vh] md:h-[68vh]"
          index={0}
        />

        {/* Row 2 — 2 columns */}
        <div className="flex flex-col gap-8 md:flex-row">
          <ProjectCard
            project={p1}
            categorySlug={category.slug}
            className="h-[72vh] flex-1"
            index={1}
          />
          <ProjectCard
            project={p2}
            categorySlug={category.slug}
            className="h-[72vh] flex-1"
            index={2}
          />
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
