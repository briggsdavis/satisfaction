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
const ScrollUnlockContext = createContext<(() => void) | null>(null)
// Passed by ref so the SmoothScroll transform closure always reads the live value.
const TransitionLockContext = createContext<React.MutableRefObject<boolean>>({
  current: false,
})

export const useSmoothScroll = () => useContext(SmoothScrollContext)
export const useScrollReset = () => useContext(ScrollResetContext)
export const useScrollUnlock = () => useContext(ScrollUnlockContext)
export const useTransitionLock = () => useContext(TransitionLockContext)

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

  // Lock flag read synchronously inside the SmoothScroll transform closure.
  // Using a ref (not state) so toggling it never triggers a re-render and the
  // closure always sees the current value without needing to be recreated.
  const transitionLockRef = useRef(false)

  // Called by ColumnWipe when the screen is fully covered (wipe-in done).
  // Locks the transform to 0 and snaps the spring so nothing chases the old
  // scroll offset while the new page is being revealed.
  const resetScroll = useCallback(() => {
    transitionLockRef.current = true
    scrollY.set(0)
    smoothY.jump(0)
  }, [scrollY, smoothY])

  // Called by ColumnWipe when the wipe-out animation finishes.
  const unlockScroll = useCallback(() => {
    transitionLockRef.current = false
  }, [])

  return (
    <TransitionLockContext.Provider value={transitionLockRef}>
      <ScrollUnlockContext.Provider value={unlockScroll}>
        <SmoothScrollContext.Provider value={smoothY}>
          <ScrollResetContext.Provider value={resetScroll}>
            {children}
          </ScrollResetContext.Provider>
        </SmoothScrollContext.Provider>
      </ScrollUnlockContext.Provider>
    </TransitionLockContext.Provider>
  )
}

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState(0)
  const smoothY = useSmoothScroll()
  const transitionLockRef = useTransitionLock()

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
  // When a route transition is active the lock ref is true, so we force the
  // transform to 0 regardless of where the spring currently is. This prevents
  // the previous page's scroll offset from being visible on the new page while
  // the wipe-out columns retract — even if the spring hasn't fully settled yet.
  const transform = useTransform(activeY, (y) =>
    transitionLockRef.current ? 0 : -y,
  )

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
