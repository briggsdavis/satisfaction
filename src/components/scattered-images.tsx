import { motion, MotionValue, useTransform } from "motion/react"

// Drop square images into public/scatter/ and list them here.
// Positions are viewport-relative (%) and sizes are vmin so they scale responsively.
const IMAGES: {
  src: string
  top: string
  left: string
  size: string
  rotate: number
  delay: number
  duration: number
}[] = [
  {
    src: "/nate.jpg",
    top: "22%",
    left: "18%",
    size: "14vmin",
    rotate: -8,
    delay: 0,
    duration: 4.2,
  },
  {
    src: "/nate.jpg",
    top: "26%",
    left: "68%",
    size: "16vmin",
    rotate: 6,
    delay: 0.6,
    duration: 5.1,
  },
  {
    src: "/nate.jpg",
    top: "62%",
    left: "30%",
    size: "12vmin",
    rotate: 5,
    delay: 1.1,
    duration: 4.8,
  },
  {
    src: "/nate.jpg",
    top: "64%",
    left: "60%",
    size: "13vmin",
    rotate: -6,
    delay: 0.3,
    duration: 5.6,
  },
  {
    src: "/nate.jpg",
    top: "18%",
    left: "calc(50% - 5vmin)",
    size: "10vmin",
    rotate: -4,
    delay: 1.4,
    duration: 4.9,
  },
]

export function ScatteredImages({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  const opacity = useTransform(scrollProgress, [0, 1], [1, 0.1])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden"
      style={{ opacity }}
    >
      {IMAGES.map((img, i) => (
        <motion.img
          key={i}
          src={img.src}
          alt=""
          aria-hidden
          className="absolute rounded-md shadow-2xl shadow-black/50"
          style={{
            top: img.top,
            left: img.left,
            width: img.size,
            height: img.size,
            objectFit: "cover",
            rotate: img.rotate,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.75, 0.95, 0.75] }}
          transition={{
            duration: img.duration,
            delay: img.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  )
}
