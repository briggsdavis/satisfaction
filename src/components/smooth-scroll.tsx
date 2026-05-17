import {
  motion,
  MotionValue,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
} from "react"

const SmoothScrollContext = createContext<MotionValue<number> | null>(null)
const ScrollResetContext = createContext<(() => void) | null>(null)

export const useSmoothScroll = () => useContext(SmoothScrollContext)
export const useScrollReset = () => useContext(ScrollResetContext)

export const SmoothScrollProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { scrollY } = useScroll()
  const smoothY = useSpring(scrollY, {
    damping: 38,
    stiffness: 280,
    mass: 0.7,
    restDelta: 0.001,
    // Framer Motion's useScroll measures the real scrollY on the first
    // frame.read AFTER mount, not during render. useSpring has already been
    // initialised at 0 by that point, so if the measured value is non-zero
    // (browser scroll anchoring, restored scroll, StrictMode remount, etc.)
    // the spring animates from 0 → measured over ~1s — which, because our
    // transform is y: -smoothY, pulls the entire page off-screen for a second
    // and makes the content "appear then disappear" on load. skipInitialAnimation
    // makes the spring JUMP to the first source change instead of animating it.
    skipInitialAnimation: true,
  })

  // Atomically zero both the spring source and the spring itself.
  // window.scrollTo(0,0) updates window.scrollY synchronously but fires the
  // scroll event asynchronously, so scrollY.get() is still the old offset on
  // the next animation frame — causing the spring to chase the old target and
  // showing the previous page's scroll position on the new page briefly.
  // Calling scrollY.set(0) updates the source MotionValue immediately so the
  // spring's target is 0 at the same moment we jump its current value to 0.
  const resetScroll = useCallback(() => {
    scrollY.set(0)
    smoothY.jump(0)
  }, [scrollY, smoothY])

  return (
    <SmoothScrollContext.Provider value={smoothY}>
      <ScrollResetContext.Provider value={resetScroll}>
        {children}
      </ScrollResetContext.Provider>
    </SmoothScrollContext.Provider>
  )
}

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState(0)
  const smoothY = useSmoothScroll()

  // useLayoutEffect so the spacer height is committed synchronously before the
  // first browser paint. Without this the page starts with height 0, which can
  // let browser scroll-restoration fire a scroll jump before the spacer is
  // ready — causing the spring to chase a non-zero target from a 0 start and
  // the content to visually disappear for a moment.
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const observer = new ResizeObserver(() => {
      setContentHeight(el.scrollHeight)
    })
    observer.observe(el)
    setContentHeight(el.scrollHeight)

    return () => observer.disconnect()
  }, [])

  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY
  const transform = useTransform(activeY, (y) => -y)

  return (
    <>
      <div style={{ height: contentHeight }} />
      <motion.div
        ref={scrollRef}
        style={{ y: transform }}
        className="fixed top-0 left-0 z-[3] w-full will-change-transform"
      >
        {children}
      </motion.div>
    </>
  )
}
