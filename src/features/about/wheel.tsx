import { useQuery } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import { motion, MotionValue, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { api } from "../../../convex/_generated/api"

type Item = FunctionReturnType<typeof api.wheel.list>[number]

const Pair = ({
  item,
  index,
  n,
  progress,
}: {
  item: Item
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  // Each pair owns a slice of progress and crossfades with its neighbours.
  const step = 1 / (2 * (n - 1 || 1))
  const left = index === 0 ? 0 : (2 * index - 1) * step
  const right = index === n - 1 ? 1 : (2 * index + 1) * step
  const fade = 0.08
  const opacity = useTransform(
    progress,
    index === 0
      ? [0, Math.max(0, right - fade), right]
      : index === n - 1
        ? [left, Math.min(1, left + fade), 1]
        : [left, left + fade, right - fade, right],
    index === 0 ? [1, 1, 0] : index === n - 1 ? [0, 1, 1] : [0, 1, 1, 0],
  )

  return (
    <motion.div
      style={{ opacity: n === 1 ? 1 : opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-y-auto px-8 pt-24 pb-8 [overflow-wrap:anywhere] md:flex-row md:gap-16 md:overflow-visible md:px-16 md:pb-0"
    >
      <div className="flex-1 max-md:min-w-0">
        <p className="mb-3 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="massive-text mb-6 text-4xl leading-tight font-bold uppercase md:text-6xl lg:text-7xl">
          {item.heading}
        </h3>
        <p className="max-w-lg text-lg leading-relaxed font-light whitespace-pre-line text-white/70">
          {item.body}
        </p>
      </div>
      <div className="hidden w-[42%] shrink-0 md:block">
        <div className="aspect-4/5 overflow-hidden">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.heading}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

const Dot = ({
  index,
  n,
  progress,
}: {
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  const center = n === 1 ? 0 : index / (n - 1)
  const range = [Math.max(0, center - 0.3), center, Math.min(1, center + 0.3)]
  const opacity = useTransform(progress, range, [0.25, 1, 0.25])
  const scale = useTransform(progress, range, [0.7, 1.4, 0.7])
  return <motion.div className="h-1.5 w-1.5 bg-white" style={{ opacity, scale }} />
}

/** Sticky stage, one viewport of scroll per item. */
export const Wheel = () => {
  const items = useQuery(api.wheel.list) ?? []
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const n = items.length
  if (!n) return null

  return (
    <div ref={ref} className="relative" style={{ height: `${n * 100}vh` }}>
      <div className="sticky top-0 h-screen">
        <div className="pointer-events-none absolute top-1/2 right-8 z-10 flex -translate-y-1/2 flex-col gap-3 md:right-16">
          {items.map((item, i) => (
            <Dot key={item._id} index={i} n={n} progress={progress} />
          ))}
        </div>
        {items.map((item, i) => (
          <Pair key={item._id} item={item} index={i} n={n} progress={progress} />
        ))}
      </div>
    </div>
  )
}
