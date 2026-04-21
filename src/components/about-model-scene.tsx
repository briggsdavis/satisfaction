import { useEffect, useRef } from "react"

export function AboutModelScene() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMove)

    const maxAngle = 20 // degrees
    const damping = 0.08

    const tick = () => {
      const targetY = mouse.current.x * maxAngle
      const targetX = -mouse.current.y * maxAngle
      current.current.x += (targetX - current.current.x) * damping
      current.current.y += (targetY - current.current.y) * damping
      if (imgRef.current) {
        imgRef.current.style.transform = `rotateX(${current.current.x}deg) rotateY(${current.current.y}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="flex h-full w-full items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      <img
        ref={imgRef}
        src="/satisfactionlogo.png"
        alt="Satisfaction"
        className="w-[60vmin] max-w-[720px] select-none"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          opacity: 0.3,
        }}
        draggable={false}
      />
    </div>
  )
}
