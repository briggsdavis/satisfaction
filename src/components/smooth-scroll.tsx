import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import React, { createContext, useContext, useEffect, useRef } from "react"

const SmoothScrollContext = createContext<MotionValue<number> | null>(null)

export const useSmoothScroll = () => useContext(SmoothScrollContext)

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const observer = new ResizeObserver(() => {
      setContentHeight(el.scrollHeight)
    })
    observer.observe(el)
    setContentHeight(el.scrollHeight)

    return () => observer.disconnect()
  }, [])

  const { scrollY } = useScroll()
  const smoothY = useSpring(scrollY, {
    damping: 38,
    stiffness: 280,
    mass: 0.7,
    restDelta: 0.001,
  })

  const transform = useTransform(smoothY, (y) => -y)

  return (
    <SmoothScrollContext.Provider value={smoothY}>
      <>
        <div style={{ height: contentHeight }} />
        <motion.div
          ref={scrollRef}
          style={{ y: transform }}
          className="fixed top-0 left-0 z-[2] w-full will-change-transform"
        >
          {children}
        </motion.div>
      </>
    </SmoothScrollContext.Provider>
  )
}
