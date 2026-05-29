import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigationType, useSearchParams } from "react-router"
import { api } from "../../convex/_generated/api"
import { BrandingModal } from "../components/branding-modal"
import { TextReveal } from "../components/text-reveal"

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
    <label
      htmlFor={name}
      className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase"
    >
      {label}
    </label>
    <input
      id={name}
      aria-label={label}
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
    <label
      htmlFor={name}
      className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase"
    >
      {label}
    </label>
    <textarea
      id={name}
      aria-label={label}
      name={name}
      rows={4}
      className="w-full resize-none border-b border-white/20 bg-transparent pb-2 text-base text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"
      placeholder={placeholder}
    />
  </div>
)

// ─── Contact sidebar ─────────────────────────────────────────────────────────
const ContactSidebar = () => {
  const info = useQuery(api.contact.getInfo)
  const i = info ?? ({} as NonNullable<typeof info>)
  const items: { label: string; value?: string; href?: string }[] = [
    {
      label: "Email",
      value: i.email,
      href: i.email ? `mailto:${i.email}` : undefined,
    },
    {
      label: "Phone",
      value: i.phone,
      href: i.phone ? `tel:${i.phone.replace(/\s+/g, "")}` : undefined,
    },
    { label: "Location", value: i.location },
    {
      label: "Instagram",
      value: i.instagram ? `@${i.instagram}` : undefined,
      href: i.instagram ? `https://www.instagram.com/${i.instagram}/` : undefined,
    },
  ]
  return (
    <div className="space-y-10">
      {items.map((item) =>
        item.value ? (
          <div key={item.label}>
            <p className="mb-1 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
              {item.label}
            </p>
            {item.href ? (
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {item.value}
              </a>
            ) : (
              <p className="text-sm text-white/70">{item.value}</p>
            )}
          </div>
        ) : null,
      )}
    </div>
  )
}

