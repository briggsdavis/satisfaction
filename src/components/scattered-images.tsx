import { motion, MotionValue, useTransform } from "motion/react"

type ImageDef = {
  src: string
  top: string
  left: string
  width: string
  height: string
  rotate: number
  delay: number
  duration: number
  zoomIn: boolean
}

// 9 images spread across the full viewport, arranged to frame the central iMac.
// Positions mirror the mockup layout: large landscape cards in corners,
// smaller accent cards on the sides, portrait cards as vertical accents.
const IMAGES: ImageDef[] = [
  // 1 — top-left large landscape: coding / laptop
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    top: "15vh",
    left: "3vw",
    width: "19vw",
    height: "12vw",
    rotate: -5,
    delay: 0,
    duration: 4.8,
    zoomIn: false,
  },
  // 2 — left-middle portrait: photo / video studio
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    top: "44vh",
    left: "1vw",
    width: "12vw",
    height: "16vw",
    rotate: 4,
    delay: 0.8,
    duration: 5.3,
    zoomIn: true,
  },
  // 3 — upper-centre-left portrait card: UI design mockup
  {
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    top: "36vh",
    left: "21vw",
    width: "10vw",
    height: "13vw",
    rotate: -3,
    delay: 1.1,
    duration: 4.5,
    zoomIn: false,
  },
  // 4 — top-centre small square: app / email UI
  {
    src: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&q=80",
    top: "10vh",
    left: "55vw",
    width: "9vw",
    height: "9vw",
    rotate: 6,
    delay: 0.3,
    duration: 5.6,
    zoomIn: true,
  },
  // 5 — top-right large landscape: colourful design / branding
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    top: "14vh",
    left: "72vw",
    width: "20vw",
    height: "12vw",
    rotate: 3,
    delay: 0.6,
    duration: 5.1,
    zoomIn: false,
  },
  // 6 — right-upper small square: logo / brand identity
  {
    src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=80",
    top: "35vh",
    left: "85vw",
    width: "10vw",
    height: "10vw",
    rotate: -5,
    delay: 1.4,
    duration: 4.2,
    zoomIn: true,
  },
  // 7 — right-middle landscape: camera / photography gear
  {
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    top: "57vh",
    left: "76vw",
    width: "17vw",
    height: "13vw",
    rotate: 5,
    delay: 0.9,
    duration: 5.8,
    zoomIn: false,
  },
  // 8 — bottom-left portrait: mobile app mockup
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=80",
    top: "69vh",
    left: "5vw",
    width: "9vw",
    height: "15vw",
    rotate: -6,
    delay: 0.4,
    duration: 4.9,
    zoomIn: true,
  },
  // 9 — bottom-right large landscape: lifestyle / portfolio
  {
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
    top: "70vh",
    left: "72vw",
    width: "21vw",
    height: "13vw",
    rotate: 3,
    delay: 1.2,
    duration: 5.4,
    zoomIn: false,
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
    img.zoomIn ? [1, 1.5] : [1, 0.1],
  )

  const scrollOpacity = useTransform(scrollProgress, [0, 0.8], [1, 0])

  return (
    <motion.div
      style={{
        position: "absolute",
        top: img.top,
        left: img.left,
        width: img.width,
        height: img.height,
        rotate: img.rotate,
        scale: scrollScale,
        ...(img.zoomIn ? {} : { opacity: scrollOpacity }),
      }}
    >
      <motion.img
        src={img.src}
        alt=""
        aria-hidden
        className="h-full w-full rounded-xl object-cover shadow-2xl shadow-black/70"
        animate={{ scale: [1, 1.03, 1], opacity: [0.72, 0.88, 0.72] }}
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
