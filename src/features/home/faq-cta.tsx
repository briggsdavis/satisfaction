import { useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react"
import { api } from "../../../convex/_generated/api"
import { Link } from "../../ui/link"
import { Eyebrow } from "../../ui/page"
import { TextReveal } from "../../ui/text-reveal"

const DASH = 8

const DashedLine = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = ref.current

    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      const gap = Math.max(6, width * 0.012)
      setCount(Math.max(2, Math.floor((width + gap) / (DASH + gap)) + 1))
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div aria-hidden className="relative z-10 -mb-0.5 h-0.5 bg-black px-16 md:px-32 lg:px-48">
      <div ref={ref} className="mx-auto flex h-full w-[65%] justify-between">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="h-full bg-white" style={{ width: DASH }} />
        ))}
      </div>
    </div>
  )
}

export const FaqCta = () => {
  const body = useQuery(api.site.get)?.faqCta
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
        <div className="border-b border-white/10 px-8 pt-16 pb-4 md:px-16 lg:border-r lg:border-b-0 lg:pt-20 lg:pb-20">
          <Eyebrow className="mb-4">Got Questions</Eyebrow>
          <TextReveal
            text="FAQ"
            className="massive-text text-5xl leading-none md:text-7xl lg:text-8xl"
          />
        </div>

        <div className="flex flex-col justify-center gap-6 px-8 pt-4 pb-20 md:px-16 lg:pt-20 lg:pb-20">
          <p className="max-w-lg text-base leading-relaxed whitespace-pre-line text-white/60">
            {body}
          </p>
          <div>
            <Link to="/about#faq" className="btn-industrial">
              View FAQ →
            </Link>
          </div>
        </div>
      </section>

      <DashedLine />
    </>
  )
}
