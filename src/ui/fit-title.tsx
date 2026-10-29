import { useEffect, useRef, useState } from "react"
import { TextReveal } from "./text-reveal"

export const FitTitle = ({
  text,
  slideFrom = "bottom",
  delay = 0,
  immediate,
  onCommit,
}: {
  text: string
  slideFrom?: "bottom" | "left"
  delay?: number
  immediate?: boolean
  onCommit?: (value: string) => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState<number | null>(null)

  useEffect(() => {
    const PROBE = 200
    const measure = () => {
      const container = containerRef.current
      if (!container) return
      const context = document.createElement("canvas").getContext("2d")
      if (!context) return
      context.font = `900 ${PROBE}px "Arian LT"`
      const textWidth = context.measureText(text).width
      const containerWidth = container.clientWidth
      if (textWidth > 0 && containerWidth > 0) {
        // 0.97 safety margin prevents sub-pixel rounding from triggering wrap
        setFontSize((containerWidth / textWidth) * PROBE * 0.97)
      }
    }
    const fit = () => void document.fonts.ready.then(measure)
    fit()
    const ro = new ResizeObserver(fit)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [text])

  return (
    <div ref={containerRef} className="w-full" style={fontSize ? { fontSize } : undefined}>
      {onCommit ? (
        <span
          contentEditable
          suppressContentEditableWarning
          className="massive-text block leading-none whitespace-nowrap outline-1 outline-white/30 transition-colors outline-dashed hover:outline-white/70 focus:outline-white"
          onBlur={(event) => {
            const value = event.currentTarget.textContent?.trim()
            if (value && value !== text) onCommit(value)
          }}
        >
          {text}
        </span>
      ) : (
        <TextReveal
          text={text}
          className="massive-text justify-center leading-none"
          nowrap
          immediate={immediate}
          slideFrom={slideFrom}
          delay={delay}
        />
      )}
    </div>
  )
}
