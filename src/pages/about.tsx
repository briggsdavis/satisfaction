import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { AboutHero } from "../components/about-hero"
import { useSmoothScroll } from "../components/smooth-scroll"

// Splits text into sentences and blurs each in on scroll
const BlurInLines = ({
  text,
  className,
  align,
}: {
  text: string
  className?: string
  align?: string
}) => {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  return (
    <div className={className}>
      {sentences.map((sentence, i) => (
        <motion.p
          key={i}
          className={`mb-4 text-xl leading-loose font-light text-white/70 ${align ?? ""}`}
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 1,
            delay: i * 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {sentence}
        </motion.p>
      ))}
    </div>
  )
}

const values = [
  {
    label: "CULTURE",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600",
    offset: "mt-20",
    delay: 0,
    body: "Culture isn't a backdrop, it's your product. We build content that makes people feel like they're already part of your world, translating your hospitality vision into storytelling that drives aspiration and belonging.",
  },
  {
    label: "DYNAMICS",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
    offset: "mt-10",
    delay: 0.1,
    body: "The market doesn't wait. Our in-house production model means we can turn a campaign concept around in days, not weeks, keeping your brand responsive to trends, seasons, and competitive shifts without losing cohesion.",
  },
  {
    label: "CREATIVITY",
    img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=600",
    offset: "mt-32",
    delay: 0.2,
    body: "Originality is what makes people stop scrolling. We develop visual identities and campaign narratives unique to each brand, never templated, never recycled. Every element is intentional and designed to make your brand unmistakable.",
  },
]

