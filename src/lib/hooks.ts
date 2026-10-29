import { useLenis } from "lenis/react"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useNavigationType } from "react-router"

export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
  )

export const useMobile = () => useMediaQuery("(max-width: 767px)")

/** Delay page titles so they play after the route transition, not under it. */
export const useTitleDelay = () => (useNavigationType() === "PUSH" ? 0.75 : 0)

/** Freezes page scroll (native and Lenis) while `active`. */
export const useScrollLock = (active: boolean) => {
  const lenis = useLenis()
  useEffect(() => {
    if (!active) return
    lenis?.stop()
    document.documentElement.style.overflow = "hidden"
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = ""
    }
  }, [active, lenis])
}

/** Runs async work one at a time, tracking busy and error state. */
export const useTask = () => {
  const running = useRef(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const run = useCallback(async (work: () => Promise<unknown>) => {
    if (running.current) return
    running.current = true
    setBusy(true)
    setError(null)
    try {
      await work()
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      running.current = false
      setBusy(false)
    }
  }, [])
  return { run, busy, error }
}

export const errorMessage = (cause: unknown) => {
  const data = (cause as { data?: unknown })?.data
  if (typeof data === "string") return data
  return cause instanceof Error ? cause.message : "Something went wrong."
}

/** Tracks an element's border box. */
export const useSize = <T extends HTMLElement>() => {
  const [node, ref] = useState<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize[0]
      setSize({ width: box.inlineSize, height: box.blockSize })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])
  return [ref, size, node] as const
}
