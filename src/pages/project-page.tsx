import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Link, useNavigationType, useParams } from "react-router"
import { TextReveal } from "../components/text-reveal"
import { CATEGORIES } from "../lib/categories"

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({
  images,
  startIndex,
  title,
  onClose,
}: {
  images: string[]
  startIndex: number
  title: string
  onClose: () => void
}) => {
  const [idx, setIdx] = useState(startIndex)
  const [dir, setDir] = useState(0)

  const go = useCallback(
    (delta: number) => {
      setDir(delta)
      setIdx((i) => (i + delta + images.length) % images.length)
    },
    [images.length],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [go, onClose])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between px-6 py-4 md:px-10">
        <span className="font-mono text-xs font-bold tracking-widest text-white/30 uppercase">
          {title}
        </span>
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs text-white/30">
            {String(idx + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-white/20 text-sm text-white/50 transition-colors hover:border-white/60 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-14 pb-6 md:px-24">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.img
            key={idx}
            src={images[idx]}
            alt={`${title} — ${idx + 1}`}
            className="max-h-full max-w-full object-contain"
            referrerPolicy="no-referrer"
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        {/* Prev */}
        <button
          onClick={() => go(-1)}
          className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 text-white/50 transition-colors hover:border-white/60 hover:text-white md:left-6"
          aria-label="Previous"
        >
          ←
        </button>

        {/* Next */}
        <button
          onClick={() => go(1)}
          className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 text-white/50 transition-colors hover:border-white/60 hover:text-white md:right-6"
          aria-label="Next"
        >
          →
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex shrink-0 justify-center gap-2 px-6 pb-6">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => {
              setDir(i > idx ? 1 : -1)
              setIdx(i)
            }}
            className="h-12 w-12 shrink-0 overflow-hidden md:h-14 md:w-14"
            style={{
              opacity: i === idx ? 1 : 0.35,
              outline: i === idx ? "1px solid rgba(255,255,255,0.6)" : "none",
              outlineOffset: "2px",
              transition: "opacity 0.2s, outline 0.2s",
            }}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </motion.div>,
    document.body,
  )
}

// ─── Project Page ─────────────────────────────────────────────────────────────
export const ProjectPage = () => {
  const { category: categorySlug, project: projectSlug } = useParams<{
    category: string
    project: string
  }>()
  const navType = useNavigationType()
  const titleDelay = navType === "PUSH" ? 0.75 : 0

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

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
          className="massive-text justify-center text-4xl leading-none md:text-7xl lg:text-9xl"
          slideFrom="left"
          delay={titleDelay}
        />
      </section>

      {/* Overview — descriptor + tags + description paragraph */}
      <section className="border-b border-white/10 px-8 py-20 md:px-16">
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

      {/* 6-image vertical masonry — click any image to open lightbox */}
      <div className="flex flex-col gap-4 px-8 py-8 md:px-16">
        {/* Row 1 — full width */}
        <ImageCard
          img={images[0]}
          title={project.title}
          index={0}
          className="h-[48vh]"
          onClick={() => setLightboxIdx(0)}
        />

        {/* Row 2 — 2 columns */}
        <div className="flex flex-col gap-4 md:flex-row">
          <ImageCard
            img={images[1]}
            title={project.title}
            index={1}
            className="h-[58vh] flex-1"
            onClick={() => setLightboxIdx(1)}
          />
          <ImageCard
            img={images[2]}
            title={project.title}
            index={2}
            className="h-[58vh] flex-1"
            onClick={() => setLightboxIdx(2)}
          />
        </div>

        {/* Row 3 — wide top + two under */}
        <div className="flex flex-col gap-4">
          <ImageCard
            img={images[3]}
            title={project.title}
            index={3}
            className="h-[42vh]"
            onClick={() => setLightboxIdx(3)}
          />
          <div className="flex flex-col gap-4 md:flex-row">
            <ImageCard
              img={images[4]}
              title={project.title}
              index={4}
              className="h-[36vh] flex-1"
              onClick={() => setLightboxIdx(4)}
            />
            <ImageCard
              img={images[5]}
              title={project.title}
              index={5}
              className="h-[36vh] flex-1"
              onClick={() => setLightboxIdx(5)}
            />
          </div>
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={images}
            startIndex={lightboxIdx}
            title={project.title}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Image Card ───────────────────────────────────────────────────────────────
const ImageCard = ({
  img,
  title,
  index,
  className = "",
  onClick,
}: {
  img: string
  title: string
  index: number
  className?: string
  onClick?: () => void
}) => (
  <motion.div
    className={`group relative block cursor-pointer overflow-hidden rounded-[16px] ${className}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-150px" }}
    transition={{
      duration: 0.7,
      delay: (index % 3) * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    }}
    onClick={onClick}
  >
    <img
      src={img}
      alt={`${title} - image ${index + 1}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
    {/* Expand hint on hover */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <span className="border border-white/40 bg-black/50 px-3 py-1 font-mono text-2xs font-bold tracking-widest text-white uppercase backdrop-blur-sm">
        View
      </span>
    </div>
    <span className="absolute right-4 bottom-4 font-mono text-xs font-bold tracking-widest text-white/30">
      {String(index + 1).padStart(2, "0")}
    </span>
  </motion.div>
)
