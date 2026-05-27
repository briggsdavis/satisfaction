import { useQuery } from "convex/react"
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { api } from "../../convex/_generated/api"
import type { Doc, Id } from "../../convex/_generated/dataModel"
import { AboutHero } from "../components/about-hero"
import { useSmoothScroll } from "../components/smooth-scroll"
import { LogosCarousel } from "./home/brands-carousel"
import { FeaturedCascade } from "./home/featured-cascade"

type ValueItem = {
  image?: Id<"_storage">
  label: string
  body: string
}

type WheelItem = Doc<"aboutWheel">
type TimelineItem = Doc<"aboutTimeline">

// Per-card layout offsets (fixed 3) — hand-tuned non-uniform Pinterest feel
const VALUE_OFFSETS = ["mt-20", "mt-10", "mt-32"]
const VALUE_DELAYS = [0, 0.1, 0.2]

const ValueImage = ({
  storageId,
  alt,
  imgY,
}: {
  storageId: Id<"_storage"> | undefined
  alt: string
  imgY: MotionValue<string>
}) => {
  const url = useQuery(api.files.getUrl, storageId ? { storageId } : "skip")
  if (!url) return null
  return (
    <motion.img
      src={url}
      alt={alt}
      className="absolute inset-0 h-[130%] w-full object-cover will-change-transform [backface-visibility:hidden]"
      style={{ y: imgY, top: "-15%" }}
    />
  )
}

