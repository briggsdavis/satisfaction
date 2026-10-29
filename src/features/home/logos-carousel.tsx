import { useQuery } from "convex/react"
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
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import type { Carousel } from "../../../convex/model"
import { Eyebrow } from "../../ui/page"

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
  const initializedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.borderBoxSize[0]?.inlineSize ?? entry.contentRect.width
      copyWidthRef.current = width
      if (width > 0 && !initializedRef.current) {
        baseX.set(-width)
        initializedRef.current = true
      }
    })
    observer.observe(track)
    return () => observer.disconnect()
  }, [baseX])

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
      if (next < -copyWidthRef.current * 2) next += copyWidthRef.current
      if (next > -copyWidthRef.current) next -= copyWidthRef.current
    }
    baseX.set(next)
  })

  return { sectionRef, baseX, trackRef, skewTransform, counterSkewTransform }
}

type Logo = { _id: Id<"logos">; url: string | null; alt: string }

const LogoBrand = ({
  logo,
  skew,
  counterSkew,
}: {
  logo: Logo
  skew: MotionValue<string>
  counterSkew: MotionValue<string>
}) => (
  <>
    <motion.div
      className="flex h-full w-[220px] shrink-0 items-center justify-center bg-white"
      style={{ transform: skew }}
    >
      {logo.url && (
        <motion.img
          src={logo.url}
          alt={logo.alt}
          className="max-h-14 max-w-[160px] object-contain"
          style={{ transform: counterSkew }}
        />
      )}
    </motion.div>
    <motion.div className="h-full w-[3px] shrink-0 bg-black" style={{ transform: skew }} />
  </>
)

export const LogosCarousel = ({
  carousel,
  eyebrow = "Our Work",
  heading = "Logos we've designed:",
}: {
  carousel: Carousel
  eyebrow?: string
  heading?: string
}) => {
  const { sectionRef, baseX, trackRef, skewTransform, counterSkewTransform } =
    useCarouselAnimation()
  const logos = useQuery(api.logos.list, { carousel }) ?? []

  return (
    <section ref={sectionRef} className="bg-black pb-0">
      <div className="border-b border-white/10 px-8 py-10 md:px-16">
        <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
        <h2 className="text-2xl leading-[1.25] font-light text-white md:text-3xl">{heading}</h2>
      </div>

      <div className="h-40 overflow-hidden border-b border-white/10 bg-white">
        {/* Three copies: the middle one is measured; the outer two hide the wrap seam. */}
        <motion.div style={{ x: baseX }} className="flex h-full w-max">
          {[0, 1, 2].map((copy) => (
            <div
              key={copy}
              ref={copy === 1 ? trackRef : undefined}
              aria-hidden={copy !== 1}
              className="flex h-full"
            >
              {logos.map((logo) => (
                <LogoBrand
                  key={logo._id}
                  logo={logo}
                  skew={skewTransform}
                  counterSkew={counterSkewTransform}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
