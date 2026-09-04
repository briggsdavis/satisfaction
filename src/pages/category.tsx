import { useMutation, useQuery } from "convex/react"
import { ImagePlus } from "lucide-react"
import { motion, useMotionValue, useTransform } from "motion/react"
import React, { useEffect, useRef } from "react"
import { Link, useNavigationType, useParams, useSearchParams } from "react-router"
import { api } from "../../convex/_generated/api"
import type { Doc, Id } from "../../convex/_generated/dataModel"
import { BrandingProcess } from "../components/branding-process"
import { customCategoryHeroes } from "../components/category-heroes"
import { FitTitle } from "../components/fit-title"
import { MasonryGrid } from "../components/masonry-grid"
import { useSmoothScroll } from "../components/smooth-scroll"
import { TextReveal } from "../components/text-reveal"
// import { WebDevProcess } from "../components/web-dev-process"

type Category = Doc<"categories">
type Project = Doc<"projects">

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const ProjectImage = ({
  storageId,
  alt,
}: {
  storageId: Id<"_storage"> | undefined
  alt: string
}) => {
  const url = useQuery(api.files.getUrl, storageId ? { storageId } : "skip")
  if (!url) return null
  return (
    <motion.img
      src={url}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

const ProjectCard = ({
  project,
  categorySlug,
  index = 0,
}: {
  project: Project
  categorySlug: string
  index?: number
}) => (
  <Link to={`/portfolio/${categorySlug}/${project.slug}`} className="block h-full w-full min-w-0">
    <motion.div
      className="group relative h-full w-full overflow-hidden rounded-[16px] [backface-visibility:hidden]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      <ProjectImage storageId={project.coverImage} alt={project.title} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
            <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-white/80" />
            {project.title}
          </span>
        </div>
      </div>
    </motion.div>
  </Link>
)

const CategoryHero = ({
  category,
  onNameCommit,
}: {
  category: Category
  onNameCommit?: (name: string) => void
}) => {
  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY
  const navType = useNavigationType()
  const titleDelay = navType === "PUSH" ? 0.75 : 0
  const heroUrl = useQuery(
    api.files.getUrl,
    category.image ? { storageId: category.image } : "skip",
  )

  const centeredRef = useRef<HTMLDivElement>(null)
  const crossoverRef = useRef(0)
  const NAV_H = 96
  const FADE = 30

  useEffect(() => {
    const measure = () => {
      const titleH = centeredRef.current?.offsetHeight ?? 0
      crossoverRef.current = Math.max(0, (window.innerHeight - titleH) / 2 - NAV_H)
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
      <div className="absolute inset-0">
        {heroUrl && (
          <img src={heroUrl} alt={category.name} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <motion.div
        style={{ opacity: centeredOpacity }}
        className={`${onNameCommit ? "" : "pointer-events-none"} absolute inset-0 flex items-center justify-center px-8 md:px-16`}
      >
        <div ref={centeredRef} className="w-full text-center">
          <FitTitle
            text={category.name.toUpperCase()}
            slideFrom="left"
            delay={titleDelay}
            onCommit={onNameCommit}
          />
        </div>
      </motion.div>

      <motion.div
        style={{ y: activeY, opacity: pinnedOpacity }}
        className={`${onNameCommit ? "" : "pointer-events-none"} absolute inset-x-0 top-0 z-50`}
      >
        <div className="bg-gradient-to-b from-black/95 via-black/75 to-transparent px-8 pt-24 pb-20 text-center md:px-16 md:pt-28">
          <FitTitle
            text={category.name.toUpperCase()}
            slideFrom="left"
            delay={titleDelay}
            immediate
            onCommit={onNameCommit}
          />
        </div>
      </motion.div>
    </section>
  )
}

export const CategoryPage = () => {
  const { category: slug } = useParams<{ category: string }>()
  const [searchParams] = useSearchParams()
  const editing = searchParams.get("edit") === "1"
  const updateCategory = useMutation(api.portfolio.updateCategory)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const imageFileRef = useRef<HTMLInputElement>(null)
  const category = useQuery(api.portfolio.getCategoryBySlug, slug ? { slug } : "skip")
  const projects = useQuery(
    api.portfolio.listProjectsByCategory,
    category ? { categoryId: category._id } : "skip",
  )

  if (category === undefined || projects === undefined) return <div className="h-screen w-full" />

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

  const CustomHero = customCategoryHeroes[category.slug]
  const commitName = async (name: string) => {
    const nextSlug = slugify(name)
    await updateCategory({ id: category._id, name, slug: nextSlug })
    window.parent.postMessage({ type: "service-slug", slug: nextSlug }, window.location.origin)
  }
  const updateImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    const uploadUrl = await generateUploadUrl()
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })
    const { storageId } = (await response.json()) as { storageId: Id<"_storage"> }
    await updateCategory({ id: category._id, image: storageId })
  }

  return (
    <div
      onClickCapture={(event) => {
        if (editing && (event.target as Element).closest("a")) event.preventDefault()
      }}
    >
      {CustomHero ? (
        <CustomHero
          category={category}
          editing={editing}
          onNameCommit={editing ? commitName : undefined}
        />
      ) : (
        <CategoryHero category={category} onNameCommit={editing ? commitName : undefined} />
      )}

      {editing && (
        <section className="px-8 pt-8 md:px-16">
          <button
            type="button"
            onClick={() => imageFileRef.current?.click()}
            className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[16px] border border-dashed border-white/30 bg-white/5 text-white/50 hover:border-white/70 hover:text-white"
          >
            {category.image ? <ProjectImage storageId={category.image} alt="" /> : null}
            <span className="absolute flex items-center gap-2 bg-black/70 px-4 py-2 text-xs font-bold tracking-wider uppercase">
              <ImagePlus size={14} />
              {category.image ? "Change listing image" : "Add listing image"}
            </span>
          </button>
        </section>
      )}

      <section
        className={`border-b border-white/10 px-8 py-20 md:px-16 ${
          category.slug === "branding" ? "pt-32 md:pt-40" : ""
        }`}
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          {editing ? (
            <input
              defaultValue={category.headline}
              aria-label="Headline"
              onBlur={(event) => {
                const headline = event.currentTarget.value.trim()
                if (headline && headline !== category.headline) {
                  updateCategory({ id: category._id, headline })
                }
              }}
              className="bg-transparent text-3xl leading-[1.15] font-bold tracking-tight text-white outline-1 outline-white/30 outline-dashed hover:outline-white/70 focus:outline-white md:col-span-2 md:text-4xl"
            />
          ) : (
            <h2 className="text-3xl leading-[1.15] font-bold tracking-tight md:col-span-2 md:text-4xl">
              {category.headline}
            </h2>
          )}
          {editing ? (
            <textarea
              defaultValue={category.description}
              aria-label="Description"
              rows={4}
              onBlur={(event) => {
                const description = event.currentTarget.value.trim()
                if (description !== category.description) {
                  updateCategory({ id: category._id, description })
                }
              }}
              className="resize-none bg-transparent text-base leading-relaxed text-white/60 outline-1 outline-white/30 outline-dashed hover:outline-white/70 focus:outline-white md:col-span-2 md:text-lg"
            />
          ) : (
            <p className="text-base leading-relaxed text-white/60 md:col-span-2 md:text-lg">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* {category.slug === "web-development" && <WebDevProcess />} */}
      {category.slug === "branding" && <BrandingProcess />}

      <div className="px-8 py-8 md:px-16">
        <MasonryGrid key={category._id}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project._id}
              project={project}
              categorySlug={category.slug}
              index={index}
            />
          ))}
        </MasonryGrid>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-8 py-16 md:px-16">
        <Link to="/portfolio" className="btn-industrial">
          ← All Categories
        </Link>
        <Link to="/contact" className="btn-industrial">
          Start a Project →
        </Link>
      </div>
      {editing && (
        <input
          ref={imageFileRef}
          type="file"
          accept="image/*"
          aria-label="Upload listing image"
          className="hidden"
          onChange={updateImage}
        />
      )}
    </div>
  )
}
