import { useMutation, useQuery } from "convex/react"
import type { Infer } from "convex/values"
import { ArrowDown, ArrowUp, ImagePlus, Plus, X } from "lucide-react"
import { useRef, useState } from "react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import { aspectRatios, type galleryEdit } from "../../convex/lib/gallery"

const controlClass =
  "rounded border border-white/25 px-2 py-1 text-xs text-white/70 hover:border-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-white disabled:opacity-30"
const cssRatio = (ratio: string) => ratio.replace(":", " / ")

export const ProjectGallery = ({
  projectId,
  title,
  editing,
  onView,
}: {
  projectId: Id<"projects">
  title: string
  editing: boolean
  onView: (images: string[], index: number) => void
}) => {
  const columns = useQuery(api.portfolio.getProjectGallery, { id: projectId })
  const editGallery = useMutation(api.portfolio.editProjectGallery)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadSlot = useRef<string | null>(null)
  const busyRef = useRef(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addingTo, setAddingTo] = useState<number | null>(null)

  const run = async (work: () => Promise<unknown>) => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setError(null)
    try {
      await work()
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save the gallery. Please try again.",
      )
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }
  const change = (edit: Infer<typeof galleryEdit>) =>
    run(() => editGallery({ id: projectId, edit }))
  const chooseImage = (id: string) => {
    uploadSlot.current = id
    fileRef.current?.click()
  }

  if (!columns) return null
  const images = columns.flat().filter((slot) => slot.url !== null)
  if (!editing && images.length === 0) return null
  const gridClass =
    columns.length === 3
      ? "md:grid-cols-3"
      : columns.length === 2
        ? "md:grid-cols-2"
        : "grid-cols-1"

  return (
    <section aria-label="Project gallery" className="px-8 py-8 md:px-16">
      {editing && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white">Image columns</p>
            <p className="mt-1 text-xs text-white/60">
              Choose a frame, then click it to upload. Images crop to fit.
            </p>
          </div>
          <button
            type="button"
            disabled={busy || columns.length >= 3}
            onClick={() => change({ type: "addColumn" })}
            className={`${controlClass} flex items-center gap-2 px-3 py-2`}
          >
            <Plus size={14} /> Add column ({columns.length}/3)
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          {error}
        </p>
      )}
      {editing && <output className="sr-only">{busy ? "Saving gallery" : "Gallery saved"}</output>}
      <fieldset
        disabled={busy}
        aria-busy={busy}
        className={`grid min-w-0 grid-cols-1 items-start gap-4 ${gridClass}`}
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex min-w-0 flex-col gap-4">
            {editing && (
              <div className="flex min-h-8 items-center justify-between gap-2 text-xs text-white/60">
                <span>
                  Column {columnIndex + 1} · {column.length}{" "}
                  {column.length === 1 ? "image" : "images"}
                </span>
                {columns.length > 1 && column.length === 0 && (
                  <button
                    type="button"
                    aria-label={`Remove column ${columnIndex + 1}`}
                    onClick={() => change({ type: "removeColumn", column: columnIndex })}
                    className={controlClass}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
            {column.map((slot, index) => {
              if (!editing && !slot.url) return null
              return (
                <div key={slot.id}>
                  <button
                    type="button"
                    aria-label={
                      editing
                        ? `${slot.image ? "Replace" : "Upload"} image ${index + 1} in column ${columnIndex + 1}`
                        : `View ${title} image ${images.findIndex((image) => image.id === slot.id) + 1}`
                    }
                    onClick={() => {
                      if (editing) chooseImage(slot.id)
                      else
                        onView(
                          images.map((image) => image.url!),
                          images.findIndex((image) => image.id === slot.id),
                        )
                    }}
                    style={{ aspectRatio: cssRatio(slot.ratio) }}
                    className={`group relative block w-full overflow-hidden rounded-[16px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${slot.url ? "" : "border border-dashed border-white/30 bg-white/5 hover:border-white/70"}`}
                  >
                    {slot.url ? (
                      <>
                        <img
                          src={slot.url}
                          alt={`${title}, column ${columnIndex + 1}, item ${index + 1}`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                          {editing ? "Change image" : "View image"}
                        </span>
                      </>
                    ) : (
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-white/60">
                        <ImagePlus size={24} />
                        <span>{slot.ratio === "1:1" ? "Square" : slot.ratio}</span>
                        <span>Click to upload</span>
                      </span>
                    )}
                  </button>
                  {editing && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <select
                        aria-label={`Aspect ratio for image ${index + 1} in column ${columnIndex + 1}`}
                        value={slot.ratio}
                        onChange={(event) =>
                          change({
                            type: "setRatio",
                            id: slot.id,
                            ratio: event.target.value as typeof slot.ratio,
                          })
                        }
                        className={`${controlClass} bg-black`}
                      >
                        {aspectRatios.map((ratio) => (
                          <option key={ratio} value={ratio}>
                            {ratio === "1:1" ? "Square" : ratio}
                          </option>
                        ))}
                      </select>
                      {columns.length > 1 && (
                        <select
                          aria-label={`Move image ${index + 1} from column ${columnIndex + 1}`}
                          value={columnIndex}
                          onChange={(event) => {
                            const target = Number(event.target.value)
                            change({
                              type: "moveSlot",
                              id: slot.id,
                              column: target,
                              index: columns[target].length,
                            })
                          }}
                          className={`${controlClass} bg-black`}
                        >
                          {columns.map((_, target) => (
                            <option key={target} value={target}>
                              Column {target + 1}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        aria-label={`Move image ${index + 1} up in column ${columnIndex + 1}`}
                        disabled={index === 0}
                        onClick={() =>
                          change({
                            type: "moveSlot",
                            id: slot.id,
                            column: columnIndex,
                            index: index - 1,
                          })
                        }
                        className={controlClass}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move image ${index + 1} down in column ${columnIndex + 1}`}
                        disabled={index === column.length - 1}
                        onClick={() =>
                          change({
                            type: "moveSlot",
                            id: slot.id,
                            column: columnIndex,
                            index: index + 1,
                          })
                        }
                        className={controlClass}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove image ${index + 1} from column ${columnIndex + 1}`}
                        onClick={() => change({ type: "removeSlot", id: slot.id })}
                        className={controlClass}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
            {editing && (
              <div className="rounded-[16px] border border-dashed border-white/30 p-4">
                {addingTo === columnIndex ? (
                  <>
                    <div className="mb-3 flex items-center justify-between text-xs text-white/70">
                      <span>Choose an aspect ratio</span>
                      <button
                        type="button"
                        aria-label="Cancel adding image"
                        onClick={() => setAddingTo(null)}
                        className={controlClass}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aspectRatios.map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() =>
                            run(async () => {
                              await editGallery({
                                id: projectId,
                                edit: {
                                  type: "addSlot",
                                  column: columnIndex,
                                  id: crypto.randomUUID(),
                                  ratio,
                                },
                              })
                              setAddingTo(null)
                            })
                          }
                          className={`${controlClass} flex flex-1 flex-col items-center gap-2 p-3`}
                        >
                          <span className="flex h-8 items-center">
                            <span
                              className="block w-5 border border-current"
                              style={{ aspectRatio: cssRatio(ratio) }}
                            />
                          </span>
                          <span>{ratio === "1:1" ? "Square" : ratio}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingTo(columnIndex)}
                    className="flex w-full items-center justify-center gap-2 py-5 text-sm text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <Plus size={16} /> Add image
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </fieldset>
      {editing && (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          aria-label="Upload gallery image"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            const id = uploadSlot.current
            event.target.value = ""
            if (!file || !id) return
            void run(async () => {
              if (!file.type.startsWith("image/")) throw new Error("Choose an image file.")
              const url = await generateUploadUrl()
              const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
              })
              if (!response.ok)
                throw new Error("Image upload failed. Click the frame to try again.")
              const result = await response.json()
              if (typeof result.storageId !== "string")
                throw new Error("Image upload failed. Please try again.")
              await editGallery({
                id: projectId,
                edit: { type: "setImage", id, image: result.storageId as Id<"_storage"> },
              })
            })
          }}
        />
      )}
    </section>
  )
}
