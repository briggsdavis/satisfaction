import { motion, useScroll, useTransform } from "motion/react"
import React, { useRef } from "react"
import { cn } from "../lib/utils"

interface DeBlurTextProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  noDisplay?: boolean
}

export const DeBlurText = ({
  children,
  className,
  as: Component = "h2",
  noDisplay = false,
}: DeBlurTextProps) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const blur = useTransform(scrollYProgress, [0, 0.8], [15, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.8], [20, 0])

  return (
    <motion.div
      ref={ref}
      style={{
        filter: useTransform(blur, (v) => `blur(${v}px)`),
        opacity,
        y,
      }}
      className={cn("will-change-[filter,opacity,transform]", className)}
    >
      <Component className={noDisplay ? undefined : "massive-text"}>{children}</Component>
    </motion.div>
  )
}
