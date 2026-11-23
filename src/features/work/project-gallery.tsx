import { useMutation } from "convex/react"
import { ImagePlus, X } from "lucide-react"
import { useState } from "react"
import { api } from "../../../convex/_generated/api"
import { galleryTemplates, slotCapacity } from "../../../convex/lib/gallery"
import type { GalleryOrientation, GalleryTemplate } from "../../../convex/model"
import { useEditing } from "../../edit/edit-mode"
import { useTask } from "../../lib/hooks"
import type { Project } from "../../lib/types"
import { mediaTypeOf, useFilePicker, useUpload } from "../../lib/upload"
import { GalleryGrid, readingOrder } from "../../ui/gallery-grid"
import { Lightbox } from "../../ui/lightbox"

const ORIENTATIONS: { value: GalleryOrientation; label: string }[] = [
  { value: "original", label: "Original" },
  { value: "horizontal", label: "Flip horizontally" },
  { value: "vertical", label: "Flip vertically" },
  { value: "both", label: "Flip both" },
]
const select =
  "rounded border border-white/25 bg-black px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40"

type Item = NonNullable<Project["galleryMedia"][number]>

const Media = ({ item, alt = "" }: { item: Item; alt?: string }) =>
  item.type === "video" ? (
    <video
      src={item.url}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover"
    />
  ) : (
    <img src={item.url} alt={alt} loading="lazy" className="h-full w-full object-cover" />
  )

export const ProjectGallery = ({ project }: { project: Project }) => {
  const editing = useEditing()
  const { template, orientation, slots } = project.gallery
  const media = project.galleryMedia
  const setSlot = useMutation(api.projects.setGallerySlot)
  const setLayout = useMutation(api.projects.setGalleryLayout)
  const upload = useUpload()
  const { run, busy, error } = useTask()
  const [viewing, setViewing] = useState<number | null>(null)
  const picker = useFilePicker<number>(
    ([file], index) =>
      void run(async () => {
        if (!mediaTypeOf(file)) throw new Error("Choose an image or video file.")
        await setSlot({ id: project._id, index, image: await upload(file) })
      }),
    { accept: "image/*,video/*" },
  )

  if (!editing && !media.some(Boolean)) return null

  // Lightbox walks media in visual order, skipping empty frames.
  const sequence = readingOrder(template, orientation, slots.length).filter((i) => media[i])
  const items = sequence.map((i) => media[i]!)

  return (
    <section aria-label="Project gallery" className="px-8 py-8 md:px-16">
      {editing && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <p className="text-sm text-white/60">
            Click a frame to upload an image or video. Media crops to fit.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <label className="flex items-center gap-3">
              Template
              <select
                value={template}
                disabled={busy}
                onChange={(e) =>
                  void run(() =>
                    setLayout({
                      id: project._id,
                      layout: { template: e.target.value as GalleryTemplate },
                    }),
                  )
                }
                className={select}
              >
                {Object.entries(galleryTemplates).map(([id, t]) => (
                  <option key={id} value={id}>
                    {t.label} · {t.frames.length} frames
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3">
              Layout
              <select
                value={orientation}
                disabled={busy}
                onChange={(e) =>
                  void run(() =>
                    setLayout({
                      id: project._id,
                      layout: { orientation: e.target.value as GalleryOrientation },
                    }),
                  )
                }
                className={select}
              >
                {ORIENTATIONS.map(({ value, label }) => (
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
      <GalleryGrid
        template={template}
        orientation={orientation}
        slotCount={editing ? slotCapacity(slots, template) : slots.length}
        busy={busy}
        isVisible={editing ? undefined : (i) => Boolean(media[i])}
        renderFrame={(index) => {
          const item = media[index]
          if (!editing)
            return (
              item && (
                <button
                  type="button"
                  aria-label={`View ${project.title} media ${sequence.indexOf(index) + 1}`}
                  onClick={() => setViewing(sequence.indexOf(index))}
                  className="absolute inset-0 h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                >
                  <Media item={item} alt={`${project.title}, ${index + 1}`} />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {item.type === "video" ? "View video" : "View image"}
                  </span>
                </button>
              )
            )
          return (
            <>
              <button
                type="button"
                disabled={busy}
                aria-label={`${item ? "Replace" : "Upload"} media in frame ${index + 1}`}
                onClick={() => picker.pick(index)}
                className={`absolute inset-0 h-full w-full disabled:cursor-wait ${item ? "" : "bg-white/5 text-white/40 hover:text-white/70"}`}
              >
                {item ? (
                  <>
                    <Media item={item} />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                      Change media
                    </span>
                  </>
                ) : (
                  <>
                    <span className="pointer-events-none absolute inset-px rounded-[15px] border border-dashed border-white/25 group-hover:border-white/60" />
                    <span className="flex h-full flex-col items-center justify-center gap-2">
                      <ImagePlus size={24} />
                      <span className="text-xs">Upload media</span>
                    </span>
                  </>
                )}
              </button>
              {slots[index] && (
                <button
                  type="button"
                  disabled={busy}
                  aria-label={`Clear frame ${index + 1}`}
                  onClick={() => void run(() => setSlot({ id: project._id, index, image: null }))}
                  className="absolute top-3 right-3 bg-black/70 p-2 text-white/80 hover:bg-black hover:text-white disabled:opacity-40"
                >
                  <X size={16} />
                </button>
              )}
            </>
          )
        }}
      />
      {editing && picker.input}
      {viewing !== null && (
        <Lightbox
          items={items}
          index={viewing}
          title={project.title}
          onClose={() => setViewing(null)}
        />
      )}
    </section>
  )
}
