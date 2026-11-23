import { X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useScrollLock } from "../lib/hooks"
import { ease } from "../lib/motion"

const pad = (n: number) => String(n).padStart(2, "0")
const navButton =
  "absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 text-white/50 transition-colors hover:border-white/60 hover:text-white md:flex"

type Item = { url: string; type: "image" | "video" }

/** Full-screen media viewer: arrows, swipe, Escape, thumbnails. */
export const Lightbox = ({
  items,
  index: start,
  title,
  onClose,
}: {
  items: Item[]
  index: number
  title: string
  onClose: () => void
}) => {
  const touch = useRef<{ x: number; y: number } | null>(null)
  const [[index, dir], setState] = useState([start, 0])
  useScrollLock(true)

  const go = useCallback(
    (delta: number) => setState(([i]) => [(i + delta + items.length) % items.length, delta]),
    [items.length],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [go, onClose])

  return createPortal(
    <motion.dialog
      open
      aria-modal
      aria-label={title}
      className="fixed inset-0 z-9000 m-0 flex h-full max-h-none w-full max-w-none flex-col bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex shrink-0 items-center justify-between px-6 py-4 md:px-10">
        <span className="font-mono text-xs font-bold tracking-widest text-white/30 uppercase">
          {title}
        </span>
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs text-white/30">
            {pad(index + 1)} / {pad(items.length)}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/50 transition-colors hover:border-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 pb-2 md:px-24 md:pb-6"
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          const from = touch.current
          touch.current = null
          if (!from) return
          const dx = e.changedTouches[0].clientX - from.x
          const dy = e.changedTouches[0].clientY - from.y
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            className="flex h-full w-full items-center justify-center"
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3, ease }}
          >
            {items[index].type === "video" ? (
              <video
                src={items[index].url}
                autoPlay
                loop
                controls
                playsInline
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <img
                src={items[index].url}
                alt={`${title}, ${index + 1}`}
                className="h-full w-full object-contain md:h-auto md:max-h-full md:w-auto md:max-w-full"
              />
            )}
          </motion.div>
        </AnimatePresence>
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className={`${navButton} left-3 md:left-6`}
        >
          ←
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className={`${navButton} right-3 md:right-6`}
        >
          →
        </button>
      </div>

      <p className="pb-3 text-center text-xs tracking-widest text-white/60 uppercase md:hidden">
        Swipe ↔
      </p>
      <div className="hidden shrink-0 justify-center gap-2 px-6 pb-6 md:flex">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setState([i, i > index ? 1 : -1])}
            aria-label={`Show item ${i + 1}`}
            aria-current={i === index}
            className="h-14 w-14 shrink-0 overflow-hidden opacity-35 outline-offset-2 transition-[opacity,outline] aria-current:opacity-100 aria-current:outline-1 aria-current:outline-white/60"
          >
            {item.type === "video" ? (
              <video
                src={item.url}
                muted
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <img src={item.url} alt="" className="h-full w-full object-cover" loading="lazy" />
            )}
          </button>
        ))}
      </div>
    </motion.dialog>,
    document.body,
  )
}
