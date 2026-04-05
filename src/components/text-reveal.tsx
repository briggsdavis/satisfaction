import { motion } from "motion/react"
import { cn } from "../lib/utils"

interface TextRevealProps {
  text: string
  className?: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  delay?: number
  nowrap?: boolean
  stagger?: number
  immediate?: boolean
}

export const TextReveal = ({
  text,
  className,
  as: _Component = "p",
  delay = 0,
  nowrap = false,
  stagger = 0.01,
  immediate = false,
}: TextRevealProps) => {
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: 0.02 * i + delay },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
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
              className="inline-block whitespace-pre"
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
