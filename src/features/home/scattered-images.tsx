import { useQuery } from "convex/react"
import { motion, MotionValue, useTransform } from "motion/react"
import { api } from "../../../convex/_generated/api"
import { useMobile } from "../../lib/hooks"

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

// Slot layout (positions/sizes/timing) is fixed in code; admin only swaps the images.
// Keep in sync with the hints in admin/pages/homepage.tsx.
const SLOTS: SlotDef[] = [
  // A — top-left: laptop / coding photo (landscape ~3:2)
  {
    top: "12%",
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
    top: "16%",
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
    top: "10%",
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
    top: "13%",
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
    top: "36%",
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
    top: "53%",
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
    top: "35%",
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
    top: "32%",
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
    top: "75%",
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
    top: "76%",
    left: "76vw",
    width: "17.5vw",
    height: "10vw",
    delay: 0.4,
    duration: 5.8,
    zoomIn: true,
    rotation: 4,
  },
]

// Mobile: 8 images ring the narrower model. The four "keep" boxes sit in the
// corners and zoom in on scroll; the four inner ones blur and fade out, so the
// layout resolves from 8 to 4 as the model arrives.
const MOBILE_SLOTS: SlotDef[] = [
  // keep: top-left, top-right, bottom-left, bottom-right
  {
    top: "3%",
    left: "4.6vw",
    width: "28.9vw",
    height: "19.3vw",
    zoomIn: true,
    rotation: -4,
    delay: 0,
    duration: 4.8,
  },
  {
    top: "6%",
    left: "64.7vw",
    width: "30.6vw",
    height: "14.4vw",
    zoomIn: true,
    rotation: 3,
    delay: 0.6,
    duration: 4.6,
  },
  {
    top: "74%",
    left: "5.0vw",
    width: "22.1vw",
    height: "20.4vw",
    zoomIn: true,
    rotation: -5,
    delay: 0.2,
    duration: 4.9,
  },
  {
    top: "72%",
    left: "72.0vw",
    width: "22.9vw",
    height: "22.9vw",
    zoomIn: true,
    rotation: 4,
    delay: 0.7,
    duration: 4.3,
  },
  // fade: upper-centre, left, right, lower-centre
  {
    top: "20%",
    left: "31.9vw",
    width: "22.1vw",
    height: "14.7vw",
    zoomIn: false,
    rotation: 5,
    delay: 1.0,
    duration: 5.0,
  },
  {
    top: "38%",
    left: "-2.3vw",
    width: "18.7vw",
    height: "18.7vw",
    zoomIn: false,
    rotation: 6,
    delay: 0.3,
    duration: 5.2,
  },
  {
    top: "42%",
    left: "80.1vw",
    width: "23.8vw",
    height: "14.3vw",
    zoomIn: false,
    rotation: -3,
    delay: 0.9,
    duration: 5.4,
  },
  {
    top: "70%",
    left: "41.4vw",
    width: "15.3vw",
    height: "17.8vw",
    zoomIn: false,
    rotation: -7,
    delay: 1.1,
    duration: 5.7,
  },
]

const ScatteredImage = ({
  slot,
  src,
  progress,
}: {
  slot: SlotDef
  src: string
  progress: MotionValue<number>
}) => {
  const scrollScale = useTransform(progress, [0, 1], slot.zoomIn ? [1, 1.5] : [1, 0.1])

  const scrollOpacity = useTransform(progress, [0, 0.8], [1, 0])
  const blurPx = useTransform(progress, [0, 0.8], [0, 12])
  const blurFilter = useTransform(blurPx, (b: number) => (!slot.zoomIn ? `blur(${b}px)` : "none"))

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
          className="h-full w-full rounded-md object-cover md:rounded-2xl"
          style={{ filter: blurFilter }}
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
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
          pointerEvents: "none",
          ...(slot.zoomIn ? { opacity: scrollOpacity } : {}),
        }}
      >
        <img
          src={src}
          alt=""
          aria-hidden
          className="rounded-md md:rounded-2xl"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleY(-1)",
            filter: "blur(10px)",
            opacity: 0.6,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export const ScatteredImages = ({ progress }: { progress: MotionValue<number> }) => {
  const urls = useQuery(api.site.get)?.heroImageUrls ?? []
  const mobile = useMobile()
  const placed: [SlotDef, string][] = mobile
    ? urls
        .filter((url): url is string => !!url)
        .slice(0, MOBILE_SLOTS.length)
        .map((url, i) => [MOBILE_SLOTS[i], url])
    : SLOTS.flatMap((slot, i) => (urls[i] ? [[slot, urls[i]] as [SlotDef, string]] : []))
  return (
    <div className="absolute inset-0 overflow-hidden">
      {placed.map(([slot, src], i) => (
        <ScatteredImage key={`${mobile}-${i}`} slot={slot} src={src} progress={progress} />
      ))}
    </div>
  )
}
