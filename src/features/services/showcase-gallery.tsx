import { useMutation } from "convex/react"
import { ImagePlus, X } from "lucide-react"
import { api } from "../../../convex/_generated/api"
import { slotCapacity } from "../../../convex/lib/gallery"
import { useEditing } from "../../edit/edit-mode"
import { useTask } from "../../lib/hooks"
import type { Showcase } from "../../lib/types"
import { mediaTypeOf, useFilePicker, useUpload } from "../../lib/upload"
import { GalleryGrid } from "../../ui/gallery-grid"

type Slot = Showcase["support"][number]

const Media = ({ slot, index }: { slot: NonNullable<Slot>; index: number }) =>
  !slot.url ? null : slot.type === "video" ? (
    <video
      src={slot.url}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover"
    />
  ) : (
    <img
      src={slot.url}
      alt={`Website detail ${index + 1}`}
      loading="lazy"
      className="h-full w-full object-cover"
    />
  )

/** Supporting stills/clips under each website, laid out on the compact template. */
export const ShowcaseGallery = ({ item }: { item: Showcase }) => {
  const editing = useEditing()
  const setSupport = useMutation(api.showcases.setSupport)
  const upload = useUpload()
  const { run, busy, error } = useTask()
  const picker = useFilePicker<number>(
    ([file], index) =>
      void run(async () => {
        const type = mediaTypeOf(file)
        if (!type) throw new Error("Choose an image or video file.")
        await setSupport({ id: item._id, index, media: { id: await upload(file), type } })
      }),
    { accept: "image/*,video/*" },
  )

  if (!editing && !item.support.some(Boolean)) return null

  return (
    <section aria-label="Website supporting media">
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          {error}
        </p>
      )}
      <GalleryGrid
        template="short"
        slotCount={editing ? slotCapacity(item.support, "short") : item.support.length}
        busy={busy}
        isVisible={editing ? undefined : (i) => Boolean(item.support[i])}
        renderFrame={(index) => {
          const slot = item.support[index]
          if (!editing)
            return (
              slot && (
                <div className="absolute inset-0">
                  <Media slot={slot} index={index} />
                </div>
              )
            )
          return (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => picker.pick(index)}
                aria-label={`${slot ? "Replace" : "Upload"} media in frame ${index + 1}`}
                className={`absolute inset-0 h-full w-full rounded-[16px] text-white/40 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white disabled:cursor-wait ${slot ? "" : "bg-white/5 hover:text-white/70"}`}
              >
                {slot && <Media slot={slot} index={index} />}
                {!slot && (
                  <span className="pointer-events-none absolute inset-px rounded-[15px] border border-dashed border-white/25 group-hover:border-white/60" />
                )}
                <span
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs ${slot ? "bg-black/30 text-white opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100" : ""}`}
                >
                  <ImagePlus size={24} />
                  {slot ? "Change media" : "Upload media"}
                </span>
              </button>
              {slot && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void run(() => setSupport({ id: item._id, index, media: null }))}
                  aria-label={`Clear frame ${index + 1}`}
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
    </section>
  )
}
