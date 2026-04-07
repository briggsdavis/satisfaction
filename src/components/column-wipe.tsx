import { motion } from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router"

const COLUMNS = 6
const DURATION = 0.52
const STAGGER = 0.07

export const ColumnWipe = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle")
  const prevPathname = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname === prevPathname.current) return
    prevPathname.current = location.pathname
    setPhase("in")
  }, [location.pathname])

  return (
    <>
      {/*
        Content — hidden (but laid-out) during wipe-in so the new page
        cannot peek through gaps between columns. Becomes visible the instant
        the screen is fully white (phase flips to "out"), so it's already
        behind the columns when they start retracting.
      */}
      <div style={{ visibility: phase === "in" ? "hidden" : "visible" }}>
        {children}
      </div>

      {/* ── Wipe IN: columns drop from top ─────────────────────────────── */}
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
              // Last column finishing = screen fully white → begin reveal
              onAnimationComplete={
                i === COLUMNS - 1 ? () => setPhase("out") : undefined
              }
            />
          ))}
        </div>
      )}

      {/* ── Wipe OUT: columns retract from bottom ──────────────────────── */}
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
    </>
  )
}
