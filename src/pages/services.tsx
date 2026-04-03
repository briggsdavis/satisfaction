import { motion } from "motion/react"
import { Link } from "react-router"
import { TextReveal } from "../components/text-reveal"

const SERVICES = [
  {
    name: "Creative Direction",
    tag: "Strategy",
    desc: "Shaping the visual language of your brand from concept to final execution.",
    inverted: false,
    minH: "min-h-[380px]",
  },
  {
    name: "Photography",
    tag: "Photo",
    desc: "Editorial, commercial, and event photography with an instinct for light.",
    inverted: true,
    minH: "min-h-[520px]",
  },
  {
    name: "Branding",
    tag: "Design",
    desc: "Visual identity systems built to outlast trends and grow with you.",
    inverted: true,
    minH: "min-h-[310px]",
  },
  {
    name: "Campaigns",
    tag: "Production",
    desc: "End-to-end campaign production for brands that mean business.",
    inverted: false,
    minH: "min-h-[460px]",
  },
  {
    name: "Production",
    tag: "Video / Film",
    desc: "Full-service film and video production from brief to final cut.",
    inverted: false,
    minH: "min-h-[340px]",
  },
  {
    name: "Motion Graphics",
    tag: "Video / Motion",
    desc: "Animated content that moves — and moves people.",
    inverted: true,
    minH: "min-h-[490px]",
  },
  {
    name: "Social Media",
    tag: "Content",
    desc: "Scroll-stopping content built for modern platforms and audiences.",
    inverted: true,
    minH: "min-h-[350px]",
  },
  {
    name: "Influencer / UGC",
    tag: "Content",
    desc: "Authentic creator-led content at the scale your brand needs.",
    inverted: false,
    minH: "min-h-[430px]",
  },
  {
    name: "Event Launch Marketing",
    tag: "Events",
    desc: "Brand experiences that amplify your launch and live beyond the night.",
    inverted: false,
    minH: "min-h-[370px]",
  },
]

const ServiceCell = ({
  service,
  index,
}: {
  service: (typeof SERVICES)[0]
  index: number
}) => (
  <motion.div
    className={`relative flex flex-col justify-between p-7 ${service.minH} ${
      service.inverted ? "bg-white text-black" : "bg-black text-white"
    }`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{
      duration: 0.6,
      delay: (index % 3) * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    }}
  >
    {/* Top — tag + description */}
    <div>
      <span
        className={`mb-4 block text-[9px] font-bold tracking-[0.35em] uppercase ${
          service.inverted ? "text-black/35" : "text-white/30"
        }`}
      >
        {service.tag}
      </span>
      <p
        className={`text-sm leading-relaxed ${
          service.inverted ? "text-black/60" : "text-white/55"
        }`}
      >
        {service.desc}
      </p>
    </div>

    {/* Center — + */}
    <Link
      to="/contact"
      className={`flex items-center justify-center py-8 text-7xl font-thin leading-none transition-opacity hover:opacity-60 ${
        service.inverted ? "text-black/15" : "text-white/12"
      }`}
      aria-label={`Enquire about ${service.name}`}
    >
      +
    </Link>

    {/* Bottom — service name large */}
    <div className="overflow-hidden">
      <span className="block font-display text-[clamp(2rem,4.5vw,3.5rem)] uppercase leading-[0.85]">
        {service.name}
      </span>
    </div>
  </motion.div>
)

export const Services = () => (
  <div className="pt-32">
    {/* Page header */}
    <section className="border-b border-white/10 px-8 pb-16 md:px-16">
      <span className="mb-6 block text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">
        What I Do
      </span>
      <TextReveal
        text="SERVICES"
        className="massive-text text-[18vw] leading-none"
      />
    </section>

    {/* Asymmetric bento grid */}
    <div className="grid gap-px bg-white/10 md:grid-cols-3">
      {SERVICES.map((service, i) => (
        <ServiceCell key={service.name} service={service} index={i} />
      ))}
    </div>
  </div>
)
