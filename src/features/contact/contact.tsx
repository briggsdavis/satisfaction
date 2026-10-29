import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { useSearchParams } from "react-router"
import { api } from "../../../convex/_generated/api"
import { preload } from "../../lib/convex"
import { errorMessage } from "../../lib/hooks"
import { ease } from "../../lib/motion"
import { PageHeader } from "../../ui/page"
import { BrandingModal } from "./branding-modal"
import { Honeypot, useLeadForm } from "./lead-form"

export const loader = async () => {
  await preload(api.services.list)
  return null
}

const labelCls = "mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase"
const inputCls =
  "w-full border-b border-white/20 bg-transparent pb-2 text-base text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"

const Field = ({
  label,
  name,
  type = "text",
  multiline,
  required,
}: {
  label: string
  name: string
  type?: string
  multiline?: boolean
  required?: boolean
}) => {
  const id = useId()
  return (
    <div className="py-5">
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          required={required}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input id={id} name={name} type={type} required={required} className={inputCls} />
      )}
    </div>
  )
}

const ContactSidebar = () => {
  const contact = useQuery(api.site.get)?.contact
  if (!contact) return null
  const items = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}` },
    { label: "Location", value: contact.location },
    {
      label: "Instagram",
      value: contact.instagram && `@${contact.instagram}`,
      href: `https://www.instagram.com/${contact.instagram}/`,
    },
  ].filter((item) => item.value)

  return (
    <div className="space-y-10">
      {items.map(({ label, value, href }) => (
        <div key={label}>
          <p className="mb-1 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">{label}</p>
          {href ? (
            <a
              href={href}
              {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {value}
            </a>
          ) : (
            <p className="text-sm text-white/70">{value}</p>
          )}
        </div>
      ))}
    </div>
  )
}

const swatch = (color: string) => (
  <span className="h-2 w-2 shrink-0" style={{ backgroundColor: color }} />
)

const ServiceSelect = () => {
  const services = useQuery(api.services.list) ?? []
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const option = services.find((s) => s.name === selected)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="py-5">
      <p className={labelCls}>Service</p>
      <div ref={ref} className="relative">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between border-b border-white/20 pb-2 text-base outline-none focus:border-white/50"
        >
          {option ? (
            <span className="flex items-center gap-2.5">
              {swatch(option.color)}
              <span className="text-white">{option.name}</span>
            </span>
          ) : (
            <span className="text-white/20">Select a service…</span>
          )}
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-xs text-white/30">
            ▾
          </motion.span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 z-50 mt-1 w-full border border-white/20 bg-[#111] shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
              data-lenis-prevent
            >
              {services.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => {
                    setSelected(s.name)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {swatch(s.color)}
                  {s.name}
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

const BlurIn = ({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(16px)", y: 20 }}
    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
    viewport={{ once: true, margin: "-150px" }}
    transition={{ duration: 0.7, ease, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

const ContactForm = () => {
  const { onSubmit, state, error } = useLeadForm("contact")
  if (state === "sent")
    return (
      <div className="border-t border-white/10 py-16">
        <h2 className="mb-3 text-2xl font-bold uppercase">Message sent</h2>
        <p className="text-sm text-white/50">Thanks. We'll be in touch shortly.</p>
      </div>
    )
  return (
    <form onSubmit={onSubmit} className="relative border-t border-white/10">
      <Honeypot />
      {(
        [
          ["Name", "name", "text", true],
          ["Company / Brand", "company"],
          ["Email", "email", "email", true],
        ] as const
      ).map(([label, name, type, required], i) => (
        <BlurIn key={name} delay={0.1 + i * 0.08}>
          <Field label={label} name={name} type={type} required={required} />
        </BlurIn>
      ))}
      <BlurIn delay={0.34} className="relative z-50">
        <ServiceSelect />
      </BlurIn>
      <BlurIn delay={0.42}>
        <Field label="Tell me about your project" name="message" multiline required />
      </BlurIn>
      <BlurIn delay={0.5}>
        <div className="flex items-center gap-6 pt-8">
          <button
            type="submit"
            disabled={state === "sending"}
            className="btn-industrial disabled:opacity-50"
          >
            {state === "sending" ? "Sending…" : "Send Message →"}
          </button>
          {error != null && (
            <p role="alert" className="text-sm text-red-300">
              {errorMessage(error)}
            </p>
          )}
        </div>
      </BlurIn>
    </form>
  )
}

export const Component = () => {
  const [params, setParams] = useSearchParams()
  const branding = params.get("branding") === "1"
  const [modal, setModal] = useState(false)

  // ?branding=1 deep-links straight into the brief (after the wipe settles).
  useEffect(() => {
    if (!branding) return
    const timer = setTimeout(() => setModal(true), 800)
    return () => clearTimeout(timer)
  }, [branding])

  return (
    <div className="pt-32">
      <PageHeader title="CONTACT" />
      <section className="grid grid-cols-1 border-b border-white/10 lg:grid-cols-[1fr_2fr]">
        <BlurIn
          delay={0.1}
          className="border-b border-white/10 px-8 py-12 md:px-16 lg:border-r lg:border-b-0 lg:py-16"
        >
          <p className="mb-10 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
            Get In Touch
          </p>
          <ContactSidebar />
        </BlurIn>
        <div className="px-8 py-12 md:px-16 lg:py-16">
          <ContactForm />
        </div>
      </section>
      <BrandingModal
        open={modal}
        onClose={() => {
          setModal(false)
          if (branding) setParams({}, { replace: true })
        }}
      />
    </div>
  )
}
