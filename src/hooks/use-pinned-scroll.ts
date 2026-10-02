import { useMotionValue, useTransform } from "motion/react"
import { type RefObject, useEffect, useEffectEvent, useRef, useState } from "react"
import { useSmoothScroll } from "../components/smooth-scroll"

export function usePinnedScroll(
  wrapperRef: RefObject<HTMLDivElement | null>,
  getDistance: () => number,
) {
  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const [pinDistance, setPinDistance] = useState(0)
  const wrapperTopRef = useRef(0)
  const pinDistanceRef = useRef(0)
  const measureDistance = useEffectEvent(getDistance)

  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      const dist = measureDistance()
      pinDistanceRef.current = dist
      setPinDistance(dist)
    }
    requestAnimationFrame(measure)
    window.addEventListener("resize", measure)
    window.addEventListener("load", measure)
    // Content above this section (images, fonts, Convex data) changes height
    // after mount; the SmoothScroll spacer in <body> tracks total height, so
    // re-measure whenever it changes.
    const observer = new ResizeObserver(() => requestAnimationFrame(measure))
    observer.observe(document.body)
    if (wrapperRef.current?.parentElement) observer.observe(wrapperRef.current.parentElement)
    document.fonts?.ready.then(measure)
    return () => {
      window.removeEventListener("resize", measure)
      window.removeEventListener("load", measure)
      observer.disconnect()
    }
  }, [wrapperRef, smoothY])

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const progress = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return 1
    return (y - T) / D
  })

  return { pinY, progress, pinDistance }
}
