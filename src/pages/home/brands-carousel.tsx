import {
  MotionValue,
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react"
import { useEffect, useRef } from "react"

const BRANDS = [
  "Coors Light",
  "Red Bull",
  "Maker's Mark",
  "Heinz",
  "Under Armour",
  "Patagonia",
  "New Balance",
  "Jack Daniel's",
  "Vans",
  "Levi's",
  "Pittsburgh Steelers",
  "ESPN",
]

const LOGO_BRANDS = [
  { name: "NFL", src: "/nfllogo.png" },
  { name: "Absolut", src: "/absolutlogo.png" },
  { name: "Maker's Mark", src: "/makerslogo.png" },
  { name: "H&M", src: "/hmlogo.png" },
  { name: "Jägermeister", src: "/jaegerlogo.png" },
  { name: "Truly", src: "/trulylogo.png" },
  { name: "Angles", src: "/angleslogo.png" },
  { name: "Jim Beam", src: "/jimbeanlogo.png" },
  { name: "Coors", src: "/coorslogo.png" },
  { name: "Red Bull", src: "/redbulllogo.png" },
]

// Shared hook for the infinite carousel animation logic
const useCarouselAnimation = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const isVisibleRef = useRef(true)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { rootMargin: "100px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 45,
    stiffness: 60,
  })

  const skewAngle = useSpring(-12, { stiffness: 320, damping: 45 })
  const skewTransform = useTransform(skewAngle, (v) => `skewX(${v}deg)`)
  // Counter-transform keeps text upright inside skewed containers
  const counterSkewTransform = useTransform(skewAngle, (v) => `skewX(${-v}deg)`)

  const baseX = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const copyWidthRef = useRef(0)

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        copyWidthRef.current = trackRef.current.offsetWidth
      }
    }
    requestAnimationFrame(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const directionRef = useRef<1 | -1>(-1)

  useEffect(() => {
    return scrollVelocity.on("change", (v) => {
      if (v > 20) {
        skewAngle.set(-12)
        directionRef.current = -1
      } else if (v < -20) {
        skewAngle.set(12)
        directionRef.current = 1
      }
    })
  }, [scrollVelocity, skewAngle])

  useAnimationFrame((_, delta) => {
    if (!isVisibleRef.current) return
    const BASE_SPEED = 60
    const velocityBoost = Math.abs(smoothVelocity.get()) * 0.06
    const speed = BASE_SPEED + velocityBoost
    const dir = directionRef.current
    let next = baseX.get() + dir * speed * (delta / 1000)
    if (copyWidthRef.current > 0) {
      if (next < -copyWidthRef.current) next += copyWidthRef.current
      if (next > 0) next -= copyWidthRef.current
    }
    baseX.set(next)
  })

  return { sectionRef, baseX, trackRef, skewTransform, counterSkewTransform }
}

export const BrandsCarousel = () => {
  const { sectionRef, baseX, trackRef, skewTransform } = useCarouselAnimation()

  return (
    <section ref={sectionRef} className="bg-black pb-[52px] md:pb-[73px]">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-10 md:px-16">
        <p className="mb-4 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
          Collaborations
        </p>
        <h2 className="text-2xl leading-[1.25] font-light md:text-3xl">
          Brands &amp; creative teams we&apos;ve worked with:
        </h2>
      </div>

      {/* Scrolling track */}
      <div className="h-40 overflow-hidden border-b border-white/10">
        <motion.div style={{ x: baseX }} className="flex h-full w-max">
          <div ref={trackRef} className="flex h-full">
            {BRANDS.map((brand) => (
              <div key={brand} className="flex h-full shrink-0 items-center">
                <div className="flex h-full w-[220px] items-center justify-center">
                  <span className="font-display text-xl tracking-wide whitespace-nowrap text-white/40 uppercase">
                    {brand}
                  </span>
                </div>
                <motion.div
                  className="relative h-full w-9 shrink-0"
                  style={{ transform: skewTransform }}
                >
                  <div
                    className="absolute inset-y-0 w-px bg-white/35"
                    style={{ left: "8px" }}
                  />
                  <div
                    className="absolute inset-y-0 w-px bg-white/35"
                    style={{ left: "24px" }}
                  />
                </motion.div>
              </div>
            ))}
          </div>
          <div aria-hidden className="flex h-full">
            {BRANDS.map((brand) => (
              <div key={brand} className="flex h-full shrink-0 items-center">
                <div className="flex h-full w-[220px] items-center justify-center">
                  <span className="font-display text-xl tracking-wide whitespace-nowrap text-white/40 uppercase">
                    {brand}
                  </span>
                </div>
                <motion.div
                  className="relative h-full w-9 shrink-0"
                  style={{ transform: skewTransform }}
                >
                  <div
                    className="absolute inset-y-0 w-px bg-white/35"
                    style={{ left: "8px" }}
                  />
                  <div
                    className="absolute inset-y-0 w-px bg-white/35"
                    style={{ left: "24px" }}
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const LogoBrand = ({
  brand,
  skewTransform,
  counterSkewTransform,
}: {
  brand: { name: string; src: string }
  skewTransform: MotionValue<string>
  counterSkewTransform: MotionValue<string>
}) => (
  <>
    {/* Full-height white parallelogram containing the logo image */}
    <motion.div
      className="flex h-full w-[220px] shrink-0 items-center justify-center bg-white"
      style={{ transform: skewTransform }}
    >
      {/* Counter-skew keeps the image upright */}
      <motion.img
        src={brand.src}
        alt={brand.name}
        className="max-h-14 max-w-[160px] object-contain"
        style={{ transform: counterSkewTransform }}
      />
    </motion.div>
    {/* Thin black skewed separator line */}
    <motion.div
      className="h-full w-[3px] shrink-0 bg-black"
      style={{ transform: skewTransform }}
    />
  </>
)

export const LogosCarousel = () => {
  const { sectionRef, baseX, trackRef, skewTransform, counterSkewTransform } =
    useCarouselAnimation()

  return (
    <section ref={sectionRef} className="bg-black pb-0">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-10 md:px-16">
        <p className="mb-4 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
          Our Work
        </p>
        <h2 className="text-2xl leading-[1.25] font-light text-white md:text-3xl">
          Logos we&apos;ve designed:
        </h2>
      </div>

      {/* Scrolling track — white background so gaps between parallelograms are also white */}
      <div className="h-40 overflow-hidden border-b border-white/10 bg-white">
        <motion.div style={{ x: baseX }} className="flex h-full w-max">
          {/* First copy — measured for wrap */}
          <div ref={trackRef} className="flex h-full">
            {LOGO_BRANDS.map((brand) => (
              <LogoBrand
                key={brand.name}
                brand={brand}
                skewTransform={skewTransform}
                counterSkewTransform={counterSkewTransform}
              />
            ))}
          </div>
          {/* Second copy — seamless loop */}
          <div aria-hidden className="flex h-full">
            {LOGO_BRANDS.map((brand) => (
              <LogoBrand
                key={brand.name}
                brand={brand}
                skewTransform={skewTransform}
                counterSkewTransform={counterSkewTransform}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