const timeline = [
  // 2021
  {
    date: "OCT 2021",
    client: "HOUSE OF BALLOONS",
    campaign: "BOSTON BEER COMPANY",
    role: "CREATIVE DIRECTION / EVENT ACTIVATION",
    description:
      "Led creative direction for an immersive Halloween event amplifying product awareness for Angry Orchard, Twisted Tea, and Truly. Inspired by The Weeknd's album, the experience blended moody aesthetics with cocktail storytelling to drive in-person and social engagement.",
  },
  {
    date: "DEC 2021",
    client: "ALISON COSMETICS",
    campaign: null,
    role: "BRAND IDENTITY / LABEL DESIGN",
    description:
      "Developed the complete visual identity and brand direction, including label design. The vibrant pink-on-black packaging with an interlocking AC logo was crafted for strong shelf appeal and lasting brand recognition.",
  },
  // 2022
  {
    date: "FEB 2022",
    client: "SINGLES ONLY",
    campaign: "BEAM SUNTORY",
    role: "EVENT ACTIVATION / CONTENT",
    description:
      "Redefined Valentine's Day as a celebration of self-love in collaboration with Beam Suntory. Strategic storytelling, bold cocktails, and influencer engagement positioned the spirits within a culturally resonant moment.",
  },
  {
    date: "JUN 2022",
    client: "VORTEX HELICOPTERS",
    campaign: null,
    role: "CONTENT CREATION",
    description: "",
  },
  {
    date: "JUN 2022",
    client: "ABSOLUT CITRON",
    campaign: null,
    role: "CREATIVE DIRECTION / PHOTOSHOOT",
    description:
      "Used warm orange backdrops, diamonds, and citrus florals to evoke the bold, premium feel of the product. Delivered a visually striking campaign reinforcing Absolut Citron's vibrant, sophisticated identity.",
  },
  {
    date: "JUL 2022",
    client: "BLUE MOON LIGHT SKY",
    campaign: null,
    role: "CREATIVE DIRECTION / PHOTOSHOOT",
    description:
      "Crafted a sunlit picnic visual narrative positioning Light Sky as the go-to beer for refreshing social moments. Composition and color palette highlighted the crisp, citrus-forward flavor while driving organic shareability.",
  },
  {
    date: "AUG 2022",
    client: "BELOVED DUNKS",
    campaign: "NIKE",
    role: "ART DIRECTION / CAMPAIGN",
    description:
      "Art directed the launch campaign for a bespoke Nike Dunk release, emphasizing the red-and-white palette and signature heart detail across digital and print. Every visual element was designed to amplify desirability and reinforce Nike's cultural influence.",
  },
  {
    date: "NOV 2022",
    client: "MAKER'S MARK",
    campaign: null,
    role: "CREATIVE DIRECTION / CAMPAIGN",
    description:
      "Directed a Thanksgiving-themed campaign around Maker's Mark's personalized label feature, evoking warmth and holiday tradition through rich color palettes and intimate dinner settings.",
  },
  {
    date: "NOV 2022",
    client: "LIGHT UP NIGHT",
    campaign: "SMIRNOFF",
    role: "EVENT ACTIVATION",
    description: "",
  },
  // 2023
  {
    date: "FEB 2023",
    client: "SINGLES ONLY",
    campaign: "BEAM SUNTORY",
    role: "CAMPAIGN / CONTENT",
    description:
      "Elevated the concept by pairing each model with a Beam Suntory whisky that reflected their personality, from Hibiki to Maker's Mark to Hornitos. Refined visuals and digital amplification repositioned whisky as an extension of individuality.",
  },
  {
    date: "AUG 2023",
    client: "MORGAN WALLEN",
    campaign: "JIM BEAM",
    role: "CREATIVE DIRECTION / CAMPAIGN",
    description:
      "Produced a campaign integrating Jim Beam Peach, Apple, and Orange into an authentic country music concert experience. Intentional set design drove relatability while expanding reach across digital and social platforms.",
  },
  {
    date: "OCT 2023",
    client: "TRICKS AND TREATS 2",
    campaign: "BEAM SUNTORY",
    role: "EVENT ACTIVATION",
    description:
      "Designed an immersive Halloween activation for Hornitos, Maker's Mark, Tres Generaciones, and Haku Vodka. Eerie cocktails and seasonal decor sparked social sharing and deepened brand affinity across the portfolio.",
  },
  {
    date: "NOV 2023",
    client: "LIGHT UP NIGHT",
    campaign: null,
    role: "EVENT ACTIVATION",
    description: "",
  },
  {
    date: "DEC 2023",
    client: "CANDY CANES AND COCKTAILS",
    campaign: null,
    role: "EVENT ACTIVATION",
    description: "",
  },
  // 2024
  {
    date: "FEB 2024",
    client: "SINGLES ONLY",
    campaign: null,
    role: "EVENT ACTIVATION",
    description: "",
  },
  {
    date: "MAY 2024",
    client: "YUZU KITCHEN",
    campaign: null,
    role: "REBRAND / DIGITAL",
    description:
      "Led a comprehensive rebrand including a refreshed logo, website overhaul, and food photography for online ordering. Bold Japanese-inspired aesthetics modernized the visual identity and strengthened community connection.",
  },
  {
    date: "JUN 2024",
    client: "TRULY HARD SELTZER",
    campaign: null,
    role: "CONTENT CREATION",
    description: "",
  },
  {
    date: "JUL 2024",
    client: "THIS AIN'T TEXAS",
    campaign: "CODIGO TEQUILA",
    role: "EVENT ACTIVATION / PHOTOSHOOT",
    description:
      "Planned and executed a Western-themed summer activation and photoshoot for Codigo Tequila. A vintage Chevy truck, guitars, and rustic settings aligned with the brand's premium yet approachable lifestyle identity.",
  },
  {
    date: "SEP 2024",
    client: "HIGH END SWEETS",
    campaign: null,
    role: "BRAND IDENTITY",
    description:
      "Created a luxury brand identity featuring an elegant flowing logo with an embedded heart and a pink-red palette. Every design choice communicates indulgence, artistry, and high-end appeal within the specialty desserts market.",
  },
  {
    date: "SEP 2024",
    client: "PITTSBURGH PLANNER",
    campaign: null,
    role: "BRAND IDENTITY",
    description:
      "Designed a distinctive visual identity with an interlocking PP monogram and a warm pink-purple-orange palette. The branding reflects personalization and creative energy across all digital and print touchpoints.",
  },
  {
    date: "NOV 2024",
    client: "LILITH",
    campaign: null,
    role: "REBRAND / DIGITAL",
    description:
      "Led a full digital rebrand including website and menu redesign plus ongoing social media management for this woman-owned restaurant. SEO optimization, Instagram Reels, and event promotions increased visibility and drove reservations.",
  },
  {
    date: "DEC 2024",
    client: "EYV",
    campaign: null,
    role: "DIGITAL MARKETING / REBRAND",
    description:
      "Transformed the digital presence of this vegetable-forward restaurant through website redesign, SEO, and social content strategy. Dynamic Reels and curated posts broadened appeal while reinforcing a plant-forward culinary identity.",
  },
  {
    date: "DEC 2024",
    client: "SHORTY'S",
    campaign: "PINS AND PINTS",
    role: "CREATIVE DIRECTION / CONTENT",
    description:
      "Directed a Santa's Holiday Workshop pop-up photoshoot and new bar menu launch, capturing playful seasonal visuals and crave-worthy food photography. Content reinforced Shorty's reputation as a go-to entertainment and dining destination.",
  },
  // 2025
  {
    date: "JAN 2025",
    client: "ELECTRIC BEAUTY",
    campaign: null,
    role: "CREATIVE DIRECTION",
    description: "",
  },
  {
    date: "FEB 2025",
    client: "SINGLES ONLY",
    campaign: "TEREMANA TEQUILA",
    role: "EVENT ACTIVATION / CONTENT",
    description:
      "Designed an anti-Valentine's Day event for Teremana Tequila featuring cheeky cocktail names and nostalgic candy heart elements. Skit-driven photoshoots and nightlife storytelling made the brand aspirational and approachable for a young social audience.",
  },
  {
    date: "MAR 2025",
    client: "LUNCHLINE",
    campaign: null,
    role: "CREATIVE DIRECTION",
    description: "",
  },
]

