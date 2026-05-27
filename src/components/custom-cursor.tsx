import { motion, useMotionValue } from "motion/react"
import { useEffect, useState } from "react"

const hasPointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches

export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverText, setHoverText] = useState("")

  // const springConfig = { damping: 31, stiffness: 250 }
  // const cursorX = useSpring(mouseX, springConfig)
  // const cursorY = useSpring(mouseY, springConfig)
  const cursorX = mouseX
  const cursorY = mouseY

  useEffect(() => {
    if (!hasPointer()) return
    setEnabled(true)

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
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [mouseX, mouseY])

  if (!enabled || !hasMoved) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-10000 flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
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
