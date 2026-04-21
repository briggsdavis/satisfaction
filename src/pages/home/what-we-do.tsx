import { motion, useTransform } from "motion/react"
import { useRef } from "react"
import { Link } from "react-router"
import { TextReveal } from "../../components/text-reveal"
import { usePinnedScroll } from "../../hooks/use-pinned-scroll"

const whatWeDoDistance = () => window.innerHeight

export const WhatWeDoSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { pinY, progress, pinDistance } = usePinnedScroll(
    wrapperRef,
    whatWeDoDistance,
  )

  const panel1Opacity = useTransform(progress, [0, 0.45, 0.65], [1, 1, 0])
  const panel2Opacity = useTransform(progress, [0.45, 0.65, 1], [0, 1, 1])
  const indicatorOpacity = useTransform(progress, [0.8, 1], [1, 0])

  return (
    <div
      ref={wrapperRef}
      style={{ height: `calc(${pinDistance}px + 100vh)` }}
      className="relative"
    >
      <motion.div
        style={{ y: pinY }}
        className="relative h-screen overflow-hidden bg-black"
      >
        {/* Panel 1: What We Do */}
        <motion.div
          style={{ opacity: panel1Opacity }}
          className="absolute inset-0 flex flex-col md:flex-row"
        >
          <div className="flex items-center border-b border-white/10 px-8 py-16 md:w-[42%] md:border-b-0 md:px-16">
            <TextReveal
              text="What we do"
              className="massive-text text-2xl leading-none md:text-5xl lg:text-8xl"
              immediate
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-8 px-8 py-12 md:px-16">
            <p className="max-w-lg text-lg leading-relaxed font-light text-white/70">
              Social Satisfaction is a creative agency specializing in bold
              brand transformations rooted in culture and storytelling. Founded
              by Devon Colebank, we work at the intersection of hospitality,
              lifestyle, and experiential marketing to evolve brands through
              striking visuals. By blending nostalgia with innovation, we create
              identities that feel both familiar and fresh for modern audiences.
            </p>
            <Link
              to="/about"
              className="btn-industrial-sm inline-block self-start"
            >
              About Us →
            </Link>
          </div>
        </motion.div>

        {/* Panel 2: Why We're Different */}
        <motion.div
          style={{ opacity: panel2Opacity }}
          className="absolute inset-0 flex flex-col md:flex-row"
        >
          <div className="flex items-center border-b border-white/10 px-8 py-16 md:w-[42%] md:border-b-0 md:px-16">
            <TextReveal
              text="Why we're different"
              className="massive-text text-2xl leading-none md:text-5xl lg:text-8xl"
              immediate
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-8 px-8 py-12 md:px-16">
            <div className="flex flex-col gap-8 md:flex-row md:gap-0">
              <div className="space-y-3 md:flex-1 md:pr-8">
                <p className="text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
                  Full-Scale Creative Campaigns
                </p>
                <p className="max-w-lg text-lg leading-relaxed font-light text-white/70">
                  We go beyond content creation to build comprehensive,
                  strategic campaigns. As a one-stop creative partner, we handle
                  every stage from ideation and production to rollout and
                  optimization. Our process ensures your marketing is cohesive,
                  intentional, and designed for measurable impact.
                </p>
              </div>
              <div className="space-y-3 md:flex-1 md:border-l md:border-white/10 md:pl-8">
                <p className="text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
                  Results-Driven Execution
                </p>
                <p className="max-w-lg text-lg leading-relaxed font-light text-white/70">
                  We do not just deliver files. We create fully realized
                  campaigns built to fill seats, drive reservations, and build
                  brand loyalty. By aligning strategy with visual storytelling,
                  we eliminate the need for multiple vendors and focus on
                  driving real results for your business.
                </p>
              </div>
            </div>
            <Link
              to="/about"
              className="btn-industrial-sm inline-block self-start"
            >
              About Us →
            </Link>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold tracking-[0.4em] text-white/15 uppercase"
        >
          Scroll ↓
        </motion.div>
      </motion.div>
    </div>
  )
}
