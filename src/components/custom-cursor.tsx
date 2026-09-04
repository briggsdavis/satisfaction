import { motion, useMotionValue } from "motion/react"
import { useLayoutEffect, useState } from "react"

const hasPointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches

export const CustomCursor = () => {
  const [enabled] = useState(hasPointer)
  const [hasMoved, setHasMoved] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverText, setHoverText] = useState("")

  useLayoutEffect(() => {
    if (!enabled) return

    document.body.classList.add("custom-cursor")

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setHasMoved(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a") || target.closest("button")) {
        setIsHovering(true)
        const text = target.getAttribute("data-cursor-text") || "VIEW"
        setHoverText(text)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseover", handleMouseOver)

    return () => {
      document.body.classList.remove("custom-cursor")
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [enabled, mouseX, mouseY])

  if (!enabled || !hasMoved) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-10000 flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white mix-blend-difference"
      style={{
        x: mouseX,
        y: mouseY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: isHovering ? 80 : 20,
        height: isHovering ? 80 : 20,
      }}
    >
      {isHovering && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-bold tracking-widest text-black uppercase"
        >
          {hoverText}
        </motion.span>
      )}
    </motion.div>
  )
}
