import { AnimatePresence, motion } from "motion/react"
import { useRef, useState } from "react"
import type { Doc } from "../../../convex/_generated/dataModel"

type Category = Doc<"categories">

const frames = [
  { top: 20.31, left: 7.69, width: 21.1, height: 55.96 },
  { top: 20.43, left: 39.52, width: 21.1, height: 55.96 },
  { top: 20.2, left: 71.15, width: 21.2, height: 56.56 },
]

const VIDEO_COUNT = 25
const videos = Array.from({ length: VIDEO_COUNT }, (_, i) => `/mock/creative/${i + 1}.mp4`)

const REFLECTION_OPACITY = 0.7
const REFLECTION_BLUR_PX = 8
const REFLECTION_GAP = 3

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const CreativeDirectionHero = ({ category: _category }: { category: Category }) => {
  const [queue] = useState(() => shuffled(videos))
  const [indices, setIndices] = useState<number[]>([0, 1, 2])
  const nextRef = useRef(frames.length)

  const advance = (frameIdx: number) => {
    const my = nextRef.current++ % queue.length
    setIndices((prev) => {
      const copy = [...prev]
      copy[frameIdx] = my
      return copy
    })
  }

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      <div
        className="relative"
        style={{
          aspectRatio: "4500 / 3000",
          width: "min(100%, calc(100vh * 4500 / 3000))",
        }}
      >
        <img
          src="/mock/creative/base.jpg"
          alt=""
          className="absolute inset-0 h-full w-full select-none"
          draggable={false}
        />
        {frames.map((f, i) => (
          <div key={i}>
            <div
              className="absolute overflow-hidden bg-black"
              style={{
                top: `${f.top}%`,
                left: `${f.left}%`,
                width: `${f.width}%`,
                height: `${f.height}%`,
              }}
            >
              <AnimatePresence initial={false}>
                <motion.video
                  key={indices[i]}
                  src={queue[indices[i]]}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={() => advance(i)}
                  className="absolute inset-0 h-full w-full object-cover select-none"
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </div>
            <div
              className="pointer-events-none absolute"
              style={{
                top: `${f.top + f.height + REFLECTION_GAP}%`,
                left: `${f.left}%`,
                width: `${f.width}%`,
                height: `${f.height}%`,
                transform: "scaleY(-1)",
                filter: `blur(${REFLECTION_BLUR_PX}px)`,
                opacity: REFLECTION_OPACITY,
              }}
            >
              <AnimatePresence initial={false}>
                <motion.video
                  key={indices[i]}
                  src={queue[indices[i]]}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover select-none"
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
