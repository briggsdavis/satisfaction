import { useMutation, useQuery } from "convex/react"
import DOMPurify from "dompurify"
import { ImagePlus, Plus, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Link, useNavigationType, useParams, useSearchParams } from "react-router"
import { api } from "../../convex/_generated/api"
import type { Doc, Id } from "../../convex/_generated/dataModel"
import { FitTitle } from "../components/fit-title"
import { MasonryGrid } from "../components/masonry-grid"
import { TextReveal } from "../components/text-reveal"

type Project = Doc<"projects">

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const RichText = ({ value, className }: { value: string; className: string }) => {
  if (!/<[a-z][\s\S]*>/i.test(value)) {
    return <p className={`${className} whitespace-pre-line`}>{value}</p>
  }
  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
    />
  )
}

const EditableRichText = ({
  value,
  className,
  onCommit,
}: {
  value: string
  className: string
  onCommit: (value: string) => void
}) => (
  <div
    contentEditable
    suppressContentEditableWarning
    className={`rich-text-content rounded-sm outline-1 outline-white/30 transition-colors outline-dashed hover:outline-white/70 focus:outline-white ${className}`}
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(value).replaceAll("\n", "<br>"),
    }}
    onBlur={(event) => {
      const next = event.currentTarget.innerHTML
      if (next !== value) onCommit(next)
    }}
  />
)

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
            {String(idx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
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
            aria-label={`Show image ${i + 1}`}
            className="h-12 w-12 shrink-0 overflow-hidden md:h-14 md:w-14"
            style={{
              opacity: i === idx ? 1 : 0.35,
              outline: i === idx ? "1px solid rgba(255,255,255,0.6)" : "none",
              outlineOffset: "2px",
              transition: "opacity 0.2s, outline 0.2s",
            }}
          >
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
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
  onClick,
  editing = false,
}: {
  storageId: Id<"_storage">
  title: string
  index: number
  onClick?: () => void
  editing?: boolean
}) => (
  <motion.div
    className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-[16px]"
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
        {editing ? "Change image" : "View"}
      </span>
    </div>
    <span className="absolute right-4 bottom-4 font-mono text-xs font-bold tracking-widest text-white/30">
      {String(index + 1).padStart(2, "0")}
    </span>
  </motion.div>
)

