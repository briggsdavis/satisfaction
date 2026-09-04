import { useMutation, useQuery } from "convex/react"
import { ImagePlus, Plus, Trash2, X } from "lucide-react"
import { AnimatePresence, motion, useInView } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { api } from "../../../convex/_generated/api"
import type { Doc, Id } from "../../../convex/_generated/dataModel"

type Category = Doc<"categories">
type Showcase = Doc<"webShowcases">

const RADIUS = 2400
const STEP = 22

const StorageImage = ({ id, className }: { id: Id<"_storage">; className: string }) => {
  const src = useQuery(api.files.getUrl, { storageId: id })
  return src ? <img src={src} alt="" className={className} /> : null
}

const Screen = ({ item }: { item: Showcase }) => {
  const src = useQuery(api.files.getUrl, { storageId: item.media })
  if (!src) return null
  return item.mediaType === "video" ? (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className="h-full w-full object-cover object-top"
    />
  ) : (
    <img src={src} alt="" className="h-full w-full object-cover object-top" />
  )
}

const IMac = ({ item }: { item?: Showcase }) => (
  <div className="relative aspect-3/2 w-[72vw] max-w-5xl">
    <div className="absolute top-[7.3%] left-[15.7%] h-[61.2%] w-[68.6%] overflow-hidden bg-neutral-950">
      {item ? <Screen item={item} /> : null}
    </div>
    <img
      src="/mock/web/imac-frame.png"
      alt=""
      draggable={false}
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
    />
  </div>
)

const offsetFrom = (index: number, active: number, length: number) => {
  let offset = index - active
  if (offset > length / 2) offset -= length
  if (offset < -length / 2) offset += length
  return offset
}

export const WebDevelopmentHero = ({
  category,
  editing,
}: {
  category: Category
  editing?: boolean
  onNameCommit?: (name: string) => void
}) => {
  const items = useQuery(api.portfolio.listWebShowcases, { categoryId: category._id }) ?? []
  const create = useMutation(api.portfolio.createWebShowcase)
  const update = useMutation(api.portfolio.updateWebShowcase)
  const remove = useMutation(api.portfolio.removeWebShowcase)
  const uploadUrl = useMutation(api.files.generateUploadUrl)
  const mediaInput = useRef<HTMLInputElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)
  const stage = useRef<HTMLElement>(null)
  const creating = useRef(false)
  const supportIndex = useRef(0)
  const visible = useInView(stage, { amount: 0.35 })
  const [active, setActive] = useState(0)
  const activeIndex = items.length ? active % items.length : 0
  const current = items[activeIndex]

  useEffect(() => {
    if (editing || !visible || items.length < 2) return
    const id = setTimeout(() => setActive((i) => (i + 1) % items.length), 5000)
    return () => clearTimeout(id)
  }, [active, editing, items.length, visible])

  const upload = async (file: File) => {
    const response = await fetch(await uploadUrl(), {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })
    return ((await response.json()) as { storageId: Id<"_storage"> }).storageId
  }
  const chooseMedia = (add: boolean) => {
    creating.current = add
    mediaInput.current?.click()
  }
  const handleMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    const media = await upload(file)
    const mediaType = file.type.startsWith("video/") ? "video" : "image"
    if (creating.current) {
      await create({ categoryId: category._id, media, mediaType })
      setActive(items.length)
    } else if (current) await update({ id: current._id, media, mediaType })
  }
  const handleSupport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || !current) return
    const supportImages = [...current.supportImages]
    supportImages[supportIndex.current] = await upload(file)
    await update({ id: current._id, supportImages })
  }
  const go = (delta: number) => setActive((i) => (i + delta + items.length) % items.length)

  return (
    <section className="overflow-hidden bg-black">
      <section ref={stage} className="relative h-screen min-h-[640px] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center [perspective:1600px]">
          <div
            className="relative h-2/3 w-full [transform-style:preserve-3d]"
            style={{ transform: `translateZ(-${RADIUS}px)` }}
          >
            {items.length ? (
              items.map((item, itemIndex) => {
                const offset = offsetFrom(itemIndex, active % items.length, items.length)
                return (
                  <div
                    key={item._id}
                    className="absolute top-1/2 left-1/2 transition-[transform,opacity] duration-1000 ease-[cubic-bezier(.65,0,.35,1)] [transform-style:preserve-3d]"
                    style={{
                      opacity: Math.abs(offset) >= 2 ? 0 : 1 - Math.abs(offset) * 0.18,
                      transform: `translate(-50%, -50%) rotateY(${offset * STEP}deg) translateZ(${RADIUS}px)`,
                      zIndex: 10 - Math.abs(offset),
                    }}
                  >
                    <IMac item={item} />
                  </div>
                )
              })
            ) : (
              <div
                className="absolute top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -50%) translateZ(${RADIUS}px)` }}
              >
                <IMac />
              </div>
            )}
          </div>
        </div>

        {items.length > 1 ? (
          <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-5">
            <button
              onClick={() => go(-1)}
              aria-label="Previous website"
              className="btn-industrial-sm"
            >
              ←
            </button>
            <span className="w-16 text-center font-mono text-xs text-white/50">
              {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <button onClick={() => go(1)} aria-label="Next website" className="btn-industrial-sm">
              →
            </button>
          </div>
        ) : null}

        {editing ? (
          <div className="absolute top-28 right-8 z-30 flex gap-2 md:right-16">
            {current ? (
              <>
                <button onClick={() => chooseMedia(false)} className="btn-industrial-sm">
                  <ImagePlus size={14} /> Change screen
                </button>
                <button
                  onClick={() => remove({ id: current._id })}
                  aria-label="Remove website"
                  className="btn-industrial-sm"
                >
                  <Trash2 size={14} />
                </button>
              </>
            ) : null}
            <button onClick={() => chooseMedia(true)} className="btn-industrial-sm">
              <Plus size={14} /> Add website
            </button>
          </div>
        ) : null}
      </section>

      {current ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            className="mx-auto grid max-w-5xl grid-cols-3 gap-5 px-8 pb-24 md:px-16"
            initial={{ opacity: 0, y: 160 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {Array.from({ length: editing ? 3 : current.supportImages.length }, (_slot, slot) => {
              const image = current.supportImages[slot]
              return (
                <div
                  key={image ?? slot}
                  className="group relative aspect-video overflow-hidden bg-white/5"
                >
                  {image ? (
                    <StorageImage id={image} className="h-full w-full object-cover" />
                  ) : null}
                  {editing ? (
                    <>
                      <button
                        onClick={() => {
                          supportIndex.current = slot
                          imageInput.current?.click()
                        }}
                        disabled={slot > current.supportImages.length}
                        className="absolute inset-0 flex items-center justify-center gap-2 border border-dashed border-white/30 bg-black/30 text-xs font-bold tracking-wider uppercase opacity-0 transition-opacity enabled:group-hover:opacity-100 disabled:hidden"
                      >
                        <ImagePlus size={15} /> {image ? "Change image" : "Add image"}
                      </button>
                      {image ? (
                        <button
                          onClick={() =>
                            update({
                              id: current._id,
                              supportImages: current.supportImages.filter(
                                (_imageId, imageIndex) => imageIndex !== slot,
                              ),
                            })
                          }
                          aria-label="Remove supporting image"
                          className="absolute top-3 right-3 grid h-8 w-8 place-items-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      ) : null}

      {editing ? (
        <>
          <input
            ref={mediaInput}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleMedia}
          />
          <input
            ref={imageInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSupport}
          />
        </>
      ) : null}
    </section>
  )
}
