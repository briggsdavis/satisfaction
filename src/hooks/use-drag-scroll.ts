import { type RefObject, useEffect } from "react"

type Options = {
  // Pixels of movement before a press is treated as a drag (default 0).
  // When > 0, click events are suppressed after a drag so child links don't fire.
  threshold?: number
  // Multiplier applied to drag distance (default 1).
  speed?: number
}

export const useDragScroll = (
  ref: RefObject<HTMLElement | null>,
  { threshold = 0, speed = 1 }: Options = {},
) => {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let startX = 0
    let scrollLeftStart = 0
    let hasDragged = false

    const onMove = (e: MouseEvent) => {
      const walk = (e.pageX - el.offsetLeft - startX) * speed
      if (!hasDragged && Math.abs(walk) > threshold) hasDragged = true
      if (hasDragged || threshold === 0) {
        e.preventDefault()
        el.scrollLeft = scrollLeftStart - walk
      }
    }
    const stop = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", stop)
    }
    const onDown = (e: MouseEvent) => {
      hasDragged = false
      startX = e.pageX - el.offsetLeft
      scrollLeftStart = el.scrollLeft
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", stop)
    }
    const onClickCapture = (e: MouseEvent) => {
      if (hasDragged) {
        e.preventDefault()
        e.stopPropagation()
        hasDragged = false
      }
    }

    el.addEventListener("mousedown", onDown)
    if (threshold > 0) el.addEventListener("click", onClickCapture, true)
    return () => {
      el.removeEventListener("mousedown", onDown)
      if (threshold > 0) el.removeEventListener("click", onClickCapture, true)
      stop()
    }
  }, [ref, threshold, speed])
}
