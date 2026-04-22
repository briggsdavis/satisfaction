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

// zoomIn: true  → image grows slightly as user scrolls (scale 1 → 1.1)
// zoomIn: false → image shrinks away as user scrolls  (scale 1 → 0.72)
const IMAGES: ImageDef[] = [
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    top: "22%",
    left: "18%",
    size: "14vmin",
    rotate: -8,
    delay: 0,
    duration: 4.2,
    zoomIn: false,
  },
  {
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    top: "26%",
    left: "68%",
    size: "16vmin",
    rotate: 6,
    delay: 0.6,
    duration: 5.1,
    zoomIn: true,
  },
  {
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    top: "62%",
    left: "30%",
    size: "12vmin",
    rotate: 5,
    delay: 1.1,
    duration: 4.8,
    zoomIn: false,
  },
  {
    src: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80",
    top: "64%",
    left: "60%",
    size: "13vmin",
    rotate: -6,
    delay: 0.3,
    duration: 5.6,
    zoomIn: true,
  },
  {
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
    top: "18%",
    left: "calc(50% - 5vmin)",
    size: "10vmin",
    rotate: -4,
    delay: 1.4,
    duration: 4.9,
    zoomIn: false,
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    top: "45%",
    left: "8%",
    size: "11vmin",
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
  const scrollScale = useTransform(
    scrollProgress,
    [0, 1],
    img.zoomIn ? [1, 1.1] : [1, 0.72],
  )

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
      }}
    >
      <motion.img
        src={img.src}
        alt=""
        aria-hidden
        className="h-full w-full rounded-md object-cover shadow-2xl shadow-black/50"
        animate={{ scale: [1, 1.03, 1], opacity: [0.75, 0.82, 0.75] }}
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
  const opacity = useTransform(scrollProgress, [0, 0.75], [1, 0])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden"
      style={{ opacity }}
    >
      {IMAGES.map((img, i) => (
        <ScatteredImage key={i} img={img} scrollProgress={scrollProgress} />
      ))}
    </motion.div>
  )
}
