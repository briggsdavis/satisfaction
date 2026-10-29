import { motion, useScroll, useTransform } from "motion/react"
import { api } from "../../../convex/_generated/api"
import { preload } from "../../lib/convex"
import { Link } from "../../ui/link"
import { ColumnLines, Eyebrow, Meta } from "../../ui/page"
import { Faq } from "../contact/faq"
import { FeaturedCascade } from "../home/featured-cascade"
import { LogosCarousel } from "../home/logos-carousel"
import { AboutHero } from "./about-hero"
import { ModelScene } from "./model-scene"
import { Timeline } from "./timeline"
import { Values } from "./values"
import { Wheel } from "./wheel"

export const loader = async () => {
  await Promise.all([
    preload(api.wheel.list),
    preload(api.timeline.list),
    preload(api.faq.list),
    preload(api.logos.list, { carousel: "work" }),
    preload(api.projects.featured),
  ])
  return null
}

export const Component = () => {
  // Everything below the hero fades in as the "WHO WE ARE" zoom finishes.
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, (y) => {
    const vh = window.innerHeight
    return Math.min(1, Math.max(0, (y - vh * 0.5) / (vh * 0.3)))
  })

  return (
    <>
      <Meta title="About" />
      <AboutHero />
      <motion.div style={{ opacity }} className="pointer-events-none fixed inset-0 -z-10">
        <ModelScene />
      </motion.div>
      <motion.div style={{ opacity }}>
        <ColumnLines />
      </motion.div>

      <motion.div style={{ opacity }} className="pt-[62vh]">
        <Wheel />
        <Timeline />
        <LogosCarousel carousel="work" />
        <FeaturedCascade />
        <Values />
        <Faq />

        <div className="border-t border-white/10 px-8 py-16 md:px-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Eyebrow className="mb-2">Brand Identity</Eyebrow>
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
