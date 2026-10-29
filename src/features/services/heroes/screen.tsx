import { useSize } from "../../../lib/hooks"
import { ScrollingTextHero } from "./scrolling-text-hero"
import type { HeroProps } from "./types"

type Point = { x: number; y: number }

// 2D homography: maps the unit rectangle onto four arbitrary corners, so a
// flat <video> can be warped onto a photographed screen.
const adj = (m: number[]) => [
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
const mul = (a: number[], b: number[]) =>
  Array.from({ length: 9 }, (_, n) => {
    const [i, j] = [Math.floor(n / 3), n % 3]
    return a[3 * i] * b[j] + a[3 * i + 1] * b[3 + j] + a[3 * i + 2] * b[6 + j]
  })
const basis = (p: number[]) => {
  const m = [p[0], p[2], p[4], p[1], p[3], p[5], 1, 1, 1]
  const a = adj(m)
  const v = [0, 1, 2].map((r) => a[3 * r] * p[6] + a[3 * r + 1] * p[7] + a[3 * r + 2])
  return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]])
}
const matrix3d = (w: number, h: number, corners: Point[]) => {
  const dst = corners.flatMap((c) => [(c.x / 100) * w, (c.y / 100) * h])
  const t = mul(basis(dst), adj(basis([0, 0, w, 0, w, h, 0, h]))).map((x, _, all) => x / all[8])
  return `matrix3d(${[t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]]})`
}

/** Device photo with a looping video projected onto its screen, over scrolling name text. */
export const screenHero = (config: {
  image: string
  video: string
  width: number
  height: number
  /** Screen corners as % of the image, TL TR BR BL. */
  corners: Point[]
  label: string
}) =>
  function ScreenHero({ service }: HeroProps) {
    const [ref, size] = useSize<HTMLDivElement>()
    const { image, video, width, height, corners, label } = config
    return (
      <section className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <ScrollingTextHero text={service.name} />
        </div>
        <div
          ref={ref}
          className="relative z-10"
          style={{
            aspectRatio: `${width} / ${height}`,
            width: `min(100%, calc(100vh * ${width} / ${height}))`,
          }}
        >
          <img
            src={image}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
          />
          <video
            aria-label={label}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 origin-top-left select-none"
            style={{
              width: size.width || "100%",
              height: size.height || "100%",
              transform: size.width ? matrix3d(size.width, size.height, corners) : undefined,
            }}
          />
        </div>
      </section>
    )
  }

export const PhotographyHero = screenHero({
  image: "/heroes/photography/device.png",
  video: "/heroes/photography/reel.mp4",
  width: 3300,
  height: 2475,
  corners: [
    { x: 18.53, y: 6.01 },
    { x: 79.25, y: 21.08 },
    { x: 82.61, y: 73.83 },
    { x: 19.76, y: 71.08 },
  ],
  label: "Photography example",
})

export const VideographyHero = screenHero({
  image: "/heroes/videography/device.png",
  video: "/heroes/videography/reel.mp4",
  width: 1920,
  height: 1440,
  corners: [
    { x: 21.21, y: 14.15 },
    { x: 69.32, y: 2.85 },
    { x: 75.51, y: 52.44 },
    { x: 30.14, y: 63.75 },
  ],
  label: "Videography example",
})
