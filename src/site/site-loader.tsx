import { animate } from "motion/react"
import { type RefObject, useEffect, useRef } from "react"
import { ease } from "../lib/motion"
import { LOGO_SRC } from "./navbar"

export const SiteLoader = ({
  navLogoRef,
  onNavLogoReady,
  onDone,
}: {
  navLogoRef: RefObject<HTMLImageElement | null>
  onNavLogoReady: () => void
  onDone: () => void
}) => {
  const bgRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const bg = bgRef.current
    const logo = logoRef.current
    if (!bg || !logo) return

    let cancelled = false

    const run = async () => {
      // 1. Fade in
      await animate(logo, { opacity: 1 }, { duration: 1.2, ease: "easeOut" })

      // 2. Pause
      await new Promise<void>((r) => setTimeout(r, 200))

      // 3. Calculate delta from centered position to navbar logo position
      const logoRect = logo.getBoundingClientRect()
      const navRect = navLogoRef.current?.getBoundingClientRect()
      const dx = navRect ? navRect.left - logoRect.left : 0
      const dy = navRect ? navRect.top - logoRect.top : 0

      // 4. Slide logo to nav position and fade overlay simultaneously
      await Promise.all([
        animate(logo, { x: dx, y: dy }, { duration: 1.2, ease }),
        animate(bg, { opacity: 0, filter: "blur(16px)" }, { duration: 1.2, ease: "easeIn" }),
      ])

      if (cancelled) return
      // Show the real navbar logo instantly, then wait two paint frames so
      // React has rendered it before this component unmounts and takes the
      // loader logo with it — prevents the flicker gap.
      onNavLogoReady()
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
      if (!cancelled) onDone()
    }

    run()
    return () => {
      cancelled = true
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- one-shot intro
  }, [])

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
          src={LOGO_SRC}
          alt="Social Satisfaction"
          width={168}
          height={168}
          decoding="async"
          className="h-10 w-auto opacity-0 md:h-12"
        />
      </div>
    </>
  )
}