// ─── Service chips (resolves the project's services → names + colors) ────────
const ServiceChips = ({ project, editing }: { project: Project; editing: boolean }) => {
  const allServices = useQuery(api.portfolio.listCategories) ?? []
  const updateProject = useMutation(api.portfolio.updateProject)
  const [adding, setAdding] = useState(false)
  const map = new Map(allServices.map((s) => [s._id, s] as const))
  const chips = project.categoryIds
    .map((id) => map.get(id))
    .filter((s): s is NonNullable<typeof s> => !!s)
  return (
    <div className="relative flex flex-wrap gap-3">
      {chips.map((s) => (
        <div key={s._id} className="group relative">
          <Link
            to={`/portfolio/${s.slug}`}
            className="relative flex items-center gap-2 overflow-hidden border border-white/20 px-3 py-1 text-xs font-bold tracking-[0.3em] text-white/70 uppercase transition-all duration-300 hover:border-white/50 hover:bg-white/5 hover:text-white"
          >
            <span
              className="relative h-1.5 w-1.5 shrink-0 rounded-full bg-current transition-transform duration-300 group-hover:scale-150"
              style={{ color: s.color }}
            />
            <span className="relative translate-y-0.25">{s.name}</span>
          </Link>
          {editing && project.categoryIds.length > 1 && (
            <button
              type="button"
              aria-label={`Remove ${s.name}`}
              onClick={() =>
                updateProject({
                  id: project._id,
                  categoryIds: project.categoryIds.filter((id) => id !== s._id),
                })
              }
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={11} />
            </button>
          )}
        </div>
      ))}
      {editing && (
        <button
          type="button"
          aria-label="Add service"
          onClick={() => setAdding((value) => !value)}
          className="flex h-7 w-7 items-center justify-center border border-dashed border-white/30 text-white/50 hover:border-white hover:text-white"
        >
          <Plus size={14} />
        </button>
      )}
      {editing && adding && (
        <div className="absolute top-full left-0 z-20 mt-2 min-w-48 border border-white/20 bg-black p-1 shadow-xl">
          {allServices
            .filter((service) => !project.categoryIds.includes(service._id))
            .map((service) => (
              <button
                key={service._id}
                type="button"
                onClick={() => {
                  updateProject({
                    id: project._id,
                    categoryIds: [...project.categoryIds, service._id],
                  })
                  setAdding(false)
                }}
                className="block w-full px-3 py-2 text-left text-xs font-bold tracking-wider text-white/60 uppercase hover:bg-white hover:text-black"
              >
                {service.name}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export const ProjectPage = () => {
  const { category: categorySlug, project: projectSlug } = useParams<{
    category: string
    project: string
  }>()
  const navType = useNavigationType()
  const [searchParams] = useSearchParams()
  const editing = searchParams.get("edit") === "1"
  const titleDelay = navType === "PUSH" ? 0.75 : 0
  const updateProject = useMutation(api.portfolio.updateProject)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const galleryFileRef = useRef<HTMLInputElement>(null)
  const addGalleryFileRef = useRef<HTMLInputElement>(null)
  const [replaceGalleryIndex, setReplaceGalleryIndex] = useState<number | null>(null)

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

  const commit = (
    patch: Partial<Pick<Project, "title" | "description" | "approach" | "execution" | "results">>,
  ) => updateProject({ id: project._id, ...patch })
  const uploadFile = async (file: File) => {
    const uploadUrl = await generateUploadUrl()
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })
    return ((await response.json()) as { storageId: Id<"_storage"> }).storageId
  }
  const updateCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    await updateProject({ id: project._id, coverImage: await uploadFile(file) })
  }
  const addGalleryImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (files.length === 0) return
    const storageIds = await Promise.all(files.map(uploadFile))
    await updateProject({ id: project._id, gallery: [...project.gallery, ...storageIds] })
  }
  const chooseGalleryImage = (index: number) => {
    setReplaceGalleryIndex(index)
    galleryFileRef.current?.click()
  }
  const replaceGalleryImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || replaceGalleryIndex === null) return
    const gallery = [...project.gallery]
    gallery[replaceGalleryIndex] = await uploadFile(file)
    await updateProject({ id: project._id, gallery })
    setReplaceGalleryIndex(null)
  }

  return (
    <div
      className="pt-32"
      onClickCapture={(event) => {
        if (editing && (event.target as Element).closest("a")) event.preventDefault()
      }}
    >
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
          onCommit={
            editing
              ? async (title) => {
                  const slug = slugify(title)
                  await updateProject({ id: project._id, title, slug })
                  window.parent.postMessage({ type: "project-slug", slug }, window.location.origin)
                }
              : undefined
          }
        />
        {editing && (
          <button
            type="button"
            onClick={() => coverFileRef.current?.click()}
            className="group relative mt-8 flex aspect-video w-full items-center justify-center overflow-hidden border border-dashed border-white/30 bg-white/5 text-white/50 hover:border-white/70 hover:text-white"
          >
            {project.coverImage ? (
              <StorageImg
                storageId={project.coverImage}
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-40"
              />
            ) : null}
            <span className="relative flex items-center gap-2 bg-black/70 px-4 py-2 text-xs font-bold tracking-wider uppercase">
              <ImagePlus size={14} />
              {project.coverImage ? "Change cover" : "Add cover"}
            </span>
          </button>
        )}
      </section>

      <section className="border-b border-white/10 px-8 py-20 md:px-16">
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <span className="mb-3 block text-xs font-bold tracking-[0.4em] text-white/40 uppercase">
              Tags
            </span>
            <ServiceChips project={project} editing={editing} />
          </div>
          <div className="md:col-span-2">
            <span className="mb-4 block text-xs font-bold tracking-[0.4em] text-white/40 uppercase">
              Project Overview
            </span>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-base leading-relaxed text-white/60 md:text-lg"
            >
              {editing ? (
                <EditableRichText
                  value={project.description}
                  className="text-base leading-relaxed md:text-lg"
                  onCommit={(description) => commit({ description })}
                />
              ) : (
                <RichText
                  value={project.description}
                  className="text-base leading-relaxed md:text-lg"
                />
              )}
            </motion.div>
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
              {editing ? (
                <EditableRichText
                  value={body}
                  className="text-sm leading-relaxed text-white/60"
                  onCommit={(value) =>
                    commit({ [label.toLowerCase() as "approach" | "execution" | "results"]: value })
                  }
                />
              ) : (
                <RichText value={body} className="text-sm leading-relaxed text-white/60" />
              )}
            </div>
          ))}
        </div>
      </section>

      {(editing || project.gallery.length > 0) && (
        <div className="flex flex-col gap-4 px-8 py-8 md:px-16">
          <MasonryGrid key={project._id}>
            {project.gallery.map((storageId, index) => (
              <ImageCard
                key={`${storageId}:${index}`}
                storageId={storageId}
                title={project.title}
                index={index}
                onClick={() => (editing ? chooseGalleryImage(index) : setLightboxIdx(index))}
                editing={editing}
              />
            ))}
          </MasonryGrid>
          {editing && (
            <button
              type="button"
              onClick={() => addGalleryFileRef.current?.click()}
              className="flex h-48 items-center justify-center gap-2 rounded-[16px] border border-dashed border-white/30 text-xs font-bold tracking-wider text-white/50 uppercase hover:border-white/70 hover:text-white"
            >
              <ImagePlus size={16} />
              Add gallery images
            </button>
          )}
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
      {editing && (
        <>
          <input
            ref={coverFileRef}
            type="file"
            accept="image/*"
            aria-label="Upload cover image"
            className="hidden"
            onChange={updateCover}
          />
          <input
            ref={galleryFileRef}
            type="file"
            accept="image/*"
            aria-label="Replace gallery image"
            className="hidden"
            onChange={replaceGalleryImage}
          />
          <input
            ref={addGalleryFileRef}
            type="file"
            accept="image/*"
            multiple
            aria-label="Add gallery images"
            className="hidden"
            onChange={addGalleryImages}
          />
        </>
      )}
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
