import { AnimatePresence, motion } from "motion/react"
import React, { useState } from "react"
import { TextReveal } from "../components/text-reveal"

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ_SECTIONS = [
  {
    section: "What Am I Actually Getting?",
    items: [
      {
        q: "What exactly is included in a monthly package?",
        a: "You're getting more than content - you're getting a fully planned and executed marketing system. That includes strategy, campaign planning, production, editing, and rollout. Every piece is created with a purpose and built to work together.",
      },
      {
        q: "How many photos/videos do we get?",
        a: "We scope output based on your goals, but typically you're receiving high-volume, platform-ready content - short-form videos, photos, and campaign assets designed to last the entire month (and beyond).",
      },
      {
        q: "Do we own the content?",
        a: "Yes - you have full usage rights across your marketing channels: social, ads, website, email, etc.",
      },
    ],
  },
  {
    section: "Pricing + Value",
    items: [
      {
        q: "Why does this cost what it costs?",
        a: "Because you're not hiring a shooter - you're hiring a full creative team. Strategy, production, editing, and campaign execution all live under one roof, which replaces multiple vendors and delivers better results.",
      },
      {
        q: "Can we just do one shoot instead of a retainer?",
        a: "You can - but one-off shoots create content. Retainers build momentum, consistency, and campaigns that actually drive results over time.",
      },
      {
        q: "Can we scale up or down?",
        a: "Yes. We can adjust production volume and campaign intensity depending on your season, goals, or budget.",
      },
    ],
  },
  {
    section: "Strategy + Results",
    items: [
      {
        q: "How will this bring in customers?",
        a: "We don't just make content - we build campaigns designed to drive behavior. That means aligning visuals, messaging, and timing around real business goals like reservations, events, and menu pushes.",
      },
      {
        q: "How do we know what's working?",
        a: "We track performance monthly - what's driving engagement, clicks, and conversions - and adjust strategy accordingly.",
      },
    ],
  },
  {
    section: "Production",
    items: [
      {
        q: "How do shoot days work?",
        a: "We come in with a full plan - shot lists, concepts, and direction - so everything is efficient, organized, and intentional.",
      },
      {
        q: "Do we need to prepare anything?",
        a: "We'll guide you on exactly what's needed - menu items, staff availability, setup - but we handle the heavy lifting.",
      },
      {
        q: "Will you direct staff or talent?",
        a: "Yes. We fully direct talent, staff, and scenes so everything feels natural but elevated.",
      },
    ],
  },
  {
    section: "Social Media Management",
    items: [
      {
        q: "Do you post for us or just give content?",
        a: "We can do both. Many clients have us fully manage posting, scheduling, and rollout.",
      },
      {
        q: "Do you write captions?",
        a: "Yes - captions are written to match your brand voice and drive engagement.",
      },
      {
        q: "Do you respond to comments/DMs?",
        a: "We offer community management as part of full-service social.",
      },
    ],
  },
  {
    section: "Campaign + Big Picture",
    items: [
      {
        q: "Are you just making content or building campaigns?",
        a: "We build campaigns. Every piece of content is part of a bigger strategy designed to drive results - not just fill your feed.",
      },
      {
        q: "How do you approach launches or events?",
        a: "We create full rollout strategies - teasers, launch content, paid support, and post-event recaps - so you get maximum visibility and impact.",
      },
    ],
  },
  {
    section: "Creative Direction",
    items: [
      {
        q: "Will you tell us what to shoot?",
        a: "Yes - that's our job. We lead creative direction so you're never guessing.",
      },
      {
        q: "What if we don't know what content we need?",
        a: "Most clients don't - that's why we exist. We identify the opportunities and build the plan for you.",
      },
      {
        q: "Can you match our brand?",
        a: "We don't just match it - we elevate it while keeping it authentic.",
      },
    ],
  },
  {
    section: "Logistics + Workflow",
    items: [
      {
        q: "How long does it take to receive content?",
        a: "Turnaround is typically within 1-2 weeks depending on scope.",
      },
      {
        q: "Can we request revisions?",
        a: "Yes - we include revision rounds to make sure everything aligns.",
      },
    ],
  },
  {
    section: "The Real Questions",
    items: [
      {
        q: "Will this actually make us stand out?",
        a: "Yes - because we're not just creating content, we're building a cohesive brand presence that's designed to outperform your competition.",
      },
      {
        q: "Is this going to be a headache?",
        a: "No - we're built to take this off your plate. We handle planning, production, and execution so your team can stay focused on operations.",
      },
      {
        q: "Do you actually understand restaurants?",
        a: "Yes - this is our niche. Everything we create is built around what drives real traffic, orders, and guest experience.",
      },
    ],
  },
]

// ─── Form field components ────────────────────────────────────────────────────
const TextField = ({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string
  name: string
  type?: string
  placeholder: string
}) => (
  <div className="border-b border-white/10 py-5">
    <label className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
      {label}
    </label>
    <input
      type={type}
      name={name}
      className="w-full border-b border-white/20 bg-transparent pb-2 text-base text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"
      placeholder={placeholder}
    />
  </div>
)

