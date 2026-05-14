import { useQuery } from "convex/react"
import { motion, MotionValue, useTransform } from "motion/react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"

type SlotDef = {
  top: string
  left: string
  width: string
  height: string
  delay: number
  duration: number
  zoomIn: boolean
  rotation: number
}

// Slot layout (positions/sizes/timing) is fixed in code — admin only swaps the 10 images.
const SLOTS: SlotDef[] = [
  // A — top-left: laptop / coding photo (landscape ~3:2)
  {
    top: "12vh",
    left: "16vw",
    width: "14vw",
    height: "9.5vw",
    delay: 0,
    duration: 4.8,
    zoomIn: false,
    rotation: -4,
  },
  // J — upper-left: creative workspace (landscape ~3:2)
  {
    top: "16vh",
    left: "2vw",
    width: "11vw",
    height: "7.5vw",
    delay: 1.0,
    duration: 5.0,
    zoomIn: false,
    rotation: 3,
  },
  // B — top-centre: icon / UI graphic (square)
  {
    top: "10vh",
    left: "53vw",
    width: "9.5vw",
    height: "9.5vw",
    delay: 0.3,
    duration: 5.2,
    zoomIn: true,
    rotation: 6,
  },
  // C — top-right: UI / website screenshot (very wide landscape ~16:7.5)
  {
    top: "13vh",
    left: "73vw",
    width: "18vw",
    height: "8vw",
    delay: 0.6,
    duration: 4.6,
    zoomIn: false,
    rotation: -3,
  },
  // D — left: photo / video studio (wide landscape ~5:3)
  {
    top: "36vh",
    left: "3vw",
    width: "18vw",
    height: "11vw",
    delay: 0.9,
    duration: 5.4,
    zoomIn: true,
    rotation: 5,
  },
  // E — centre-left: graphic design card (near-square)
  {
    top: "53vh",
    left: "22vw",
    width: "11vw",
    height: "10vw",
    delay: 0.2,
    duration: 4.9,
    zoomIn: false,
    rotation: -6,
  },
  // F — right: brand / logo card (small near-square)
  {
    top: "35vh",
    left: "71.5vw",
    width: "6vw",
    height: "7vw",
    delay: 1.1,
    duration: 5.7,
    zoomIn: true,
    rotation: 8,
  },
  // G — far-right: camera lens (large square)
  {
    top: "32vh",
    left: "80vw",
    width: "16vw",
    height: "16vw",
    delay: 0.7,
    duration: 4.3,
    zoomIn: false,
    rotation: -2,
  },
  // H — bottom-left: phone app mockup (portrait ~3:4)
  {
    top: "75vh",
    left: "10.5vw",
    width: "7vw",
    height: "10vw",
    delay: 1.3,
    duration: 5.1,
    zoomIn: true,
    rotation: -7,
  },
  // I — bottom-right: portfolio / lifestyle (landscape ~16:9.5)
  {
    top: "76vh",
    left: "76vw",
    width: "17.5vw",
    height: "10vw",
    delay: 0.4,
    duration: 5.8,
    zoomIn: true,
    rotation: 4,
  },
]

const ScatteredImage = ({
  slot,
  src,
  scrollProgress,
}: {
  slot: SlotDef
  src: string
  scrollProgress: MotionValue<number>
}) => {
  const scrollScale = useTransform(
    scrollProgress,
    [0, 1],
    slot.zoomIn ? [1, 1.5] : [1, 0.1],
  )

  const scrollOpacity = useTransform(scrollProgress, [0, 0.8], [1, 0])
  const blurPx = useTransform(scrollProgress, [0, 0.8], [0, 12])
  const blurFilter = useTransform(blurPx, (b: number) =>
    !slot.zoomIn ? `blur(${b}px)` : "none",
  )

  return (
    <motion.div
      style={{
        position: "absolute",
        top: slot.top,
        left: slot.left,
        width: slot.width,
        height: slot.height,
        scale: scrollScale,
        rotate: slot.rotation,
        boxShadow: "0 20px 50px -8px rgba(0,0,0,0.75)",
        ...(slot.zoomIn ? {} : { opacity: scrollOpacity }),
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <motion.img
          src={src}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          style={{ borderRadius: "16px", filter: blurFilter }}
          animate={{ scale: [1, 1.03, 1], opacity: [0.72, 0.88, 0.72] }}
          transition={{
            duration: slot.duration,
            delay: slot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          height: "45%",
          overflow: "hidden",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
          pointerEvents: "none",
          ...(slot.zoomIn ? { opacity: scrollOpacity } : {}),
        }}
      >
        <img
          src={src}
          alt=""
          aria-hidden
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleY(-1)",
            filter: "blur(10px)",
            opacity: 0.6,
            borderRadius: "16px",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

const ResolvedScatteredImage = ({
  slot,
  storageId,
  scrollProgress,
}: {
  slot: SlotDef
  storageId: Id<"_storage">
  scrollProgress: MotionValue<number>
}) => {
  const url = useQuery(api.files.getUrl, { storageId })
  if (!url) return null
  return (
    <ScatteredImage slot={slot} src={url} scrollProgress={scrollProgress} />
  )
}

export function ScatteredImages({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  const homepage = useQuery(api.homepage.get)
  const bySlot = new Map<number, Id<"_storage">>()
  for (const entry of homepage?.heroImages ?? []) {
    bySlot.set(entry.slot, entry.image)
  }
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      {SLOTS.map((slot, i) => {
        const id = bySlot.get(i)
        if (!id) return null
        return (
          <ResolvedScatteredImage
            key={i}
            slot={slot}
            storageId={id}
            scrollProgress={scrollProgress}
          />
        )
      })}
    </div>
  )
}
