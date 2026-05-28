import { useEffect, useRef, useState } from "react"
import type { Doc } from "../../../convex/_generated/dataModel"

type Category = Doc<"categories">

const IMG_W = 3300
const IMG_H = 2475

// Screen corners as % of background image, in TL, TR, BR, BL order
const screenCorners = [
  { x: 18.53, y: 6.01 },
  { x: 79.25, y: 21.08 },
  { x: 82.61, y: 73.83 },
  { x: 19.76, y: 71.08 },
]

function adj(m: number[]) {
  return [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3],
  ]
}
function multmm(a: number[], b: number[]) {
  const c = Array(9)
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      let s = 0
      for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j]
      c[3 * i + j] = s
    }
  return c
}
function multmv(m: number[], v: number[]) {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ]
}
function basisToPoints(p: number[]) {
  const m = [p[0], p[2], p[4], p[1], p[3], p[5], 1, 1, 1]
  const v = multmv(adj(m), [p[6], p[7], 1])
  return multmm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]])
}
function projection(sw: number, sh: number, dst: number[]) {
  const s = basisToPoints([0, 0, sw, 0, sw, sh, 0, sh])
  const d = basisToPoints(dst)
  const t = multmm(d, adj(s))
  for (let i = 0; i < 9; i++) t[i] /= t[8]
  return `matrix3d(${[
    t[0],
    t[3],
    0,
    t[6],
    t[1],
    t[4],
    0,
    t[7],
    0,
    0,
    1,
    0,
    t[2],
    t[5],
    0,
    t[8],
  ].join(",")})`
}

export const PhotographyHero = ({ category: _category }: { category: Category }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const transform =
    size.w > 0
      ? projection(
          size.w,
          size.h,
          screenCorners.flatMap((c) => [(c.x / 100) * size.w, (c.y / 100) * size.h]),
        )
      : ""

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="relative"
        style={{
          aspectRatio: `${IMG_W} / ${IMG_H}`,
          width: `min(100%, calc(100vh * ${IMG_W} / ${IMG_H}))`,
        }}
      >
        <img
          src="/mock/photo/mac.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          draggable={false}
        />
        <video
          aria-label="Photography example"
          src="/mock/photo/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 select-none"
          draggable={false}
          style={{
            width: size.w ? `${size.w}px` : "100%",
            height: size.h ? `${size.h}px` : "100%",
            transformOrigin: "0 0",
            transform,
          }}
        />
      </div>
    </section>
  )
}
