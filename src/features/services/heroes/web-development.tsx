import { useMutation, useQuery } from "convex/react"
import { ImagePlus, Plus, Trash2 } from "lucide-react"
import { AnimatePresence, motion, useInView } from "motion/react"
import { useEffect, useRef, useState, type RefObject } from "react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { useEditing } from "../../../edit/edit-mode"
import { useMobile } from "../../../lib/hooks"
import { ease } from "../../../lib/motion"
import type { Showcase } from "../../../lib/types"
import { mediaTypeOf, useFilePicker, useUpload } from "../../../lib/upload"
import { ShowcaseGallery } from "../showcase-gallery"
import type { HeroProps } from "./types"

const RADIUS = 2400
const STEP = 22
const REAR_SLOTS = Array.from({ length: 9 }, (_, index) => index)

const wrapIndex = (index: number, length: number) => ((index % length) + length) % length

const Screen = ({
  src,
  mediaType,
  videoRef,
  canvasRef,
}: {
  src: string | null | undefined
  mediaType?: Showcase["media"]["type"]
  videoRef?: RefObject<HTMLVideoElement | null>
  canvasRef?: RefObject<HTMLCanvasElement | null>
}) => {
  if (!src) return null
  if (mediaType === "video" && canvasRef) {
    return <canvas ref={canvasRef} className="h-full w-full object-cover object-center" />
  }
  return mediaType === "video" ? (
    <video
      ref={videoRef}
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
}) => {
  const src = item?.media.url
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!video || !canvas || !context) return

    let frame: number
    let lastTime = -1
    const draw = () => {
      if (video.readyState >= 2 && video.currentTime !== lastTime) {
        // Copy the playing video so the reflection shares its exact playback position.
        const width = Math.min(video.videoWidth, 1280)
        const height = Math.round((width * video.videoHeight) / video.videoWidth)
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }
        context.drawImage(video, 0, 0, width, height)
        lastTime = video.currentTime
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [src, item?.media.type])

  const display = (reflected: boolean) => (
    <>
      <div className="absolute top-[7.3%] left-[15.7%] h-[61.2%] w-[68.6%] scale-[1.04] overflow-hidden bg-neutral-950">
        <Screen
          src={src}
          mediaType={item?.media.type}
          videoRef={reflected ? undefined : videoRef}
          canvasRef={reflected ? canvasRef : undefined}
        />
      </div>
      <img
        src="/heroes/web-development/imac-front.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />
    </>
  )

  return (
    <div className="relative aspect-3/2 w-[72vw] max-w-5xl">
      {display(false)}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[97%] left-0 h-full w-full"
        style={{
          opacity: 0.5,
          filter: "blur(8px)",
          maskImage: "linear-gradient(to bottom, black, transparent 65%)",
        }}
      >
        <div className="absolute inset-0 -scale-y-100">{display(true)}</div>
      </div>
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
          className="absolute top-[9%] right-[17%] z-20 flex size-10 items-center justify-center border border-white/30 bg-black/80 text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
              className={`absolute top-[38%] z-20 flex size-11 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/80 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${position}`}
            >
              <Plus size={22} />
            </button>
          ))
        : null}
    </div>
  )
}

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
          className="pointer-events-none absolute top-1/2 left-1/2 transition-[transform,opacity] duration-300 ease-[cubic-bezier(.65,0,.35,1)] motion-reduce:transition-none md:duration-1000"
          style={{
            opacity: Math.abs(offset) >= 4 ? 0 : 0.65,
            transform: `translate(-50%, -50%) rotateY(${180 + offset * STEP}deg) translateZ(${RADIUS}px) rotateY(180deg)`,
          }}
        >
          <div className="relative aspect-3/2 w-[72vw] max-w-5xl">
            <img
              src="/heroes/web-development/imac-back.png"
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

export const WebDevelopmentHero = ({ service }: HeroProps) => {
  const editing = useEditing()
  const mobile = useMobile()
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const items = useQuery(api.showcases.list, { serviceId: service._id }) ?? []
  const create = useMutation(api.showcases.create)
  const update = useMutation(api.showcases.update)
  const remove = useMutation(api.showcases.remove)
  const upload = useUpload()
  const stage = useRef<HTMLElement>(null)
  const visible = useInView(stage, { amount: 0.35 })
  const [active, setActive] = useState(0)
  const activeIndex = items.length ? wrapIndex(active, items.length) : 0
  const current = items[activeIndex]

  useEffect(() => {
    if (mobile || editing || !visible || items.length < 2) return
    const id = setTimeout(() => setActive((i) => i + 1), 4000)
    return () => clearTimeout(id)
  }, [active, editing, items.length, visible, mobile])

  // `target` null = add a new website; otherwise replace that screen.
  const picker = useFilePicker<Id<"showcases"> | null>(
    async ([file], target) => {
      const type = mediaTypeOf(file)
      if (!type) return
      const media = { id: await upload(file), type }
      if (target === null) {
        await create({ serviceId: service._id, media })
        setActive(items.length)
      } else await update({ id: target, patch: { media } })
    },
    { accept: "image/*,video/*" },
  )
  const chooseMedia = (target: Id<"showcases"> | null) => picker.pick(target)
  const go = (delta: number) => setActive((i) => i + delta)

  return (
    <section
      className="relative isolate overflow-hidden bg-black"
      onTouchStart={(e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current
        touchStart.current = null
        if (!mobile || !start) return
        const dx = e.changedTouches[0].clientX - start.x
        const dy = e.changedTouches[0].clientY - start.y
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
      }}
    >
      <h1 className="absolute inset-x-8 top-28 z-20 text-center font-display text-4xl uppercase md:hidden">
        {service.name}
      </h1>
      {/* Keep the scene taller than the hero so reflections can fade behind the gallery. */}
      <div className="absolute inset-x-0 top-0 h-[calc(max(100vh,640px)+min(48vw,683px)+24px)] overflow-hidden">
        <div className="absolute inset-x-0 top-0 flex h-screen min-h-[640px] items-center justify-center [perspective:1600px]">
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
                    className="absolute top-1/2 left-1/2 transition-[transform,opacity] duration-300 ease-[cubic-bezier(.65,0,.35,1)] [transform-style:preserve-3d] motion-reduce:transition-none md:duration-1000"
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
      </div>
      <section ref={stage} className="pointer-events-none relative h-screen min-h-[640px]">
        {items.length > 1 ? (
          <div className="pointer-events-auto absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-5">
            <button
              onClick={() => go(-1)}
              aria-label="Previous website"
              className="btn-industrial-sm hidden md:block"
            >
              ←
            </button>
            <span className="w-16 text-center font-mono text-xs text-white/50">
              <span className="mb-2 block md:hidden">Swipe ↔</span>
              {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => go(1)}
              aria-label="Next website"
              className="btn-industrial-sm hidden md:block"
            >
              →
            </button>
          </div>
        ) : null}
      </section>

      {current ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            className="relative z-10 mx-auto max-w-5xl px-8 pb-24 md:px-16"
            initial={{ opacity: 0, y: 160 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.85, ease }}
          >
            <ShowcaseGallery item={current} />
          </motion.div>
        </AnimatePresence>
      ) : null}

      {editing && picker.input}
    </section>
  )
}