const TextareaField = ({
  label,
  name,
  placeholder,
}: {
  label: string
  name: string
  placeholder: string
}) => (
  <div className="border-b border-white/10 py-5">
    <label className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
      {label}
    </label>
    <textarea
      name={name}
      rows={4}
      className="w-full resize-none border-b border-white/20 bg-transparent pb-2 text-base text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"
      placeholder={placeholder}
    />
  </div>
)

// ─── FAQ accordion item ───────────────────────────────────────────────────────
const FaqItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string }
  isOpen: boolean
  onToggle: () => void
}) => (
  <div className="border-b border-white/10">
    <button
      onClick={onToggle}
      className="group flex w-full items-center justify-between py-5 text-left"
    >
      <span className="pr-8 text-sm font-medium tracking-wide text-white/70 transition-colors group-hover:text-white">
        {item.q}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="shrink-0 text-xl font-thin text-white/30"
      >
        +
      </motion.span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="pb-5 text-sm leading-relaxed text-white/50">{item.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

// ─── Blur-in wrapper ──────────────────────────────────────────────────────────
const blurInVariants = {
  hidden: { opacity: 0, filter: "blur(16px)", y: 20 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
}

const BlurIn = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => (
  <motion.div
    variants={blurInVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-150px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
)

// ─── Contact page ─────────────────────────────────────────────────────────────
export const Contact = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const toggleFaq = (key: string) =>
    setOpenFaq((prev) => (prev === key ? null : key))

  return (
    <div className="pt-32">
      {/* ── Big centered header ───────────────────────────────────────────── */}
      <motion.section
        className="border-b border-white/10 px-8 pb-16 md:px-16"
        initial={{ opacity: 0, filter: "blur(20px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <TextReveal
          text="CONTACT"
          className="massive-text text-7xl leading-none md:text-10xl lg:text-12xl"
          immediate
        />
      </motion.section>

      {/* ── Form + contact details ────────────────────────────────────────── */}
      <section className="grid grid-cols-1 border-b border-white/10 lg:grid-cols-[1fr_2fr]">
        {/* Contact details sidebar */}
        <BlurIn
          delay={0.1}
          className="border-b border-white/10 px-8 py-12 lg:border-r lg:border-b-0 md:px-16 lg:py-16"
        >
          <p className="mb-10 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
            Get In Touch
          </p>

          <div className="space-y-10">
            <div>
              <p className="mb-1 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
                Email
              </p>
              <a
                href="mailto:info@socialsatisfaction.com"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                info@socialsatisfaction.com
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
                Phone
              </p>
              <a
                href="tel:+14125550123"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                +1 (412) 555-0123
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
                Location
              </p>
              <p className="text-sm text-white/70">Marketing Agency</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
                Instagram
              </p>
              <a
                href="https://www.instagram.com/socialsatisfaction/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                @socialsatisfaction
              </a>
            </div>
          </div>
        </BlurIn>

        {/* Form */}
        <div className="px-8 py-12 md:px-16 lg:py-16">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="border-t border-white/10"
          >
            <BlurIn delay={0.1}>
              <TextField label="Name" name="name" placeholder="" />
            </BlurIn>
            <BlurIn delay={0.18}>
              <TextField
                label="Company / Brand"
                name="company"
                placeholder=""
              />
            </BlurIn>
            <BlurIn delay={0.26}>
              <TextField
                label="Email"
                name="email"
                type="email"
                placeholder=""
              />
            </BlurIn>
            <BlurIn delay={0.34}>
              <TextField label="Service" name="service" placeholder="" />
            </BlurIn>
            <BlurIn delay={0.42}>
              <TextareaField
                label="Tell me about your project"
                name="message"
                placeholder=""
              />
            </BlurIn>
            <BlurIn delay={0.5}>
              <div className="flex items-center justify-between pt-8">
                <button type="submit" className="btn-industrial">
                  Send Message →
                </button>
              </div>
            </BlurIn>
          </form>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="grid grid-cols-1 border-b border-white/10 lg:grid-cols-[1fr_2fr]"
      >
        {/* FAQ title sidebar */}
        <BlurIn
          delay={0.1}
          className="border-b border-white/10 px-8 py-12 lg:border-r lg:border-b-0 md:px-16 lg:py-16"
        >
          <span className="mb-4 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
            Frequently Asked
          </span>
          <TextReveal
            text="FAQ"
            className="massive-text text-4xl leading-none md:text-6xl lg:text-8xl"
          />
        </BlurIn>

        {/* FAQ questions */}
        <div className="px-8 py-12 md:px-16 lg:py-16">
          <div className="space-y-14">
            {FAQ_SECTIONS.map((section) => (
              <BlurIn key={section.section}>
                <p className="mb-4 border-t border-white/10 pt-6 text-xs font-bold tracking-[0.35em] text-white/30 uppercase">
                  {section.section}
                </p>
                {section.items.map((item, j) => (
                  <FaqItem
                    key={j}
                    item={item}
                    isOpen={openFaq === `${section.section}-${j}`}
                    onToggle={() => toggleFaq(`${section.section}-${j}`)}
                  />
                ))}
              </BlurIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