const ValueCard = ({
  value,
  offset,
  delay,
}: {
  value: ValueItem
  offset: string
  delay: number
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"])
  return (
    <motion.div
      ref={containerRef}
      className={`relative z-[2] flex-1 ${offset} cursor-pointer text-left`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => setIsOpen((v) => !v)}
    >
      <div className="relative aspect-2/3 w-full overflow-hidden">
        <ValueImage storageId={value.image} alt={value.label} imgY={imgY} />
        <div className="absolute bottom-3 left-3 z-10">
          <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
            {value.label}
          </span>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-xs leading-relaxed text-white/60">{value.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Wheel section ────────────────────────────────────────────────────────────

const WheelImage = ({ storageId, alt }: { storageId: Id<"_storage"> | undefined; alt: string }) => {
  const url = useQuery(api.files.getUrl, storageId ? { storageId } : "skip")
  if (!url) return null
  return <img src={url} alt={alt} className="h-full w-full object-cover" loading="lazy" />
}

const WheelPair = ({
  item,
  index,
  n,
  progress,
}: {
  item: WheelItem
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  const leftBound = index === 0 ? 0 : (2 * index - 1) / (2 * (n - 1))
  const rightBound = index === n - 1 ? 1 : (2 * index + 1) / (2 * (n - 1))
  const fade = 0.08
  const opacityInput =
    index === 0
      ? [0, Math.max(0, rightBound - fade), rightBound]
      : index === n - 1
        ? [leftBound, Math.min(1, leftBound + fade), 1]
        : [leftBound, leftBound + fade, rightBound - fade, rightBound]
  const opacityOutput = index === 0 ? [1, 1, 0] : index === n - 1 ? [0, 1, 1] : [0, 1, 1, 0]
  const opacity = useTransform(progress, opacityInput, opacityOutput)

  // Auto-numbering "01", "02", ...
  const number = String(index + 1).padStart(2, "0")

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-8 pt-24 md:flex-row md:gap-16 md:px-16"
    >
      <div className="flex-1">
        <p className="mb-3 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">{number}</p>
        <h3 className="massive-text mb-6 text-4xl leading-tight font-bold uppercase md:text-6xl lg:text-7xl">
          {item.heading}
        </h3>
        <p className="max-w-lg text-lg leading-relaxed font-light whitespace-pre-line text-white/70">
          {item.body}
        </p>
      </div>

      <div className="hidden w-[42%] shrink-0 md:block">
        <div className="aspect-[4/5] overflow-hidden">
          <WheelImage storageId={item.image} alt={item.heading} />
        </div>
      </div>
    </motion.div>
  )
}

const WheelDot = ({
  index,
  n,
  progress,
}: {
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  const center = n === 1 ? 0 : index / (n - 1)
  const dotOpacity = useTransform(
    progress,
    [Math.max(0, center - 0.3), center, Math.min(1, center + 0.3)],
    [0.25, 1, 0.25],
  )
  const dotScale = useTransform(
    progress,
    [Math.max(0, center - 0.3), center, Math.min(1, center + 0.3)],
    [0.7, 1.4, 0.7],
  )
  return (
    <motion.div
      className="h-1.5 w-1.5 rounded-full bg-white"
      style={{ opacity: dotOpacity, scale: dotScale }}
    />
  )
}

const WheelSection = ({ items }: { items: WheelItem[] }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const wrapperTopRef = useRef(0)
  const pinDistRef = useRef(0)
  const [pinDist, setPinDist] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const n = items.length

  useEffect(() => {
    const measure = () => {
      const dist = Math.max(0, window.innerHeight * (n - 1))
      pinDistRef.current = dist
      setPinDist(dist)
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      }
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY, n])

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistRef.current
    if (D === 0 || y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const progress = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistRef.current
    if (D === 0 || y <= T) return 0
    if (y >= T + D) return 1
    return (y - T) / D
  })

  if (n === 0) return null

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `calc(${pinDist}px + 100vh)` }}>
      <motion.div style={{ y: pinY }} className="relative h-screen">
        <div className="pointer-events-none absolute top-1/2 right-8 z-10 flex -translate-y-1/2 flex-col gap-3 md:right-16">
          {items.map((item, i) => (
            <WheelDot key={item._id} index={i} n={n} progress={progress} />
          ))}
        </div>

        <div className="h-full">
          {items.map((item, i) => (
            <WheelPair key={item._id} item={item} index={i} n={n} progress={progress} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export const About = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  const wheelItems = useQuery(api.about.listWheel) ?? []
  const timeline = useQuery(api.about.listTimeline) ?? []
  const about = useQuery(api.about.get)
  const valueItems: ValueItem[] = (about?.values ?? []).slice(0, 3)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const heroEnd = typeof window !== "undefined" ? window.innerHeight * 0.5 : 0
  const contentOpacity = useTransform(
    activeY,
    [heroEnd, heroEnd + (typeof window !== "undefined" ? window.innerHeight * 0.3 : 300)],
    [0, 1],
  )

  const wrapperTopRef = useRef(0)
  const scrollDistanceRef = useRef(0)

  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      }
      if (horizontalRef.current) {
        const leftOffset = window.innerWidth >= 768 ? 64 : 32
        const dist = Math.max(
          0,
          horizontalRef.current.scrollWidth - (window.innerWidth - leftOffset),
        )
        scrollDistanceRef.current = dist
        setScrollDistance(dist)
      }
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    const ro = new ResizeObserver(() => requestAnimationFrame(measure))
    ro.observe(document.documentElement)
    return () => {
      window.removeEventListener("resize", measure)
      ro.disconnect()
    }
  }, [smoothY])

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = scrollDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const x = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = scrollDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return -D
    return -(y - T)
  })

  const timelineProgress = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = scrollDistanceRef.current
    if (D === 0 || y <= T) return 0
    if (y >= T + D) return 1
    return (y - T) / D
  })

  return (
    <>
      <AboutHero />

      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className={`column-line${i % 2 !== 0 ? " hidden md:block" : ""}`}
          style={{
            left: `${(100 / 6) * i}%`,
            opacity: contentOpacity,
            ...({ ["--sweep-delay"]: `${i * 0.75}s` } as React.CSSProperties),
          }}
        />
      ))}

      <motion.div style={{ opacity: contentOpacity }} className="pt-[62vh]">
        <WheelSection items={wheelItems} />

        {/* Past Projects timeline */}
        <div
          ref={wrapperRef}
          className="relative"
          style={{ height: `calc(${scrollDistance}px + 100vh)` }}
        >
          <motion.div style={{ y: pinY }} className="flex h-screen flex-col overflow-hidden">
            <div className="flex-shrink-0 px-8 pt-40 pb-[3px] md:px-16">
              <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase">
                PORTFOLIO
              </h2>
              <h3 className="mt-1 font-display text-3xl font-bold tracking-tight uppercase md:text-5xl">
                PAST PROJECTS &amp; CLIENTS
              </h3>
            </div>

            <div className="relative mx-8 mt-5 mb-1 h-[3px] bg-white/10 md:mx-16">
              <motion.div
                className="absolute inset-y-0 left-0 h-full w-full bg-white/70"
                style={{
                  scaleX: timelineProgress,
                  transformOrigin: "left center",
                }}
              />
            </div>

            <div className="ml-8 flex flex-1 items-start overflow-hidden pt-5 md:ml-16">
              <motion.div ref={horizontalRef} style={{ x }} className="flex gap-24 pr-8 md:pr-16">
                {(timeline as TimelineItem[]).map((item) => (
                  <div key={item._id} className="w-[85vw] flex-shrink-0 md:w-[45vw]">
                    <div>
                      <span className="text-sm font-bold tracking-widest text-white/60">
                        {item.date}
                      </span>
                      <h4 className="massive-text mt-4 text-5xl font-black tracking-tight uppercase md:text-7xl">
                        {item.client}
                      </h4>
                      {item.campaign && (
                        <p className="mt-2 text-2xl font-bold tracking-tight uppercase md:text-3xl">
                          {item.campaign}
                        </p>
                      )}
                      <p className="mt-6 text-xs font-bold tracking-widest text-white/60 uppercase">
                        {item.role}
                      </p>
                      {item.description && (
                        <p className="mt-6 max-w-lg text-lg leading-relaxed whitespace-pre-line text-white/60">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        <LogosCarousel carousel="work" />

        <FeaturedCascade />

        {/* Value cards (fixed 3) */}
        <div className="px-8 pt-[54px] pb-6 md:px-16 md:pt-[82px] md:pb-8">
          <div className="flex items-start gap-3 md:gap-5">
            {[0, 1, 2].map((i) => {
              const v = valueItems[i] ?? { label: "", body: "" }
              return (
                <ValueCard key={i} value={v} offset={VALUE_OFFSETS[i]} delay={VALUE_DELAYS[i]} />
              )
            })}
          </div>
        </div>

        {/* Branding CTA */}
        <div className="border-t border-white/10 px-8 py-16 md:px-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
                Brand Identity
              </p>
              <h2 className="text-2xl font-bold tracking-tight uppercase md:text-3xl">
                Ready to build your brand?
              </h2>
            </div>
            <Link to="/contact?branding=1" className="btn-industrial shrink-0">
              Start a Branding Brief →
            </Link>
          </div>
        </div>

        <div className="flex justify-center border-t border-white/10 py-12">
          <Link to="/services" className="btn-industrial">
            Discover Our Services
          </Link>
        </div>
      </motion.div>
    </>
  )
}
