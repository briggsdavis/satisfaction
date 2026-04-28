import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

// ─── Field helpers ────────────────────────────────────────────────────────────
const Field = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="border-b border-white/10 py-5">
    <label className="mb-3 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
      {label}
    </label>
    {children}
  </div>
)

const inputCls =
  "w-full border-b border-white/20 bg-transparent pb-2 text-sm text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"

const selectCls =
  "w-full border-b border-white/20 bg-black pb-2 text-sm text-white transition-colors outline-none focus:border-white/50 appearance-none cursor-pointer"

const USAGE_OPTIONS = [
  "Social Media",
  "Website",
  "Print / Packaging",
  "Signage",
  "Apparel / Merch",
]

const STYLE_OPTIONS = [
  "Minimal",
  "Bold",
  "Classic",
  "Playful",
  "Luxury",
  "Industrial",
]

// ─── Branding Modal ───────────────────────────────────────────────────────────
export const BrandingModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const [usage, setUsage] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const toggleUsage = (opt: string) =>
    setUsage((prev) =>
      prev.includes(opt) ? prev.filter((u) => u !== opt) : [...prev, opt],
    )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => setSubmitted(false), 400)
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-end justify-center md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden bg-black md:max-h-[85vh]"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-8 py-6">
              <div>
                <p className="mb-1 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
                  Brand Identity
                </p>
                <h2 className="text-xl font-bold tracking-tight uppercase md:text-2xl">
                  Branding Brief
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/50 transition-colors hover:border-white/60 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div
              ref={bodyRef}
              className="flex-1 overflow-y-auto px-8 pb-8"
              style={{ scrollbarWidth: "none" }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <span className="mb-4 text-4xl">✦</span>
                    <h3 className="mb-3 text-2xl font-bold uppercase">
                      Brief received
                    </h3>
                    <p className="max-w-sm text-sm leading-relaxed text-white/50">
                      We'll review your brand brief and reach out within 48 hours
                      to kick things off.
                    </p>
                    <button
                      onClick={handleClose}
                      className="btn-industrial mt-10"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                  >
                    {/* Q1 */}
                    <Field label="01 — Business / Brand Name">
                      <input
                        name="brandName"
                        required
                        className={inputCls}
                        placeholder="e.g. Yuzu Kitchen"
                      />
                    </Field>

                    {/* Q2 */}
                    <Field label="02 — Type of Business">
                      <select name="industry" className={selectCls}>
                        <option value="">Select…</option>
                        <option>Restaurant / Bar</option>
                        <option>Retail</option>
                        <option>Beauty &amp; Wellness</option>
                        <option>Professional Services</option>
                        <option>Food &amp; Beverage Brand</option>
                        <option>Events &amp; Entertainment</option>
                        <option>Fitness &amp; Health</option>
                        <option>Other</option>
                      </select>
                    </Field>

                    {/* Q3 */}
                    <Field label="03 — Describe Your Brand in 3 Words">
                      <input
                        name="words"
                        required
                        className={inputCls}
                        placeholder="e.g. Bold, Modern, Approachable"
                      />
                    </Field>

                    {/* Q4 */}
                    <Field label="04 — Who Is Your Target Audience?">
                      <input
                        name="audience"
                        className={inputCls}
                        placeholder="Age range, interests, lifestyle…"
                      />
                    </Field>

                    {/* Q5 — Style direction */}
                    <Field label="05 — Visual Style Direction">
                      <div className="mt-1 flex flex-wrap gap-2">
                        {STYLE_OPTIONS.map((opt) => (
                          <label
                            key={opt}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <input
                              type="radio"
                              name="style"
                              value={opt}
                              className="accent-white"
                            />
                            <span className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-white">
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </Field>

                    {/* Q6 */}
                    <Field label="06 — Color Direction">
                      <input
                        name="colors"
                        className={inputCls}
                        placeholder="Colors you love or want to avoid…"
                      />
                    </Field>

                    {/* Q7 — Usage */}
                    <Field label="07 — Where Will the Logo Be Used?">
                      <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
                        {USAGE_OPTIONS.map((opt) => (
                          <label
                            key={opt}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={usage.includes(opt)}
                              onChange={() => toggleUsage(opt)}
                              className="accent-white"
                            />
                            <span className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-white">
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </Field>

                    {/* Q8 */}
                    <Field label="08 — Brands You Admire">
                      <input
                        name="inspiration"
                        className={inputCls}
                        placeholder="Any brands whose look/feel you love…"
                      />
                    </Field>

                    {/* Q9 */}
                    <Field label="09 — Timeline">
                      <select name="timeline" className={selectCls}>
                        <option value="">Select…</option>
                        <option>ASAP (within 1 week)</option>
                        <option>2 weeks</option>
                        <option>1 month</option>
                        <option>Flexible</option>
                      </select>
                    </Field>

                    {/* Q10 */}
                    <Field label="10 — Anything Else We Should Know?">
                      <textarea
                        name="notes"
                        rows={3}
                        className={`${inputCls} resize-none`}
                        placeholder="Special requirements, existing assets, budget range…"
                      />
                    </Field>

                    <div className="pt-6">
                      <button type="submit" className="btn-industrial">
                        Submit Brief →
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
