import { useMutation, useQuery } from "convex/react"
import { ImagePlus, X } from "lucide-react"
import { useRef, useState } from "react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import {
  galleryTemplates,
  type GalleryOrientation,
  type GalleryTemplateId,
} from "../../convex/lib/gallery"
import { GalleryTemplateGrid, getTemplateFrames } from "./gallery-template-grid"

const orientations: { value: GalleryOrientation; label: string }[] = [
  { value: "original", label: "Original" },
  { value: "horizontal", label: "Flip horizontally" },
  { value: "vertical", label: "Flip vertically" },
  { value: "both", label: "Flip both" },
]

export const ProjectGallery = ({
  projectId,
  title,
  editing,
  orientation,
  template,
  onView,
}: {
  projectId: Id<"projects">
  title: string
  editing: boolean
  orientation: GalleryOrientation
  template: GalleryTemplateId
  onView: (images: string[], index: number) => void
}) => {
  const columns = useQuery(api.portfolio.getProjectGallery, { id: projectId })
  const editGallery = useMutation(api.portfolio.editProjectGallery)
  const updateProject = useMutation(api.portfolio.updateProject)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadSlot = useRef<number | null>(null)
  const busyRef = useRef(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async (work: () => Promise<unknown>) => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setError(null)
    try {
      await work()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the gallery.")
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  if (!columns) return null
  const slots = columns.flat()
  if (!editing && !slots.some((slot) => slot.url)) return null

  const { frames } = galleryTemplates[template]
  const positioned = getTemplateFrames(template, orientation)
  const batches = Math.max(1, Math.ceil(slots.length / frames.length))
  const visualImages = Array.from({ length: batches }, (_, batch) =>
    positioned.map((frame) => ({
      index: batch * frames.length + frame.index,
      url: slots[batch * frames.length + frame.index]?.url,
    })),
  )
    .flat()
    .filter((image): image is { index: number; url: string } => Boolean(image.url))
  const imageIndices = new Map(visualImages.map((image, index) => [image.index, index]))
  const imageUrls = visualImages.map((image) => image.url)

  return (
    <section aria-label="Project gallery" className="px-8 py-8 md:px-16">
      {editing && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <p className="text-sm text-white/60">Click a frame to upload. Images crop to fit.</p>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-3 text-sm text-white/70">
              Template
              <select
                value={template}
                disabled={busy}
                onChange={(event) => {
                  const galleryTemplate = event.target.value as GalleryTemplateId
                  void run(() => updateProject({ id: projectId, galleryTemplate }))
                }}
                className="rounded border border-white/25 bg-black px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40"
              >
                <option value="long">Extended · 14 frames</option>
                <option value="short">Compact · 9 frames</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm text-white/70">
              Layout
              <select
                value={orientation}
                disabled={busy}
                onChange={(event) => {
                  const galleryOrientation = event.target.value as GalleryOrientation
                  void run(() => updateProject({ id: projectId, galleryOrientation }))
                }}
                className="rounded border border-white/25 bg-black px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40"
              >
                {orientations.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          {error}
        </p>
      )}
      {editing && <output className="sr-only">{busy ? "Saving gallery" : "Gallery saved"}</output>}
      <GalleryTemplateGrid
        template={template}
        orientation={orientation}
        slotCount={slots.length}
        busy={busy}
        isFrameVisible={editing ? undefined : (index) => Boolean(slots[index]?.url)}
        renderFrame={(index) => {
          const slot = slots[index]
          const url = slot?.url
          const imageIndex = imageIndices.get(index)

          return (
            <>
              {editing || url ? (
                <button
                  type="button"
                  disabled={busy}
                  aria-label={
                    editing
                      ? `${url ? "Replace" : "Upload"} image in frame ${index + 1}`
                      : `View ${title} image ${(imageIndex ?? 0) + 1}`
                  }
                  onClick={() => {
                    if (editing) {
                      uploadSlot.current = index
                      fileRef.current?.click()
                    } else if (imageIndex !== undefined) onView(imageUrls, imageIndex)
                  }}
                  className={`absolute inset-0 h-full w-full rounded-[16px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white disabled:cursor-wait ${url ? "" : "bg-white/5 text-white/40 hover:text-white/70"}`}
                >
                  {url ? (
                    <>
                      <img
                        src={url}
                        alt={`${title}, ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-sm text-white opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                        {editing ? "Change image" : "View image"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-px rounded-[15px] border border-dashed border-white/25 group-hover:border-white/60"
                      />
                      <span className="flex h-full flex-col items-center justify-center gap-2">
                        <ImagePlus size={24} />
                        <span className="text-xs">Upload image</span>
                      </span>
                    </>
                  )}
                </button>
              ) : null}
              {editing && slot?.image && (
                <button
                  type="button"
                  disabled={busy}
                  aria-label={`Clear frame ${index + 1}`}
                  onClick={() =>
                    void run(() =>
                      editGallery({ id: projectId, edit: { type: "clearImage", index } }),
                    )
                  }
                  className="absolute top-3 right-3 rounded-full bg-black/70 p-2 text-white/80 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40"
                >
                  <X size={16} />
                </button>
              )}
            </>
          )
        }}
      />
      {editing && (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          aria-label="Upload gallery image"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            const index = uploadSlot.current
            event.target.value = ""
            if (!file || index === null) return
            void run(async () => {
              if (!file.type.startsWith("image/")) throw new Error("Choose an image file.")
              const response = await fetch(await generateUploadUrl(), {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
              })
              if (!response.ok) throw new Error("Image upload failed. Please try again.")
              const result = await response.json()
              if (typeof result.storageId !== "string") throw new Error("Image upload failed.")
              await editGallery({
                id: projectId,
                edit: { type: "setImage", index, image: result.storageId },
              })
            })
          }}
        />
      )}
    </section>
  )
}
