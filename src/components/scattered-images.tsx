import { motion } from "motion/react"

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
    src: "/logo.png",
    top: "12%",
    left: "6%",
    size: "14vmin",
    rotate: -8,
    delay: 0,
    duration: 4.2,
  },
  {
    src: "/logo.png",
    top: "20%",
    left: "78%",
    size: "16vmin",
    rotate: 6,
    delay: 0.6,
    duration: 5.1,
  },
  {
    src: "/logo.png",
    top: "58%",
    left: "4%",
    size: "18vmin",
    rotate: 4,
    delay: 1.1,
    duration: 4.8,
  },
  {
    src: "/logo.png",
    top: "62%",
    left: "82%",
    size: "13vmin",
    rotate: -5,
    delay: 0.3,
    duration: 5.6,
  },
  {
    src: "/logo.png",
    top: "8%",
    left: "44%",
    size: "11vmin",
    rotate: -3,
    delay: 1.4,
    duration: 4.4,
  },
  {
    src: "/logo.png",
    top: "72%",
    left: "46%",
    size: "12vmin",
    rotate: 7,
    delay: 0.9,
    duration: 5.3,
  },
  {
    src: "/logo.png",
    top: "38%",
    left: "88%",
    size: "10vmin",
    rotate: -10,
    delay: 1.7,
    duration: 4.9,
  },
  {
    src: "/logo.png",
    top: "40%",
    left: "2%",
    size: "10vmin",
    rotate: 9,
    delay: 0.2,
    duration: 5.8,
  },
]

export function ScatteredImages() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
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
    </div>
  )
}
