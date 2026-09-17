import { useMutation } from "convex/react"
import { ImagePlus, X } from "lucide-react"
import { useRef, useState } from "react"
import { api } from "../../convex/_generated/api"
import type { Doc, Id } from "../../convex/_generated/dataModel"
import { useStorageUrl } from "../lib/storage"
import { GalleryTemplateGrid } from "./gallery-template-grid"

const SupportFrame = ({
  image,
  index,
  editing,
  busy,
  onChoose,
  onClear,
}: {
  image: Id<"_storage"> | null | undefined
  index: number
  editing: boolean
  busy: boolean
  onChoose: () => void
  onClear: () => void
}) => {
  const url = useStorageUrl(image)
  if (!editing) {
    return url ? (
      <img
        src={url}
        alt={`Website detail ${index + 1}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    ) : null
  }

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={onChoose}
        aria-label={`${image ? "Replace" : "Upload"} supporting image in frame ${index + 1}`}
        className={`absolute inset-0 h-full w-full rounded-[16px] text-white/40 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white disabled:cursor-wait ${image ? "" : "bg-white/5 hover:text-white/70"}`}
      >
        {url ? (
          <img
            src={url}
            alt={`Website detail ${index + 1}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : null}
        {!image && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-px rounded-[15px] border border-dashed border-white/25 group-hover:border-white/60"
          />
        )}
        <span
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs ${image ? "bg-black/30 text-white opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100" : ""}`}
        >
          <ImagePlus size={24} />
          {image ? "Change image" : "Upload image"}
        </span>
      </button>
      {image && (
        <button
          type="button"
          disabled={busy}
          onClick={onClear}
          aria-label={`Clear supporting frame ${index + 1}`}
          className="absolute top-3 right-3 rounded-full bg-black/70 p-2 text-white/80 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40"
        >
          <X size={16} />
        </button>
      )}
    </>
  )
}

export const WebShowcaseGallery = ({
  item,
  editing,
}: {
  item: Doc<"webShowcases">
  editing: boolean
}) => {
  const edit = useMutation(api.portfolio.editWebShowcaseSupport)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const input = useRef<HTMLInputElement>(null)
  const target = useRef<number | null>(null)
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
      setError(cause instanceof Error ? cause.message : "Could not save the supporting images.")
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  if (!editing && !item.supportImages.some(Boolean)) return null

  return (
    <section aria-label="Website supporting images">
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          {error}
        </p>
      )}
      <GalleryTemplateGrid
        template="short"
        slotCount={item.supportImages.length}
        busy={busy}
        isFrameVisible={editing ? undefined : (index) => Boolean(item.supportImages[index])}
        renderFrame={(index) => (
          <SupportFrame
            image={item.supportImages[index]}
            index={index}
            editing={editing}
            busy={busy}
            onChoose={() => {
              target.current = index
              input.current?.click()
            }}
            onClear={() => void run(() => edit({ id: item._id, index }))}
          />
        )}
      />
      {editing && (
        <input
          ref={input}
          type="file"
          accept="image/*"
          aria-label="Upload website supporting image"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            const index = target.current
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
              await edit({ id: item._id, index, image: result.storageId })
            })
          }}
        />
      )}
    </section>
  )
}