const ValueCard = ({ value }: { value: (typeof values)[0] }) => {
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
      className={`relative z-[2] flex-1 ${value.offset} cursor-pointer text-left`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: value.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => setIsOpen((v) => !v)}
    >
      {/* Image with parallax */}
      <div className="relative aspect-2/3 w-full overflow-hidden">
        <motion.img
          src={value.img}
          alt={value.label}
          className="absolute inset-0 h-[130%] w-full object-cover will-change-transform [backface-visibility:hidden]"
          style={{ y: imgY, top: "-15%" }}
        />
        {/* Tag overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
            {value.label}
          </span>
        </div>
      </div>

      {/* Inline expand drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-xs leading-relaxed text-white/60">
              {value.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export const About = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  // Fade content in as the WHO WE ARE overlay exits (matches AboutHero's scrollDistance = 50vh)
  const heroEnd = typeof window !== "undefined" ? window.innerHeight * 0.5 : 0
  const contentOpacity = useTransform(
    activeY,
    [heroEnd - 10, heroEnd + 10],
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
    <>
      <AboutHero />

      <motion.div style={{ opacity: contentOpacity }} className="pt-[62vh]">
        {/* Three staggered paragraphs — line-by-line blur-in */}
        <div className="mb-12 px-8 md:px-16">
          <div className="flex justify-start">
            <BlurInLines
              className="about-glow-text max-w-sm"
              text="Social Satisfaction, founded by Devon Colebank, transforms hospitality and lifestyle brands through cultural storytelling. We blend nostalgia with modern innovation to create resonant identities that bridge the gap between trend-forward messaging and striking visuals."
            />
          </div>
          <div className="mt-32 flex justify-end">
            <BlurInLines
              className="about-glow-text max-w-sm text-right"
              text={
                "We replace \u201cshoot and share\u201d tactics with performance-driven campaigns. As an end-to-end partner, we manage everything from ideation to execution. This streamlined structure ensures every effort is intentional, cohesive, and designed to drive reservations."
              }
              align="text-right"
            />
          </div>
          <div className="mt-32 flex justify-center">
            <BlurInLines
              className="about-glow-text max-w-sm"
              text="By integrating strategy with internal production, we eliminate fragmented communication and multiple vendors. Every piece of content serves a business objective. The result is a consistent, optimized rollout that delivers measurable brand loyalty."
              align="text-center"
            />
          </div>
        </div>

        {/* Portfolio Timeline — header pinned inside scrolling section */}
        <div
          ref={wrapperRef}
          className="relative"
          style={{ height: `calc(${scrollDistance}px + 100vh)` }}
        >
          <motion.div
            style={{ y: pinY }}
            className="flex h-screen flex-col overflow-hidden"
          >
            {/* Compact header */}
            <div className="flex-shrink-0 px-8 pt-40 pb-[3px] md:px-16">
              <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase">
                PORTFOLIO
              </h2>
              <h3 className="mt-1 text-3xl font-bold tracking-tight uppercase md:text-5xl">
                PAST PROJECTS & CLIENTS
              </h3>
            </div>
            {/* Scrolling cards */}
            <div className="ml-8 flex flex-1 items-start overflow-hidden pt-6 md:ml-16">
              <motion.div
                ref={horizontalRef}
                style={{ x }}
                className="flex gap-24 pr-8 md:pr-16"
              >
                {timeline.map((item) => (
                  <div
                    key={item.date + "-" + item.client}
                    className="w-[85vw] flex-shrink-0 md:w-[45vw]"
                  >
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
                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
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

        {/* Values Images — three staggered portrait images, click to expand text */}
        <div className="px-8 pt-[54px] pb-6 md:px-16 md:pt-[82px] md:pb-8">
          <div className="flex items-start gap-3 md:gap-5">
            {values.map((value) => (
              <ValueCard key={value.label} value={value} />
            ))}
          </div>
        </div>

        {/* Discover Our Services CTA */}
        <div className="flex justify-center py-12">
          <Link to="/services" className="btn-industrial">
            Discover Our Services
          </Link>
        </div>
      </motion.div>
    </>
  )
}
