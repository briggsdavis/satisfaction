import { animate } from "motion/react"
import { type RefObject, useEffect, useRef } from "react"
import { useContent } from "../admin/context/content-context"

interface SiteLoaderProps {
  navLogoRef: RefObject<HTMLImageElement | null>
  onDone: () => void
}

export const SiteLoader = ({ navLogoRef, onDone }: SiteLoaderProps) => {
  const { content } = useContent()
  const logoSrc = content.logo || "/satisfactionlogo.png"
  const bgRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const bg = bgRef.current
    const logo = logoRef.current
    if (!bg || !logo) return

    let cancelled = false

    const run = async () => {
      // 1. Fade in over 800ms
      await animate(logo, { opacity: 1 }, { duration: 1.0, ease: "easeOut" })

      // 2. Scale up 20%
      await animate(logo, { scale: 1.2 }, { duration: 0.94, ease: [0.34, 1.56, 0.64, 1] })

      // 3. Calculate delta from centered position to navbar logo position
      const logoRect = logo.getBoundingClientRect()
      const navRect = navLogoRef.current?.getBoundingClientRect()
      const dx = navRect ? navRect.left - logoRect.left : 0
      const dy = navRect ? navRect.top - logoRect.top : 0

      // 5. Slide logo to nav position and blur-fade the overlay simultaneously
      await Promise.all([
        animate(logo, { x: dx, y: dy }, { duration: 2.86, ease: [0.22, 1, 0.36, 1] }),
        animate(
          bg,
          { opacity: 0, filter: "blur(16px)" },
          { duration: 2.34, delay: 0.62, ease: "easeIn" },
        ),
      ])

      if (!cancelled) onDone()
    }

    run()
    return () => {
      cancelled = true
    }
  }, []) // intentionally run once on mount

  return (
    <>
      {/* Black overlay — blurs and fades out during reveal */}
      <div ref={bgRef} className="fixed inset-0 bg-black" style={{ zIndex: 2000 }} />

      {/* Logo — centered, animates to nav position */}
      <div
        className="pointer-events-none fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 2001 }}
      >
        <img
          ref={logoRef}
          src={logoSrc}
          alt="Social Satisfaction"
          className="h-10 w-auto opacity-0 md:h-12"
        />
      </div>
    </>
  )
}
