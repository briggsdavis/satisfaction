import { useEffect, useState } from "react"
import { FitTitle } from "../../../ui/fit-title"
import type { HeroProps } from "./types"

const COUNT = 10
const INTERVAL_MS = 2000
const SCROLL_STEP_PX = 80
const images = Array.from({ length: COUNT }, (_, i) => `/heroes/branding/billboard-${i + 1}.jpg`)

// Photos are 3:2 with the billboard spanning ~57% of the width. Cover the screen when it's landscape,
// but cap the width at 167vw so portrait screens still show the whole billboard (edges fade to black).

export const BrandingHero = ({ service, onName }: HeroProps) => {
  const [i, setI] = useState(0)

  useEffect(() => {
    const next = () => setI((n) => (n + 1) % COUNT)
    let id = setInterval(next, INTERVAL_MS)
    let last = window.scrollY
    const onScroll = () => {
      if (Math.abs(window.scrollY - last) < SCROLL_STEP_PX) return
      last = window.scrollY
      next()
      clearInterval(id)
      id = setInterval(next, INTERVAL_MS)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearInterval(id)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <section className="relative h-screen bg-black">
      <div className="absolute inset-0 overflow-hidden">
        {images.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`${idx === i ? "" : "invisible"} absolute top-1/2 left-1/2 h-auto w-[max(100vw,min(150vh,167vw))] max-w-none -translate-1/2 mask-y-from-85% select-none`}
            draggable={false}
          />
        ))}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-64 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-64 bg-gradient-to-t from-black to-transparent" />
      </div>
      <div
        className={`${onName ? "" : "pointer-events-none"} absolute inset-x-0 bottom-0 z-10 translate-y-1/2 text-white max-md:top-[calc(50%+58vw)] max-md:bottom-auto max-md:translate-y-0 max-md:px-[8%]`}
      >
        <FitTitle text={service.name} immediate onCommit={onName} />
      </div>
    </section>
  )
}
