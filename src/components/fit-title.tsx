import { useEffect, useRef, useState } from "react"
import { TextReveal } from "./text-reveal"

export const FitTitle = ({
  text,
  slideFrom = "bottom",
  delay = 0,
  immediate,
}: {
  text: string
  slideFrom?: "bottom" | "left"
  delay?: number
  immediate?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState<number | null>(null)

  useEffect(() => {
    const PROBE = 200
    const measure = () => {
      const container = containerRef.current
      if (!container) return
      const probe = document.createElement("span")
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-size:${PROBE}px`
      probe.className = "massive-text"
      probe.textContent = text
      document.body.appendChild(probe)
      const textWidth = probe.offsetWidth
      document.body.removeChild(probe)
      const containerWidth = container.clientWidth
      if (textWidth > 0 && containerWidth > 0) {
        setFontSize((containerWidth / textWidth) * PROBE)
      }
    }
    const fit = () => void document.fonts.ready.then(measure)
    fit()
    const ro = new ResizeObserver(fit)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [text])

  return (
    <div ref={containerRef} style={fontSize ? { fontSize } : undefined}>
      <TextReveal
        text={text}
        className="massive-text justify-center leading-none"
        immediate={immediate}
        slideFrom={slideFrom}
        delay={delay}
      />
    </div>
  )
}
