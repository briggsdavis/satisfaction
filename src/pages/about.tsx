import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { AsymmetricalSection } from "../components/asymmetrical-section"
import { DeBlurText } from "../components/de-blur-text"
import { useSmoothScroll } from "../components/smooth-scroll"
import { TextReveal } from "../components/text-reveal"

export const About = () => {
  const timeline = [
    {
      date: "FEB - 2021",
      client: "TRULY",
      campaign: '"THIS IS GOLD" CAMPAIGN',
      role: "DIGITAL CONTENT CREATOR LEAD",
      description:
        'Created and developed photo and video content for TRULY distribution in the Pittsburgh region. "#THISISGOLD" Introduces the New TRULY Iced Tea Hard Seltzer. Refreshing hard seltzer meets real brewed tea and fruit flavor for a drink that\'s liquid gold.',
    },
    {
      date: "OCT - 2020",
      client: "COORS SELTZER",
      campaign: "HALLOWEEN CAMPAIGN",
      role: "DIGITAL CONTENT CREATOR & EVENT COORDINATOR LEAD",
      description:
        "Created and developed photo and video content for COORS SELTZER distribution in the Greater Pittsburgh Area region leading and ongoing into the Halloween holiday season. Along with developing and creating ads, also planned and coordinated an event for their target audience in the area, that lead to product being pushed to over 40,000 people.",
    },
    {
      date: "2019 - 2020",
      client: "WINES OF AMERICA",
      campaign: null,
      role: "MARKETING DIRECTOR & CREATIVE DIRECTOR",
      description:
        "Lead and fulfilled the rebrand of a nationwide wine distribution company. Created a cohesive brand aesthetic across all social media platforms that helps enhance the brand's story. Oversaw the operation of a company's website or email marketing program and provide analytics review.",
    },
    {
      date: "2019 - PRESENT",
      client: "DOCHERTY:",
      campaign: "MODEL & TALENT AGENCY",
      role: "PHOTOGRAPHER",
      description:
        "Fashion photographer highlighting model and other clothing products in exciting and memorable ways. Worked closely with models and brands to conceptualize and shoot photos that showcase them as effectively as possible.",
    },
    {
      date: "2019 - 2020",
      client: "VANDALS CLOTHING CO.",
      campaign: null,
      role: "CONTENT CREATOR & DESIGNER",
      description:
        "Developed organic creative content for social media platforms and website. Designed and developed clothing graphics. Creative Direction with project ideas, collaborations, etc.",
    },
    {
      date: "2017 - PRESENT",
      client: "DEVON COLEBANK MEDIA",
      campaign: null,
      role: "DIGITAL CONTENT CREATION",
      description:
        "Manage and own my current media business, where I do freelance Photography, Videography, Graphic Design, and other media needs for: businesses, entrepreneurs, artists, models and other advertising agencies.",
    },
  ]

  const wrapperRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const wrapperTopRef = useRef(0)
  const scrollDistanceRef = useRef(0)

  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      }
      if (horizontalRef.current) {
        const dist = Math.max(
          0,
          horizontalRef.current.scrollWidth - window.innerWidth,
        )
        scrollDistanceRef.current = dist
        setScrollDistance(dist)
      }
    }

    requestAnimationFrame(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
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

  return (
    <div className="pt-40">
      <div className="mb-32 px-8">
        <DeBlurText className="mb-8 text-[12vw] leading-none">
          Devon
          <br />
          <span className="text-white/60">Colebank</span>
        </DeBlurText>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
          <div className="space-y-8">
            {/* stagger={0.003} makes the character animation significantly faster */}
            <TextReveal
              as="p"
              text="Devon Colebank is a Pittsburgh-based creative director and brand strategist with seven years of experience in commercial production, digital marketing, and brand identity development. His work spans videography, photography, and graphic design for brands like Coors Light, Red Bull, Maker's Mark, and Truly Hard Seltzer."
              className="text-2xl leading-relaxed font-light"
              stagger={0.003}
              immediate
            />
          </div>
          <div className="space-y-8 leading-relaxed">
            <p className="text-white/60">
              Born and raised in Pittsburgh and Uniontown, PA, Devon joined the
              Army at 17 and spent six years on deployments overseas, including
              time at Camp David. That discipline carries through every project
              he touches today.
            </p>
            <p className="text-white/60">
              After the military, Devon launched Social Satisfaction and quickly
              became recognized as a top creative professional in Pittsburgh's
              scene. He currently serves as Marketing Director at Richard
              DeShantz Restaurant Group, helping foster the growth of Pittsburgh
              as a culinary hub.
            </p>
            <div className="flex gap-12 pt-8">
              <div>
                <h4 className="text-white/60 mb-2 text-[10px] font-bold tracking-widest uppercase">
                  Location
                </h4>
                <p>Pittsburgh, PA</p>
              </div>
              <div>
                <h4 className="text-white/60 mb-2 text-[10px] font-bold tracking-widest uppercase">
                  Focus
                </h4>
                <p>Creative Direction & Brand Strategy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Timeline Section */}
      <div className="mb-16 px-8">
        <h2 className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
          PORTFOLIO
        </h2>
        <h3 className="mt-2 text-3xl font-bold tracking-tight uppercase md:text-5xl">
          PAST PROJECTS & CLIENTS
        </h3>
      </div>
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `calc(${scrollDistance}px + 100vh)` }}
      >
        <motion.div
          style={{ y: pinY }}
          className="flex h-screen items-center overflow-hidden"
        >
          <motion.div
            ref={horizontalRef}
            style={{ x }}
            className="flex gap-24 px-8"
          >
            {timeline.map((item) => (
              <div
                key={item.client}
                className="w-[85vw] flex-shrink-0 md:w-[45vw]"
              >
                <div className="border-white/20 border-l-2 pl-8">
                  <span className="text-white/60 text-sm font-bold tracking-widest">
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
                  <p className="text-white/60 mt-6 text-xs font-bold tracking-widest uppercase">
                    {item.role}
                  </p>
                  <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200"
        title="Portrait Mastery"
        subtitle="Editorial Photography"
        align="right"
      />

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200"
        title="Cinematic Vision"
        subtitle="Documentary Film"
        align="left"
      />
    </div>
  )
}
