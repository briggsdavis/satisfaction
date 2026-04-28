import { motion } from "motion/react"
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import { useLocation } from "react-router"
import type { Location } from "react-router"

const COLUMNS = 6
const DURATION = 0.4462
const STAGGER = 0.06006

// Exposes the "displayed" location so <Routes> can render the old page during wipe-in
const ColumnWipeContext = createContext<Location | null>(null)
export const useColumnWipeLocation = () => useContext(ColumnWipeContext)

export const ColumnWipe = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const [displayedLocation, setDisplayedLocation] = useState(location)
  const pendingRef = useRef<Location>(location)
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle")

  // When the real location changes and we're idle, start wipe-in
  useEffect(() => {
    if (location.key !== displayedLocation.key && phase === "idle") {
      pendingRef.current = location
      setPhase("in")
    }
  }, [location, displayedLocation, phase])

  // Screen fully white → scroll to top, swap displayed location, then begin wipe-out
  const handleInComplete = () => {
    window.scrollTo(0, 0)
    flushSync(() => {
      setDisplayedLocation(pendingRef.current)
      setPhase("out")
    })
  }

  return (
    <ColumnWipeContext.Provider value={displayedLocation}>
      {children}

      {/* Wipe IN: columns drop from top, old page visible behind them */}
      {phase === "in" && (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex">
          {Array.from({ length: COLUMNS }).map((_, i) => (
            <motion.div
              key={i}
              className="h-full origin-top bg-white"
              style={{ width: `${100 / COLUMNS}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: DURATION,
                delay: i * STAGGER,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={
                i === COLUMNS - 1 ? handleInComplete : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Wipe OUT: columns retract from bottom, new page revealed */}
      {phase === "out" && (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex">
          {Array.from({ length: COLUMNS }).map((_, i) => (
            <motion.div
              key={i}
              className="h-full origin-bottom bg-white"
              style={{ width: `${100 / COLUMNS}%` }}
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{
                duration: DURATION,
                delay: i * STAGGER,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={
                i === COLUMNS - 1 ? () => setPhase("idle") : undefined
              }
            />
          ))}
        </div>
      )}
    </ColumnWipeContext.Provider>
  )
}
