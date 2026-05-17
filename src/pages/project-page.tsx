import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Link, useNavigationType, useParams } from "react-router"
import { api } from "../../convex/_generated/api"
import type { Doc, Id } from "../../convex/_generated/dataModel"
import { FitTitle } from "../components/fit-title"
import { TextReveal } from "../components/text-reveal"

type Project = Doc<"projects">

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

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-14 pb-6 md:px-24">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.img
            key={idx}
            src={images[idx]}
            alt={`${title} — ${idx + 1}`}
            className="max-h-full max-w-full object-contain"
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        <button
          onClick={() => go(-1)}
          className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 text-white/50 transition-colors hover:border-white/60 hover:text-white md:left-6"
          aria-label="Previous"
        >
          ←
        </button>

        <button
          onClick={() => go(1)}
          className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 text-white/50 transition-colors hover:border-white/60 hover:text-white md:right-6"
          aria-label="Next"
        >
          →
        </button>
      </div>

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

const StorageImg = ({
  storageId,
  ...props
}: {
  storageId: Id<"_storage">
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">) => {
  const url = useQuery(api.files.getUrl, { storageId })
  if (!url) return null
  return <img alt="" src={url} {...props} />
}

const ImageCard = ({
  storageId,
  title,
  index,
  className = "",
  onClick,
}: {
  storageId: Id<"_storage">
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
    <StorageImg
      storageId={storageId}
      alt={`${title} ${index + 1}`}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
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

// Repeating gallery layout: full → pair → wide+pair  → repeat
type GalleryRow =
  | { kind: "full"; ids: Id<"_storage">[] }
  | { kind: "pair"; ids: Id<"_storage">[] }
  | { kind: "wideTwo"; ids: Id<"_storage">[] }

const GALLERY_TEMPLATE: GalleryRow["kind"][] = ["full", "pair", "wideTwo"]
const GALLERY_SIZE: Record<GalleryRow["kind"], number> = {
  full: 1,
  pair: 2,
  wideTwo: 3,
}

const buildGalleryRows = (ids: Id<"_storage">[]): GalleryRow[] => {
  const rows: GalleryRow[] = []
  let i = 0
  let t = 0
  while (i < ids.length) {
    const kind = GALLERY_TEMPLATE[t % GALLERY_TEMPLATE.length]
    const slice = ids.slice(i, i + GALLERY_SIZE[kind])
    if (slice.length === 0) break
    rows.push({ kind, ids: slice } as GalleryRow)
    i += slice.length
    t++
  }
  return rows
}

// ─── Service chips (resolves serviceIds → names + colors) ────────────────────
const ServiceChips = ({ project }: { project: Project }) => {
  const allServices = useQuery(api.services.list) ?? []
  const map = new Map(allServices.map((s) => [s._id, s] as const))
  const chips = project.serviceIds
    .map((id) => map.get(id))
    .filter((s): s is NonNullable<typeof s> => !!s)
  return (
    <>
      {chips.map((s) => (
        <span
          key={s._id}
          className="flex items-center gap-2 border border-white/20 px-3 py-1 text-xs font-bold tracking-[0.3em] text-white/70 uppercase"
        >
          <span
            className="h-[6px] w-[6px] shrink-0 rounded-full"
            style={{ backgroundColor: s.color }}
          />
          {s.name}
        </span>
      ))}
    </>
  )
}

export const ProjectPage = () => {
  const { category: categorySlug, project: projectSlug } = useParams<{
    category: string
    project: string
  }>()
  const navType = useNavigationType()
  const titleDelay = navType === "PUSH" ? 0.75 : 0

  const project = useQuery(
    api.portfolio.getProjectBySlug,
    projectSlug ? { slug: projectSlug } : "skip",
  )
  const category = useQuery(
    api.portfolio.getCategoryBySlug,
    categorySlug ? { slug: categorySlug } : "skip",
  )

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const galleryUrls = useGalleryUrls(project?.gallery ?? [])

  if (project === undefined || category === undefined) return null

  if (!project || !category) {
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

  const galleryRows = buildGalleryRows(project.gallery)
  let animIdx = 0

  return (
    <div className="pt-32">
      <section className="border-b border-white/10 px-8 pb-16 md:px-16">
        <Link
          to={`/portfolio/${category.slug}`}
          className="mb-6 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase transition-colors hover:text-white"
        >
          ← {category.name}
        </Link>
        <FitTitle
          text={project.title.toUpperCase()}
          slideFrom="left"
          delay={titleDelay}
        />
      </section>

      <section className="border-b border-white/10 px-8 py-20 md:px-16">
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <span className="mb-3 block text-xs font-bold tracking-[0.4em] text-white/40 uppercase">
              Tags
            </span>
            <div className="flex flex-wrap gap-3">
              <ServiceChips project={project} />
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
              className="text-base leading-relaxed whitespace-pre-line text-white/60 md:text-lg"
            >
              {project.description}
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {(
            [
              { label: "Approach", body: project.approach },
              { label: "Execution", body: project.execution },
              { label: "Results", body: project.results },
            ] as const
          ).map(({ label, body }) => (
            <div key={label}>
              <span className="mb-5 block text-xs font-bold tracking-[0.4em] text-white/40 uppercase">
                {label}
              </span>
              <p className="text-sm leading-relaxed whitespace-pre-line text-white/60">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {project.gallery.length > 0 && (
        <div className="flex flex-col gap-4 px-8 py-8 md:px-16">
          {galleryRows.map((row, ri) => {
            if (row.kind === "full") {
              const i = animIdx
              animIdx++
              return (
                <ImageCard
                  key={`r-${ri}`}
                  storageId={row.ids[0]}
                  title={project.title}
                  index={i}
                  className="h-[48vh]"
                  onClick={() => setLightboxIdx(i)}
                />
              )
            }
            if (row.kind === "pair") {
              const left = animIdx
              const right = animIdx + 1
              animIdx += row.ids.length
              return (
                <div
                  key={`r-${ri}`}
                  className="flex flex-col gap-4 md:flex-row"
                >
                  <ImageCard
                    storageId={row.ids[0]}
                    title={project.title}
                    index={left}
                    className="h-[58vh] flex-1"
                    onClick={() => setLightboxIdx(left)}
                  />
                  {row.ids[1] && (
                    <ImageCard
                      storageId={row.ids[1]}
                      title={project.title}
                      index={right}
                      className="h-[58vh] flex-1"
                      onClick={() => setLightboxIdx(right)}
                    />
                  )}
                </div>
              )
            }
            // wideTwo
            const top = animIdx
            const bl = animIdx + 1
            const br = animIdx + 2
            animIdx += row.ids.length
            return (
              <div key={`r-${ri}`} className="flex flex-col gap-4">
                <ImageCard
                  storageId={row.ids[0]}
                  title={project.title}
                  index={top}
                  className="h-[42vh]"
                  onClick={() => setLightboxIdx(top)}
                />
                <div className="flex flex-col gap-4 md:flex-row">
                  {row.ids[1] && (
                    <ImageCard
                      storageId={row.ids[1]}
                      title={project.title}
                      index={bl}
                      className="h-[36vh] flex-1"
                      onClick={() => setLightboxIdx(bl)}
                    />
                  )}
                  {row.ids[2] && (
                    <ImageCard
                      storageId={row.ids[2]}
                      title={project.title}
                      index={br}
                      className="h-[36vh] flex-1"
                      onClick={() => setLightboxIdx(br)}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/10 px-8 py-16 md:px-16">
        <Link to={`/portfolio/${category.slug}`} className="btn-industrial">
          ← {category.name}
        </Link>
        <Link to="/contact" className="btn-industrial">
          Start a Project →
        </Link>
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && galleryUrls.length > 0 && (
          <Lightbox
            images={galleryUrls}
            startIndex={lightboxIdx}
            title={project.title}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Resolve all gallery storage IDs to URLs once for the lightbox.
// Convex's useQuery rules-of-hooks compatibility: we can't loop useQuery,
// so this hook uses a single approach — render N child resolvers and
// collect via a context. Simpler: do the resolution inside Lightbox's
// own children (each thumbnail/main). But the lightbox needs an array of
// URL strings up-front. To stay rules-compliant with a known list, we
// just call useQuery on a fixed-size array — but the size varies per
// project. Workaround: call useQuery with a stable query name and skip
// for unused slots, capping at MAX_GALLERY.
const MAX_GALLERY = 24

const useGalleryUrls = (ids: Id<"_storage">[]): string[] => {
  // Always call MAX_GALLERY hooks — values past ids.length pass "skip".
  const urls: (string | null)[] = []
  for (let i = 0; i < MAX_GALLERY; i++) {
    const id = ids[i]
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const url = useQuery(api.files.getUrl, id ? { storageId: id } : "skip")
    urls.push(url ?? null)
  }
  return urls.filter((u): u is string => !!u).slice(0, ids.length)
}
