import { motion } from "motion/react"
import { cn } from "../lib/cn"
import { useMobile } from "../lib/hooks"

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  nowrap?: boolean
  stagger?: number
  immediate?: boolean
  slideFrom?: "bottom" | "left"
}

export const TextReveal = ({
  text,
  className,
  delay = 0,
  nowrap = false,
  stagger = 0.01,
  immediate = false,
  slideFrom = "bottom",
}: TextRevealProps) => {
  const mobile = useMobile()
  // Left-to-right wipes need more stagger so the sweep is actually visible.
  const effectiveStagger = slideFrom === "left" ? Math.max(stagger, 0.065) : stagger

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: effectiveStagger,
        delayChildren: 0.02 * i + delay,
      },
    }),
  }

  const axis = slideFrom === "left" ? { x: -24 } : { y: 20 }
  const spring = {
    type: "spring" as const,
    damping: mobile ? 24 : slideFrom === "left" ? 14 : 12,
    stiffness: slideFrom === "left" ? 120 : 100,
  }
  const child = {
    visible: { opacity: 1, x: 0, y: 0, transition: spring },
    hidden: { opacity: 0, ...axis, transition: spring },
  }

  const words = text.split(" ")

  return (
    <motion.div
      className={cn("flex", nowrap ? "flex-nowrap" : "flex-wrap", className)}
      variants={container}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : {
            whileInView: "visible",
            viewport: { once: true, margin: "-150px" },
          })}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex flex-nowrap">
          {word.split("").map((char, ci) => (
            <motion.span
              variants={child}
              key={ci}
              className="inline-block whitespace-pre [backface-visibility:hidden]"
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && (
            <motion.span variants={child} className="inline-block">
              &nbsp;
            </motion.span>
          )}
        </span>
      ))}
    </motion.div>
  )
}
