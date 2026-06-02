import { useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { AdminConvexImageField } from "../../components/convex-image-field"
import { ConvexTextareaField, ConvexTextField } from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"
import { categoryCoverHint, galleryImageHint } from "../../masonry-hints"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const GalleryThumb = ({
  storageId,
  hint,
  onRemove,
  onUp,
  onDown,
  isFirst,
  isLast,
}: {
  storageId: Id<"_storage">
  hint: string
  onRemove: () => void
  onUp: () => void
  onDown: () => void
  isFirst: boolean
  isLast: boolean
}) => {
  const url = useQuery(api.files.getUrl, { storageId })
  return (
    <div>
      <div className="relative">
        {url ? (
          <img src={url} alt="" className="h-24 w-full border border-white/10 object-cover" />
        ) : (
          <div className="h-24 w-full border border-white/10 bg-white/5" />
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/70 px-1">
          <div className="flex">
            <button
              disabled={isFirst}
              onClick={onUp}
              className="p-1 text-white/40 hover:text-white disabled:opacity-20"
            >
              <ChevronUp size={12} />
            </button>
            <button
              disabled={isLast}
              onClick={onDown}
              className="p-1 text-white/40 hover:text-white disabled:opacity-20"
            >
              <ChevronDown size={12} />
            </button>
          </div>
          <button onClick={onRemove} className="p-1 text-white/40 hover:text-red-400">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <p className="mt-1 text-2xs leading-tight text-white/30">{hint}</p>
    </div>
  )
}

export const ProjectAdmin = () => {
  const { projectSlug } = useParams<{ projectSlug: string }>()
  const navigate = useNavigate()
  const project = useQuery(
    api.portfolio.getProjectBySlug,
    projectSlug ? { slug: projectSlug } : "skip",
  )
  const allServices = useQuery(api.portfolio.listCategories) ?? []
  // Projects in the primary category, in the same order the public masonry
  // uses — lets us show the alternating cover aspect ratio for this position.
  const primaryCategoryId = project?.categoryIds?.[0]
  const categoryProjects = useQuery(
    api.portfolio.listProjectsByCategory,
    primaryCategoryId ? { categoryId: primaryCategoryId } : "skip",
  )

  const update = useMutation(api.portfolio.updateProject)
  const remove = useMutation(api.portfolio.removeProject)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const removeFile = useMutation(api.files.remove)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  if (project === undefined) return null
  if (!project) {
    return (
      <div className="max-w-2xl">
        <BackButton to="/admin/projects" label="Projects" />
        <p className="text-white/50">Project not found.</p>
      </div>
    )
  }

  // Primary service drives the public URL (/portfolio/[service]/[project]).
  const primary = allServices.find((s) => s._id === project.categoryIds[0])

  const coverHint =
    primary && categoryProjects
      ? categoryCoverHint(
          categoryProjects.map((p) => p._id),
          project._id,
          primary.name,
        )
      : "varies by position in the portfolio masonry (recalculates as projects are added)"

  const toggleService = (id: Id<"categories">) => {
    const has = project.categoryIds.includes(id)
    const next = has ? project.categoryIds.filter((x) => x !== id) : [...project.categoryIds, id]
    if (next.length === 0) return // require at least one
    update({ id: project._id, categoryIds: next })
  }

  const handleAddGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (files.length === 0) return
    setUploading(true)
    try {
      const ids = await Promise.all(
        files.map(async (file) => {
          const uploadUrl = await generateUploadUrl()
          const res = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          })
          const { storageId } = (await res.json()) as {
            storageId: Id<"_storage">
          }
          return storageId
        }),
      )
      await update({
        id: project._id,
        gallery: [...project.gallery, ...ids],
      })
    } finally {
      setUploading(false)
    }
  }

  const setGallery = (g: Id<"_storage">[]) => update({ id: project._id, gallery: g })

  const removeGalleryAt = async (i: number) => {
    const id = project.gallery[i]
    const next = project.gallery.filter((_, idx) => idx !== i)
    await update({ id: project._id, gallery: next })
    await removeFile({ storageId: id }).catch(() => {})
  }

  const moveGallery = (i: number, dir: -1 | 1) => {
    const next = [...project.gallery]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    setGallery(next)
  }

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/projects" label="Projects" />
      <SectionHeader
        title={project.title || "Untitled Project"}
        description={`URL: /portfolio/${primary?.slug ?? "—"}/${project.slug}`}
      />

      <ConvexTextField
        label="Title"
        value={project.title}
        onCommit={(v) => update({ id: project._id, title: v })}
      />
      <ConvexTextField
        label="Slug"
        value={project.slug}
        onCommit={(v) => update({ id: project._id, slug: slugify(v) })}
      />

      <AdminConvexImageField
        label="Cover Image"
        aspectHint={coverHint}
        value={project.coverImage ?? null}
        onChange={(v) => v && update({ id: project._id, coverImage: v })}
      />

      <div className="flex items-center gap-3 border-b border-white/10 py-4">
        <p className="text-xs font-bold tracking-[0.35em] text-white/40 uppercase">Featured</p>
        <button
          type="button"
          role="switch"
          aria-label="Featured"
          aria-checked={project.featured}
          onClick={() => update({ id: project._id, featured: !project.featured })}
          className={`h-5 w-9 transition-colors ${project.featured ? "bg-white" : "bg-white/20"}`}
        />
        <span className="text-xs text-white/40">
          {project.featured ? "Shows in homepage Featured Cascade" : "Hidden from homepage"}
        </span>
      </div>

      <ConvexTextareaField
        label="Project Overview (description)"
        value={project.description}
        onCommit={(v) => update({ id: project._id, description: v })}
        rows={4}
      />
      <ConvexTextareaField
        label="Approach"
        value={project.approach}
        onCommit={(v) => update({ id: project._id, approach: v })}
        rows={3}
      />
      <ConvexTextareaField
        label="Execution"
        value={project.execution}
        onCommit={(v) => update({ id: project._id, execution: v })}
        rows={3}
      />
      <ConvexTextareaField
        label="Results"
        value={project.results}
        onCommit={(v) => update({ id: project._id, results: v })}
        rows={3}
      />

      {/* Services — m2m. Each selected service lists this project and renders as a tag. */}
      <div className="border-b border-white/10 py-5">
        <p className="mb-1 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">Services</p>
        <p className="mb-3 text-xs text-white/30">
          Project appears under each selected service and shows them as tags. The first selected
          drives the URL.
        </p>
        <div className="flex flex-wrap gap-2">
          {allServices.map((s) => {
            const on = project.categoryIds.includes(s._id)
            return (
              <button
                key={s._id}
                onClick={() => toggleService(s._id)}
                className={`flex items-center gap-2 border px-3 py-1.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                  on
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                }`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Gallery */}
      <div className="border-b border-white/10 py-5">
        <p className="mb-1 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
          Gallery ({project.gallery.length})
        </p>
        <p className="mb-3 text-xs text-white/30">
          Desktop aspect ratio alternates by position (full → pair → wide+pair). The ratio under
          each image updates as you add, remove, or reorder — shown uncropped in the lightbox.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {project.gallery.map((id, i) => (
            <GalleryThumb
              key={`${id}-${i}`}
              storageId={id}
              hint={galleryImageHint(project.gallery.length, i)}
              onRemove={() => removeGalleryAt(i)}
              onUp={() => moveGallery(i, -1)}
              onDown={() => moveGallery(i, 1)}
              isFirst={i === 0}
              isLast={i === project.gallery.length - 1}
            />
          ))}
        </div>
        <button
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="mt-3 flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70 disabled:opacity-40"
        >
          <Plus size={12} />
          {uploading ? "Uploading…" : "Add Gallery Images"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          aria-label="Upload gallery images"
          className="hidden"
          onChange={handleAddGallery}
        />
      </div>

      <div className="mt-10 border-t border-white/10 pt-6">
        <button
          onClick={() => {
            if (confirm(`Delete project "${project.title}"?`)) {
              remove({ id: project._id })
              navigate("/admin/projects")
            }
          }}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-red-400/70 uppercase transition-colors hover:text-red-400"
        >
          <Trash2 size={12} />
          Delete project
        </button>
      </div>
    </div>
  )
}