// ─── Service dropdown ─────────────────────────────────────────────────────────
const ServiceSelect = () => {
  const services = useQuery(api.portfolio.listCategories) ?? []
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [isOpen])

  const selectedOption = services.find((s) => s.name === selected)

  return (
    <div className="border-b border-white/10 py-5">
      <p className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
        Service
      </p>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex w-full items-center justify-between border-b border-white/20 pb-2 text-base transition-colors outline-none focus:border-white/50"
        >
          {selectedOption ? (
            <span className="flex items-center gap-2.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: selectedOption.color }}
              />
              <span className="text-white">{selectedOption.name}</span>
            </span>
          ) : (
            <span className="text-white/20">Select a service…</span>
          )}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0 text-xs leading-none text-white/30"
          >
            ▾
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{ backgroundColor: "#111111" }}
              className="absolute top-full left-0 z-50 mt-1 w-full border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
            >
              {services.map((option) => (
                <button
                  key={option._id}
                  type="button"
                  onClick={() => {
                    setSelected(option.name)
                    setIsOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  {option.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <input type="hidden" name="service" value={selected ?? ""} />
      </div>
    </div>
  )
}

// ─── FAQ accordion item ───────────────────────────────────────────────────────
const FaqItem = ({
  item,
  isOpen,
  onToggle,
  isLight = false,
}: {
  item: { q: string; a: string }
  isOpen: boolean
  onToggle: () => void
  isLight?: boolean
}) => (
  <div className={`border-b ${isLight ? "border-black/15" : "border-white/10"}`}>
    <button
      onClick={onToggle}
      className="group flex w-full items-center justify-between py-5 text-left"
    >
      <span
        className={`pr-8 text-sm font-bold tracking-wide transition-colors ${
          isLight ? "text-black/80 group-hover:text-black" : "text-white/70 group-hover:text-white"
        }`}
      >
        {item.q}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`shrink-0 text-xl font-thin ${isLight ? "text-black/40" : "text-white/30"}`}
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
          <p
            className={`pb-5 text-sm leading-relaxed font-normal ${
              isLight ? "text-black/55" : "text-white/50"
            }`}
          >
            {item.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

// ─── FAQ sections (Convex-backed) ─────────────────────────────────────────────
const FaqSectionBlock = ({
  sectionId,
  name,
  isLight,
  openFaq,
  onToggle,
}: {
  sectionId: import("../../convex/_generated/dataModel").Id<"faqSections">
  name: string
  isLight: boolean
  openFaq: string | null
  onToggle: (key: string) => void
}) => {
  const items = useQuery(api.contact.listFaqItems, { sectionId }) ?? []
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`grid grid-cols-1 border-b lg:grid-cols-[1fr_2fr] ${
        isLight ? "border-black/10 bg-white" : "border-white/10 bg-black"
      }`}
    >
      <div
        className={`border-b px-8 py-10 md:px-16 lg:border-r lg:border-b-0 ${
          isLight ? "border-black/10" : "border-white/10"
        }`}
      >
        <span
          className={`text-xs font-bold tracking-[0.35em] uppercase ${
            isLight ? "text-black/40" : "text-white/30"
          }`}
        >
          {name}
        </span>
      </div>
      <div className="px-8 py-10 md:px-16">
        {items
          .toSorted((a, b) => a.order - b.order)
          .map((item) => {
            const key = `${sectionId}-${item._id}`
            return (
              <FaqItem
                key={item._id}
                item={{ q: item.question, a: item.answer }}
                isOpen={openFaq === key}
                onToggle={() => onToggle(key)}
                isLight={isLight}
              />
            )
          })}
      </div>
    </motion.div>
  )
}

const FaqSections = ({
  openFaq,
  onToggle,
}: {
  openFaq: string | null
  onToggle: (key: string) => void
}) => {
  const sections = useQuery(api.contact.listFaqSections) ?? []
  return (
    <>
      {sections.map((s, i) => (
        <FaqSectionBlock
          key={s._id}
          sectionId={s._id}
          name={s.name}
          isLight={i % 2 === 0}
          openFaq={openFaq}
          onToggle={onToggle}
        />
      ))}
    </>
  )
}

// ─── Fit title ───────────────────────────────────────────────────────────────
const FitTitle = ({
  text,
  slideFrom = "bottom",
  delay = 0,
}: {
  text: string
  slideFrom?: "bottom" | "left"
  delay?: number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState<number | null>(null)

  useEffect(() => {
    const PROBE = 200
    const measure = () => {
      const container = containerRef.current
      if (!container) return
      const probe = document.createElement("span")
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-size:${PROBE}px`
      probe.className = "massive-text"
      probe.textContent = text
      document.body.appendChild(probe)
      const textWidth = probe.offsetWidth
      document.body.removeChild(probe)
      const containerWidth = container.clientWidth
      if (textWidth > 0 && containerWidth > 0) {
        setFontSize((containerWidth / textWidth) * PROBE)
      }
    }
    const fit = () => void document.fonts.ready.then(measure)
    fit()
    const ro = new ResizeObserver(fit)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [text])

  return (
    <div ref={containerRef} style={fontSize ? { fontSize } : undefined}>
      <TextReveal
        text={text}
        className="massive-text justify-center leading-none"
        immediate
        slideFrom={slideFrom}
        delay={delay}
      />
    </div>
  )
}

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
  const [brandingOpen, setBrandingOpen] = useState(false)
  const { hash } = useLocation()
  const [searchParams] = useSearchParams()
  const navType = useNavigationType()
  const titleDelay = navType === "PUSH" ? 0.75 : 0

  // Auto-open branding modal when ?branding=1 is in the URL
  useEffect(() => {
    if (searchParams.get("branding") === "1") {
      const timer = setTimeout(() => setBrandingOpen(true), 800)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  useEffect(() => {
    if (hash === "#faq") {
      const el = document.getElementById("faq")
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" })
        }, 400)
        return () => clearTimeout(timer)
      }
    }
  }, [hash])

  const toggleFaq = (key: string) => setOpenFaq((prev) => (prev === key ? null : key))

  return (
    <div className="pt-32">
      {/* ── Centered header ───────────────────────────────────────────────── */}
      <motion.section
        className="border-b border-white/10 px-8 pb-16 text-center md:px-16"
        initial={{ opacity: 0, filter: "blur(20px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <FitTitle text="CONTACT" slideFrom="left" delay={titleDelay} />
      </motion.section>

      {/* ── Form + contact details ────────────────────────────────────────── */}
      <section className="grid grid-cols-1 border-b border-white/10 lg:grid-cols-[1fr_2fr]">
        {/* Contact details sidebar */}
        <BlurIn
          delay={0.1}
          className="border-b border-white/10 px-8 py-12 md:px-16 lg:border-r lg:border-b-0 lg:py-16"
        >
          <p className="mb-10 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
            Get In Touch
          </p>

          <ContactSidebar />
        </BlurIn>

        {/* Form */}
        <div className="px-8 py-12 md:px-16 lg:py-16">
          <form onSubmit={(e) => e.preventDefault()} className="border-t border-white/10">
            <BlurIn delay={0.1}>
              <TextField label="Name" name="name" placeholder="" />
            </BlurIn>
            <BlurIn delay={0.18}>
              <TextField label="Company / Brand" name="company" placeholder="" />
            </BlurIn>
            <BlurIn delay={0.26}>
              <TextField label="Email" name="email" type="email" placeholder="" />
            </BlurIn>
            <BlurIn delay={0.34} className="relative z-50">
              <ServiceSelect />
            </BlurIn>
            <BlurIn delay={0.42}>
              <TextareaField label="Tell me about your project" name="message" placeholder="" />
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

      {/* ── Branding Brief CTA ───────────────────────────────────────────── */}
      {/*
      <section className="border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
          <BlurIn
            delay={0.1}
            className="border-b border-white/10 px-8 py-12 md:px-16 lg:border-r lg:border-b-0 lg:py-16"
          >
            <p className="mb-4 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
              Brand Identity
            </p>
            <h2 className="text-2xl leading-tight font-bold tracking-tight uppercase md:text-3xl">
              Need a logo or brand?
            </h2>
          </BlurIn>
          <BlurIn
            delay={0.18}
            className="flex flex-col justify-center gap-6 px-8 py-12 md:px-16 lg:py-16"
          >
            <p className="max-w-lg text-base leading-relaxed text-white/60">
              Skip the general inquiry — fill out our focused branding brief and
              we'll come back with a tailored direction for your identity.
            </p>
            <div>
              <button
                onClick={() => setBrandingOpen(true)}
                className="btn-industrial"
              >
                Start a Branding Brief →
              </button>
            </div>
          </BlurIn>
        </div>
      </section>
      */}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq">
        {/* FAQ header sidebar */}
        <div className="grid grid-cols-1 border-b border-white/10 lg:grid-cols-[1fr_2fr]">
          <BlurIn
            delay={0.1}
            className="border-b border-white/10 px-8 py-12 md:px-16 lg:border-r lg:border-b-0 lg:py-16"
          >
            <span className="mb-4 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
              Frequently Asked
            </span>
            <TextReveal
              text="FAQ"
              className="massive-text text-4xl leading-none md:text-6xl lg:text-8xl"
            />
          </BlurIn>
          {/* spacer — keeps the sidebar grid balanced */}
          <div className="hidden lg:block" />
        </div>

        <FaqSections openFaq={openFaq} onToggle={toggleFaq} />
      </section>

      <BrandingModal open={brandingOpen} onClose={() => setBrandingOpen(false)} />
    </div>
  )
}
