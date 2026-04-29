import { motion, useMotionValue, useTransform } from "motion/react"
import React, { useEffect, useRef } from "react"
import { Link, useNavigationType, useParams } from "react-router"
import { BrandingProcess } from "../components/branding-process"
import { BrandingProcessLoop } from "../components/branding-process-loop"
import { useSmoothScroll } from "../components/smooth-scroll"
import { TextReveal } from "../components/text-reveal"
import { CATEGORIES, type Category, type Project } from "../lib/categories"

// ─── CTA block ────────────────────────────────────────────────────────────────
const CTA_COPY = [
  "Secure your Design",
  "Book your Call",
  "Start your Project",
  "Let's Work Together",
] as const

const CtaBlock = ({
  className = "",
  copyIndex = 0,
}: {
  className?: string
  copyIndex?: number
}) => (
  <Link
    to="/contact"
    className={`group relative flex items-center justify-center border border-white/80 bg-black transition-all duration-500 hover:bg-white ${className}`}
  >
    <span className="text-center text-lg font-bold tracking-[0.25em] text-white uppercase transition-colors duration-500 group-hover:text-black md:text-xl">
      {CTA_COPY[copyIndex % CTA_COPY.length]}
    </span>
  </Link>
)

// ─── Project card ─────────────────────────────────────────────────────────────
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
      className={`group relative overflow-hidden rounded-[16px] [backface-visibility:hidden] ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      <motion.img
        src={project.img}
        alt={project.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />
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

// ─── Grid item builder ────────────────────────────────────────────────────────
// CTAs occupy "small" masonry slots (slot % 3 === 2 in the [full,small,small] repeat).
// For 6+ projects: insert a CTA at every slot where slotIndex % 6 === 5.
//   (5 % 3 === 2 → always a small slot ✓)
// For fewer than 6 projects: splice one CTA at index 2 (also a small slot ✓).
type GridItem =
  | { kind: "project"; project: Project }
  | { kind: "cta"; copyIndex: number }

function buildGridItems(projects: Project[]): GridItem[] {
  const items: GridItem[] = []
  let projectIdx = 0
  let ctaCopyIdx = 0
  let slotIdx = 0
  let ctaInserted = false

  while (projectIdx < projects.length) {
    if (slotIdx % 6 === 5) {
      items.push({ kind: "cta", copyIndex: ctaCopyIdx++ })
      ctaInserted = true
    } else {
      items.push({ kind: "project", project: projects[projectIdx++] })
    }
    slotIdx++
  }

  // For short project lists (< 6), splice a CTA at position 2 (small slot)
  if (!ctaInserted && items.length >= 2) {
    items.splice(2, 0, { kind: "cta", copyIndex: 0 })
  }

  return items
}

// ─── Masonry grid ─────────────────────────────────────────────────────────────
// Renders items in the [full, small, small] repeating pattern.
const MasonryGrid = ({
  projects,
  categorySlug,
}: {
  projects: Project[]
  categorySlug: string
}) => {
  const items = buildGridItems(projects)
  const rows: React.ReactNode[] = []
  let i = 0
  let animIdx = 0

  while (i < items.length) {
    const fullItem = items[i]

    // Full-width row
    rows.push(
      <div key={`full-${i}`}>
        {fullItem.kind === "cta" ? (
          <CtaBlock
            className="h-[42vh]"
            copyIndex={fullItem.copyIndex}
          />
        ) : (
          <ProjectCard
            project={fullItem.project}
            categorySlug={categorySlug}
            className="h-[42vh]"
            index={animIdx++}
          />
        )}
      </div>,
    )
    i++
    if (i >= items.length) break

    // Pair row
    const left = items[i]
    const right = i + 1 < items.length ? items[i + 1] : undefined

    rows.push(
      <div key={`pair-${i}`} className="flex flex-col gap-4 md:flex-row">
        {left.kind === "cta" ? (
          <CtaBlock className="h-[56vh] flex-1" copyIndex={left.copyIndex} />
        ) : (
          <ProjectCard
            project={left.project}
            categorySlug={categorySlug}
            className="h-[56vh] flex-1"
            index={animIdx++}
          />
        )}
        {right &&
          (right.kind === "cta" ? (
            <CtaBlock className="h-[56vh] flex-1" copyIndex={right.copyIndex} />
          ) : (
            <ProjectCard
              project={right.project}
              categorySlug={categorySlug}
              className="h-[56vh] flex-1"
              index={animIdx++}
            />
          ))}
      </div>,
    )
    i += right ? 2 : 1
  }

  return <>{rows}</>
}

// ─── Hero header: centered title → sticks to top on scroll ───────────────────
//
// Two-phase crossfade driven by SmoothScroll's smoothY MotionValue:
//
// Phase 1  (smoothY < crossover)
//   Centered title has no y-transform — it scrolls up naturally with the page.
//   viewport_y = sectionTop + vh/2 − titleH/2 − smoothY
//
// Phase 2  (smoothY > crossover)
//   Pinned title: y = activeY counteracts the container's −smoothY translation,
//   keeping the element fixed at top-0 in the viewport (content below pt-24
//   clears the navbar).
//
// Crossover point: smoothY at which the centered title's top reaches navH (96px).
//   crossover = (vh − titleH) / 2 − navH
//
// A 60px opacity crossfade blends the two phases seamlessly.
const CategoryHero = ({ category }: { category: Category }) => {
  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY
  const navType = useNavigationType()
  const titleDelay = navType === "PUSH" ? 0.75 : 0

  const centeredRef = useRef<HTMLDivElement>(null)
  const crossoverRef = useRef(0)
  const NAV_H = 96 // px — matches pt-24
  const FADE = 30 // px half-width of crossfade

  useEffect(() => {
    const measure = () => {
      const titleH = centeredRef.current?.offsetHeight ?? 0
      crossoverRef.current = Math.max(
        0,
        (window.innerHeight - titleH) / 2 - NAV_H,
      )
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const centeredOpacity = useTransform(activeY, (y) => {
    const co = crossoverRef.current
    const lo = Math.max(0, co - FADE)
    const hi = co + FADE
    if (y <= lo) return 1
    if (y >= hi) return 0
    return 1 - (y - lo) / (hi - lo)
  })

  const pinnedOpacity = useTransform(activeY, (y) => {
    const co = crossoverRef.current
    const lo = Math.max(0, co - FADE)
    const hi = co + FADE
    if (y <= lo) return 0
    if (y >= hi) return 1
    return (y - lo) / (hi - lo)
  })

  return (
    <section className="relative h-screen">
      {/* Hero image — scrolls away with normal page flow */}
      <div className="absolute inset-0">
        <img
          src={category.img}
          alt={category.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Phase 1: centered — no y-transform, scrolls with the page */}
      <motion.div
        style={{ opacity: centeredOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-8 md:px-16"
      >
        <div ref={centeredRef} className="text-center">
          <TextReveal
            text={category.name.toUpperCase()}
            className="massive-text justify-center text-4xl leading-none md:text-7xl lg:text-9xl"
            slideFrom="left"
            delay={titleDelay}
          />
        </div>
      </motion.div>

      {/* Phase 2: pinned — y:activeY cancels -smoothY, locks element at top-0 */}
      <motion.div
        style={{ y: activeY, opacity: pinnedOpacity }}
        className="pointer-events-none absolute inset-x-0 top-0 z-50"
      >
        <div className="bg-gradient-to-b from-black/95 via-black/75 to-transparent px-8 pt-24 pb-20 text-center md:px-16 md:pt-28">
          <TextReveal
            text={category.name.toUpperCase()}
            className="massive-text justify-center text-4xl leading-none md:text-7xl lg:text-9xl"
            immediate
            slideFrom="left"
            delay={titleDelay}
          />
        </div>
      </motion.div>
    </section>
  )
}

// ─── Category page ────────────────────────────────────────────────────────────
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

  return (
    <div>
      {/* Hero — full-viewport with sticky title */}
      <CategoryHero category={category} />

      {/* Overview section */}
      <section className="border-b border-white/10 px-8 py-20 md:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <h2 className="text-3xl leading-[1.15] font-bold tracking-tight md:col-span-2 md:text-4xl">
            {category.overview.headline}
          </h2>
          <p className="text-base leading-relaxed text-white/60 md:col-span-2 md:text-lg">
            {category.overview.description}
          </p>
        </div>
      </section>

      {/* Branding-only: scroll-driven process line section */}
      {category.slug === "branding" && <BrandingProcess />}
      {/* Loop variant — placed directly below for A/B comparison */}
      {category.slug === "branding" && <BrandingProcessLoop />}

      {/* Project grid with CTA blocks */}
      <div className="flex flex-col gap-4 px-8 py-8 md:px-16">
        <MasonryGrid
          projects={category.projects}
          categorySlug={category.slug}
        />
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
