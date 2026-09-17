import { useMutation, useQuery } from "convex/react"
import { ImagePlus, Plus, Trash2 } from "lucide-react"
import { AnimatePresence, motion, useInView } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { api } from "../../../convex/_generated/api"
import type { Doc, Id } from "../../../convex/_generated/dataModel"
import { WebShowcaseGallery } from "../web-showcase-gallery"

type Category = Doc<"categories">
type Showcase = Doc<"webShowcases">

const RADIUS = 2400
const STEP = 22
const REAR_SLOTS = Array.from({ length: 9 }, (_, index) => index)

const wrapIndex = (index: number, length: number) => ((index % length) + length) % length

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
      className="h-full w-full object-cover object-center"
    />
  ) : (
    <img src={src} alt="" className="h-full w-full object-cover object-center" />
  )
}

const IMac = ({
  item,
  onChange,
  onRemove,
  onAdd,
}: {
  item?: Showcase
  onChange?: () => void
  onRemove?: () => void
  onAdd?: () => void
}) => (
  <div className="relative aspect-3/2 w-[72vw] max-w-5xl">
    <div className="absolute top-[7.3%] left-[15.7%] h-[61.2%] w-[68.6%] scale-[1.04] overflow-hidden bg-neutral-950">
      {item ? <Screen item={item} /> : null}
    </div>
    <img
      src="/mock/web/imac-frame.png"
      alt=""
      draggable={false}
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
    />
    {onChange ? (
      <button
        type="button"
        onClick={onChange}
        aria-label={item ? "Change website screen" : "Add website"}
        title={item ? "Click to change screen" : "Click to add website"}
        className="group absolute top-[7.3%] left-[15.7%] z-10 flex h-[61.2%] w-[68.6%] cursor-pointer items-center justify-center bg-transparent transition-colors hover:bg-black/30 focus-visible:bg-black/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span className="flex items-center gap-2 bg-black/80 px-4 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <ImagePlus size={16} /> {item ? "Change screen" : "Add website"}
        </span>
      </button>
    ) : null}
    {onRemove ? (
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove website"
        title="Remove website"
        className="absolute top-[9%] right-[17%] z-20 flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/80 text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <Trash2 size={16} />
      </button>
    ) : null}
    {onAdd
      ? ["left-[6%]", "right-[6%]"].map((position) => (
          <button
            key={position}
            type="button"
            onClick={onAdd}
            aria-label="Add website"
            title="Add website"
            className={`absolute top-[38%] z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${position}`}
          >
            <Plus size={22} />
          </button>
        ))
      : null}
  </div>
)

const offsetFrom = (index: number, active: number, length: number) => {
  let offset = index - active
  if (offset > length / 2) offset -= length
  if (offset < -length / 2) offset += length
  return offset
}

const RingBack = ({ active }: { active: number }) => (
  <>
    {REAR_SLOTS.map((index) => {
      const offset = offsetFrom(index, wrapIndex(active, REAR_SLOTS.length), REAR_SLOTS.length)
      return (
        <div
          key={index}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 transition-[transform,opacity] duration-1000 ease-[cubic-bezier(.65,0,.35,1)] motion-reduce:transition-none"
          style={{
            opacity: Math.abs(offset) >= 4 ? 0 : 0.65,
            transform: `translate(-50%, -50%) rotateY(${180 + offset * STEP}deg) translateZ(${RADIUS}px) rotateY(180deg)`,
          }}
        >
          <div className="relative aspect-3/2 w-[72vw] max-w-5xl">
            <img
              src="/imac-back.png"
              alt=""
              draggable={false}
              width={636}
              height={529}
              className="absolute top-[3%] left-[12.5%] h-auto w-3/4 select-none"
            />
          </div>
        </div>
      )
    })}
  </>
)

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
  const stage = useRef<HTMLElement>(null)
  const mediaTarget = useRef<Id<"webShowcases"> | null>(null)
  const visible = useInView(stage, { amount: 0.35 })
  const [active, setActive] = useState(0)
  const activeIndex = items.length ? wrapIndex(active, items.length) : 0
  const current = items[activeIndex]

  useEffect(() => {
    if (editing || !visible || items.length < 2) return
    const id = setTimeout(() => setActive((i) => i + 1), 4000)
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
  const chooseMedia = (id: Id<"webShowcases"> | null) => {
    mediaTarget.current = id
    mediaInput.current?.click()
  }
  const handleMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    const targetId = mediaTarget.current
    const media = await upload(file)
    const mediaType = file.type.startsWith("video/") ? "video" : "image"
    if (targetId === null) {
      await create({ categoryId: category._id, media, mediaType })
      setActive(items.length)
    } else await update({ id: targetId, media, mediaType })
  }
  const go = (delta: number) => setActive((i) => i + delta)

  return (
    <section className="overflow-hidden bg-black">
      <section ref={stage} className="relative h-screen min-h-[640px] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center [perspective:1600px]">
          <div
            className="relative h-2/3 w-full [transform-style:preserve-3d]"
            style={{ transform: `translateZ(-${RADIUS}px)` }}
          >
            <RingBack active={active} />
            {items.length ? (
              items.map((item, itemIndex) => {
                const offset = offsetFrom(itemIndex, activeIndex, items.length)
                const editable = editing && Math.abs(offset) < 2
                return (
                  <div
                    key={item._id}
                    className="absolute top-1/2 left-1/2 transition-[transform,opacity] duration-1000 ease-[cubic-bezier(.65,0,.35,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
                    style={{
                      opacity: Math.abs(offset) >= 2 ? 0 : 1,
                      transform: `translate(-50%, -50%) rotateY(${offset * STEP}deg) translateZ(${RADIUS}px)`,
                      zIndex: 10 - Math.abs(offset),
                    }}
                  >
                    <IMac
                      item={item}
                      onChange={editable ? () => chooseMedia(item._id) : undefined}
                      onRemove={editable ? () => void remove({ id: item._id }) : undefined}
                      onAdd={editing && offset === 0 ? () => chooseMedia(null) : undefined}
                    />
                  </div>
                )
              })
            ) : (
              <div
                className="absolute top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -50%) translateZ(${RADIUS}px)` }}
              >
                <IMac
                  onChange={editing ? () => chooseMedia(null) : undefined}
                  onAdd={editing ? () => chooseMedia(null) : undefined}
                />
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
      </section>

      {current ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            className="mx-auto max-w-5xl px-8 pb-24 md:px-16"
            initial={{ opacity: 0, y: 160 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <WebShowcaseGallery item={current} editing={Boolean(editing)} />
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
        </>
      ) : null}
    </section>
  )
}
