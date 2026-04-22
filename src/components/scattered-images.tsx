import { motion, MotionValue, useTransform } from "motion/react"

type ImageDef = {
  src: string
  top: string
  left: string
  size: string
  rotate: number
  delay: number
  duration: number
  zoomIn: boolean
}

// 6 images placed on an ellipse centred on the viewport (50vw, 50vh).
// Ellipse radii: rx = 28vw, ry = 26vh.
// Clock positions, alternating zoom-out / zoom-in:
//   0 → 12 o'clock  (zoom out)
//   1 →  2 o'clock  (zoom in)
//   2 →  4 o'clock  (zoom out)
//   3 →  6 o'clock  (zoom in)
//   4 →  8 o'clock  (zoom out)
//   5 → 10 o'clock  (zoom in)
//
// top/left are the top-left corner of the image, so each axis subtracts size/2.
const IMAGES: ImageDef[] = [
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    top: "calc(24vh - 6.5vmin)",
    left: "calc(50vw - 6.5vmin)",
    size: "13vmin",
    rotate: -8,
    delay: 0,
    duration: 4.2,
    zoomIn: false,
  },
  {
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    top: "calc(37vh - 7.5vmin)",
    left: "calc(74vw - 7.5vmin)",
    size: "15vmin",
    rotate: 6,
    delay: 0.6,
    duration: 5.1,
    zoomIn: true,
  },
  {
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    top: "calc(63vh - 6vmin)",
    left: "calc(74vw - 6vmin)",
    size: "12vmin",
    rotate: 5,
    delay: 1.1,
    duration: 4.8,
    zoomIn: false,
  },
  {
    src: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80",
    top: "calc(76vh - 5.5vmin)",
    left: "calc(50vw - 5.5vmin)",
    size: "11vmin",
    rotate: -4,
    delay: 0.3,
    duration: 5.6,
    zoomIn: true,
  },
  {
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
    top: "calc(63vh - 6vmin)",
    left: "calc(26vw - 6vmin)",
    size: "12vmin",
    rotate: -6,
    delay: 1.4,
    duration: 4.9,
    zoomIn: false,
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    top: "calc(37vh - 7vmin)",
    left: "calc(26vw - 7vmin)",
    size: "14vmin",
    rotate: 7,
    delay: 0.8,
    duration: 5.3,
    zoomIn: true,
  },
]

const ScatteredImage = ({
  img,
  scrollProgress,
}: {
  img: ImageDef
  scrollProgress: MotionValue<number>
}) => {
  // zoom-out: shrink to nothing; zoom-in: grow significantly
  const scrollScale = useTransform(
    scrollProgress,
    [0, 1],
    img.zoomIn ? [1, 2.6] : [1, 0.1],
  )

  // only zoom-out images fade; zoom-in images stay fully visible
  const scrollOpacity = useTransform(scrollProgress, [0, 0.8], [1, 0])

  return (
    <motion.div
      style={{
        position: "absolute",
        top: img.top,
        left: img.left,
        width: img.size,
        height: img.size,
        rotate: img.rotate,
        scale: scrollScale,
        ...(img.zoomIn ? {} : { opacity: scrollOpacity }),
      }}
    >
      <motion.img
        src={img.src}
        alt=""
        aria-hidden
        className="h-full w-full rounded-md object-cover shadow-2xl shadow-black/50"
        animate={{ scale: [1, 1.03, 1], opacity: [0.78, 0.9, 0.78] }}
        transition={{
          duration: img.duration,
          delay: img.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

export function ScatteredImages({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      {IMAGES.map((img, i) => (
        <ScatteredImage key={i} img={img} scrollProgress={scrollProgress} />
      ))}
    </div>
  )
}
