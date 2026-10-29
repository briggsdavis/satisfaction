import type { Transition } from "motion/react"

export const ease = [0.22, 1, 0.36, 1] as const

/** Fade + rise into view, once. */
export const reveal = (delay = 0, y = 24, duration = 0.7) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-150px" },
  transition: { duration, delay, ease } satisfies Transition,
})
