import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const CAMPAIGN_WORDS = ["CAMPAIGNS", "BUILT", "TO", "PERFORM."]
// "CAMPAIGNS" is the widest word — font size is computed to fit it, then
// applied uniformly so shorter words stay proportional.
const WIDEST_WORD = "CAMPAIGNS"

export const CampaignStatement = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(100)

  useEffect(() => {
    const PROBE = 200
    const measure = () => {
      const container = containerRef.current
      if (!container) return
      const probe = document.createElement("span")
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-size:${PROBE}px`
      probe.className = "massive-text"
      probe.textContent = WIDEST_WORD
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
  }, [])

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black pb-8 md:pb-12">
      <motion.img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[17.6rem] w-[17.6rem] -translate-x-1/2 -translate-y-1/2 rounded-lg object-cover shadow-2xl md:h-[26.4rem] md:w-[26.4rem]"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 0.45, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Invisible container used to measure available width */}
      <div ref={containerRef} className="px-8 md:px-16" aria-hidden />

      {CAMPAIGN_WORDS.map((word, i) => {
        const isRight = i % 2 === 1
        return (
          <div key={word} className="px-8 md:px-16">
            <motion.div
              className={`flex items-end ${isRight ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, x: isRight ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span
                className="massive-text leading-[0.88] select-none"
                style={{ fontSize }}
              >
                {word}
              </span>
            </motion.div>
          </div>
        )
      })}

      {/* Bottom metadata row */}
      <div className="flex items-start justify-between px-8 py-4 md:px-16">
        <div className="font-mono text-xs leading-snug font-bold tracking-widest text-white/15 uppercase">
          <span>Strategy · Production · Creative</span>
          <br />
          <span>Social Satisfaction</span>
        </div>
      </div>
    </section>
  )
}
