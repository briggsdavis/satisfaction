import { motion } from "motion/react"
import { Link, useParams } from "react-router"
import { TextReveal } from "../components/text-reveal"
import { CATEGORIES } from "../lib/categories"

// ─── Project Page ─────────────────────────────────────────────────────────────
// Mirrors the category page layout exactly, but for a single project.
// 6 images: all 3 sibling project imgs + category header img + 2 crops of hero img.
export const ProjectPage = () => {
  const { category: categorySlug, project: projectSlug } = useParams<{
    category: string
    project: string
  }>()

  const category = CATEGORIES.find((c) => c.slug === categorySlug)
  const project = category?.projects.find((p) => p.slug === projectSlug)

  if (!category || !project) {
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

  // Build 6 images from available category assets — no extra data needed
  const siblings = category.projects.filter((p) => p.slug !== projectSlug)
  const images = [
    project.img.replace("w=1200", "w=1600"),
    siblings[0]?.img ?? project.img,
    siblings[1]?.img ?? category.img,
    category.img,
    project.img.replace("fit=crop", "fit=crop&crop=top"),
    siblings[0]?.img.replace("w=1200", "w=800&crop=bottom") ?? project.img,
  ]

  return (
    <div className="pt-32">
      {/* Header */}
      <section className="border-b border-white/10 px-8 pb-16 md:px-16">
        <Link
          to={`/portfolio/${category.slug}`}
          className="mb-6 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase transition-colors hover:text-white"
        >
          ← {category.name}
        </Link>
        <TextReveal
          text={project.title.toUpperCase()}
          className="massive-text text-4xl leading-none md:text-7xl lg:text-9xl"
        />
      </section>

      {/* Overview — descriptor + tags + description paragraph */}
      <section className="border-b border-white/10 px-8 py-20 md:px-16">
        {/* Top row: descriptor/tags + project overview — 4-col grid aligns overview with Execution below */}
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <span className="mb-3 block text-xs font-bold tracking-[0.4em] text-white/40 uppercase">
              {project.descriptor}
            </span>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/20 px-3 py-1 text-xs font-bold tracking-[0.3em] text-white/60 uppercase"
                >
                  {tag}
                </span>
              ))}
              <span className="border border-white/20 px-3 py-1 text-xs font-bold tracking-[0.3em] text-white/60 uppercase">
                {category.name}
              </span>
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="mb-4 block text-xs font-bold tracking-[0.4em] text-white/40 uppercase">
              Project Overview
            </span>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-base leading-relaxed text-white/60 md:text-lg"
            >
              {project.description}
            </motion.p>
          </div>
        </div>

        {/* 4-col context breakdown — matches category page structure */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {(
            [
              { label: "Category", body: category.overview.headline },
              { label: "Approach", body: category.overview.solution },
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

      {/* 6-image grid — same visual pattern as category page, extended */}
      <div className="flex flex-col gap-8 px-8 py-8 md:px-16">
        {/* Row 1 — full width */}
        <ImageCard
          img={images[0]}
          title={project.title}
          index={0}
          className="h-[62vh] md:h-[68vh]"
        />

        {/* Row 2 — 2 columns */}
        <div className="flex flex-col gap-8 md:flex-row">
          <ImageCard
            img={images[1]}
            title={project.title}
            index={1}
            className="h-[72vh] flex-1"
          />
          <ImageCard
            img={images[2]}
            title={project.title}
            index={2}
            className="h-[72vh] flex-1"
          />
        </div>

        {/* Row 3 — full width */}
        <ImageCard
          img={images[3]}
          title={project.title}
          index={3}
          className="h-[62vh] md:h-[68vh]"
        />

        {/* Row 4 — 2 columns */}
        <div className="flex flex-col gap-8 md:flex-row">
          <ImageCard
            img={images[4]}
            title={project.title}
            index={4}
            className="h-[72vh] flex-1"
          />
          <ImageCard
            img={images[5]}
            title={project.title}
            index={5}
            className="h-[72vh] flex-1"
          />
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between border-t border-white/10 px-8 py-16 md:px-16">
        <Link to={`/portfolio/${category.slug}`} className="btn-industrial">
          ← {category.name}
        </Link>
        <Link to="/contact" className="btn-industrial">
          Start a Project →
        </Link>
      </div>
    </div>
  )
}

// ─── Image Card ───────────────────────────────────────────────────────────────
const ImageCard = ({
  img,
  title,
  index,
  className = "",
}: {
  img: string
  title: string
  index: number
  className?: string
}) => (
  <motion.div
    className={`group relative block overflow-hidden ${className}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-150px" }}
    transition={{
      duration: 0.7,
      delay: (index % 3) * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    }}
  >
    <img
      src={img}
      alt={`${title} — image ${index + 1}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />
    <span className="absolute right-4 bottom-4 font-mono text-xs font-bold tracking-widest text-white/30">
      {String(index + 1).padStart(2, "0")}
    </span>
  </motion.div>
)
