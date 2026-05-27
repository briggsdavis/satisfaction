import { useEffect, useRef, useState } from "react"
import type { Doc } from "../../../convex/_generated/dataModel"

type Category = Doc<"categories">

const screens = [
  { top: 19.37, left: 30.62, width: 33.22, height: 35.33, rotation: 9.5, radius: 3 },
  { top: 74.7, left: 34.07, width: 19.62, height: 13.83, rotation: -3.55, radius: 6.2 },
]

export const MotionGraphicsHero = ({ category: _category }: { category: Category }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      <div
        ref={ref}
        className="relative"
        style={{
          aspectRatio: "4500 / 3000",
          width: "min(100%, calc(100vh * 4500 / 3000))",
        }}
      >
        <img
          src="/mock/motion/devices.png"
          alt=""
          className="absolute inset-0 h-full w-full select-none"
          draggable={false}
        />
        {screens.map((s, i) => {
          const radiusPx = (s.radius / 100) * (s.width / 100) * containerW
          return (
            <video
              key={i}
              src="/mock/motion/vigilant.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute select-none object-cover"
              draggable={false}
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.width}%`,
                height: `${s.height}%`,
                transform: `rotate(${s.rotation}deg)`,
                borderRadius: `${radiusPx}px`,
              }}
            />
          )
        })}
      </div>
    </section>
  )
}
