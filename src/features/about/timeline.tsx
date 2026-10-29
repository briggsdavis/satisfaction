import { useQuery } from "convex/react"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { api } from "../../../convex/_generated/api"
import { useSize } from "../../lib/hooks"

/** Sticky stage whose vertical scroll drives a horizontal track. */
export const Timeline = () => {
  const items = useQuery(api.timeline.list) ?? []
  const ref = useRef<HTMLDivElement>(null)
  const [viewportRef, viewport] = useSize<HTMLDivElement>()
  const [trackRef, track] = useSize<HTMLDivElement>()
  const distance = Math.max(0, track.width - viewport.width)
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const x = useTransform(progress, (p) => -p * distance)

  return (
    <div ref={ref} className="relative" style={{ height: `calc(${distance}px + 100vh)` }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="shrink-0 px-8 pt-40 pb-[3px] md:px-16">
          <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase">Timeline</h2>
          <h3 className="mt-1 font-display text-3xl font-bold tracking-tight uppercase md:text-5xl">
            Past Projects &amp; Clients
          </h3>
        </div>

        <div className="relative mx-8 mt-5 mb-1 h-[3px] bg-white/10 md:mx-16">
          <motion.div
            className="absolute inset-0 origin-left bg-white/70"
            style={{ scaleX: progress }}
          />
        </div>

        <div
          ref={viewportRef}
          className="ml-8 flex flex-1 items-start overflow-hidden pt-5 md:ml-16"
        >
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex min-h-0 shrink-0 gap-24 pr-8 max-md:h-full md:pr-16"
          >
            {items.map((item) => (
              <div
                key={item._id}
                className="max-h-full w-[85vw] shrink-0 overflow-y-auto pb-10 [overflow-wrap:anywhere] md:max-h-none md:w-[45vw] md:overflow-visible md:pb-0"
              >
                <span className="text-sm font-bold tracking-widest text-white/60">{item.date}</span>
                <h4 className="massive-text mt-4 text-5xl font-black tracking-tight uppercase md:text-7xl">
                  {item.client}
                </h4>
                {item.campaign && (
                  <p className="mt-2 text-2xl font-bold tracking-tight uppercase md:text-3xl">
                    {item.campaign}
                  </p>
                )}
                <p className="mt-6 text-xs font-bold tracking-widest text-white/60 uppercase">
                  {item.role}
                </p>
                {item.description && (
                  <p className="mt-6 max-w-lg text-lg leading-relaxed whitespace-pre-line text-white/60">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
