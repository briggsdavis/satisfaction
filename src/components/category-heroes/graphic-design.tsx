import { motion } from "motion/react"
import { useEffect, useState } from "react"
import type { Doc } from "../../../convex/_generated/dataModel"
import { ScrollingTextHero } from "./scrolling-text-hero"

type Category = Doc<"categories">

const IMG_W = 1451
const IMG_H = 603
const ASPECT = IMG_W / IMG_H

const SIZE = 18.78
const SHIFT_X = 0.15
const SHIFT_Y = 0.3
const slots = [
  { x: 0.78 + SHIFT_X, y: 29.42 + SHIFT_Y, w: SIZE },
  { x: 21.42 + SHIFT_X, y: 29.1 + SHIFT_Y, w: SIZE - 0.6 },
  { x: 41.3 + SHIFT_X, y: 29.6 + SHIFT_Y, w: SIZE },
  { x: 61.15 + SHIFT_X, y: 29.6 + SHIFT_Y, w: SIZE },
  { x: 81.0 + SHIFT_X, y: 29.6 + SHIFT_Y, w: SIZE },
]
const N = slots.length

function posX(i: number) {
  if (i < 0) return -SIZE - 1
  if (i >= N) return 101
  return slots[i].x
}
function posY(i: number) {
  if (i < 0) return slots[0].y
  if (i >= N) return slots[N - 1].y
  return slots[i].y
}
function posW(i: number) {
  if (i < 0) return slots[0].w
  if (i >= N) return slots[N - 1].w
  return slots[i].w
}

const designs = [
  "bar-madness-4x6-v2-artboard-1-4.jpg",
  "bar-madness-4x6-v2-artboard-1-5.jpg",
  "beloved.png",
  "blue-moon.jpeg",
  "bud-light.jpg",
  "codigo-branding-stuff.jpg",
  "flyer-001.jpg",
  "highendsweets.png",
  "makersmark.png",
  "menu-example.png",
  "mmz-01.jpg",
  "pizza-box.jpg",
  "rb-super-bow-v1.jpg",
  "sienna-mercato-christmas.jpg",
  "story-promo.jpg",
  "toydrive-1.jpg",
  "vigilant-colorways-v24.jpg",
  "wraps-v1.jpg",
].map((f) => `/mock/graphic/${f}`)

const TICK_MS = 2000
const SLIDE_MS = 800

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Item = { id: number; src: string }

export const GraphicDesignHero = ({ category }: { category: Category }) => {
  const [queue] = useState(() => shuffled(designs))
  const [track, setTrack] = useState<Item[]>(() => {
    const items: Item[] = []
    for (let i = 0; i < N + 2; i++) {
      items.push({ id: i, src: queue[i % queue.length] })
    }
    return items
  })

  useEffect(() => {
    const id = setInterval(() => {
      setTrack((prev) => {
        const nextId = prev.at(-1)!.id + 1
        const next: Item = { id: nextId, src: queue[nextId % queue.length] }
        return [...prev.slice(1), next]
      })
    }, TICK_MS)
    return () => clearInterval(id)
  }, [queue])

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <ScrollingTextHero text={category.name} />
      </div>
      <div
        className="relative z-10 overflow-hidden"
        style={{
          aspectRatio: `${IMG_W} / ${IMG_H}`,
          width: `min(85%, calc(85vh * ${IMG_W} / ${IMG_H}))`,
        }}
      >
        <img
          src="/mock/graphic/template.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          draggable={false}
        />
        {track.map((item, idx) => {
          const logical = idx - 1
          return (
            <motion.img
              key={item.id}
              src={item.src}
              alt=""
              draggable={false}
              className="absolute object-cover select-none"
              initial={false}
              animate={{
                left: `${posX(logical)}%`,
                top: `${posY(logical)}%`,
                width: `${posW(logical)}%`,
                height: `${SIZE * ASPECT}%`,
              }}
              transition={{ duration: SLIDE_MS / 1000, ease: "easeInOut" }}
            />
          )
        })}
      </div>
    </section>
  )
}
