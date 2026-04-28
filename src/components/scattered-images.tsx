import { motion, MotionValue, useTransform } from "motion/react"

type ImageDef = {
  src: string
  top: string
  left: string
  width: string
  height: string
  delay: number
  duration: number
  zoomIn: boolean
  rotation: number
}

// Positions, sizes, and aspect ratios derived directly from the reference mockup.
// Heights use vw units to preserve aspect ratios across screen sizes.
const IMAGES: ImageDef[] = [
  // A — top-left: laptop / coding photo (landscape ~3:2)
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    top: "12vh",
    left: "16vw",
    width: "14vw",
    height: "9.5vw",
    delay: 0,
    duration: 4.8,
    zoomIn: false,
    rotation: -4,
  },
  // J — upper-left: creative workspace (landscape ~3:2) — 5th left-side image
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
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
    src: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&q=80",
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
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
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
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
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
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
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
    src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=80",
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
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
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
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=80",
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
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
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
  const blurPx = useTransform(scrollProgress, [0, 0.8], [0, 10])
  const blurFilter = useTransform(blurPx, (b: number) => `blur(${b}px)`)

  return (
    <motion.div
      style={{
        position: "absolute",
        top: img.top,
        left: img.left,
        width: img.width,
        height: img.height,
        scale: scrollScale,
        rotate: img.rotation,
        boxShadow: "0 20px 50px -8px rgba(0,0,0,0.75)",
        ...(img.zoomIn ? {} : { opacity: scrollOpacity }),
      }}
    >
      {/* Rounded-corner clip wrapper — overflow:hidden kept here so reflection
          below isn't clipped by the parent */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "16px",
        }}
      >
        <motion.img
          src={img.src}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          style={{ filter: blurFilter }}
          animate={{ scale: [1, 1.03, 1], opacity: [0.72, 0.88, 0.72] }}
          transition={{
            duration: img.duration,
            delay: img.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Glass-floor mirror reflection — inherits outer div rotation naturally */}
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
          // zoomOut images: the outer div already fades the whole card (incl. reflection).
          // zoomIn images: only the reflection fades so the card itself stays fully visible.
          ...(img.zoomIn ? { opacity: scrollOpacity } : {}),
        }}
      >
        <img
          src={img.src}
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
