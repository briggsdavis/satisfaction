import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import { ease } from "../../lib/motion"
import { Eyebrow } from "../../ui/page"
import { TextReveal } from "../../ui/text-reveal"

const tone = {
  light: {
    section: "border-black/10 bg-white",
    rule: "border-black/10",
    name: "text-black/40",
    item: "border-black/15",
    q: "text-black/80 group-hover:text-black",
    plus: "text-black/40",
    a: "text-black/55",
  },
  dark: {
    section: "border-white/10 bg-black",
    rule: "border-white/10",
    name: "text-white/30",
    item: "border-white/10",
    q: "text-white/70 group-hover:text-white",
    plus: "text-white/30",
    a: "text-white/50",
  },
}

export const Faq = () => {
  const sections = useQuery(api.faq.list) ?? []
  const [open, setOpen] = useState<Id<"faqItems"> | null>(null)
  const ref = useRef<HTMLElement>(null)
  const { hash } = useLocation()

  // Sticky sections above measure themselves after mount; re-aim once they settle.
  useEffect(() => {
    if (hash !== "#faq") return
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => ref.current?.scrollIntoView()),
    )
    return () => cancelAnimationFrame(frame)
  }, [hash])

  return (
    <section id="faq" ref={ref}>
      <div className="grid grid-cols-1 border-b border-white/10 lg:grid-cols-[1fr_2fr]">
        <div className="border-b border-white/10 px-8 py-12 md:px-16 lg:border-r lg:border-b-0 lg:py-16">
          <Eyebrow className="mb-4">Frequently Asked</Eyebrow>
          <TextReveal
            text="FAQ"
            className="massive-text text-4xl leading-none md:text-6xl lg:text-8xl"
          />
        </div>
      </div>

      {sections.map((section, index) => {
        const t = tone[index % 2 ? "dark" : "light"]
        return (
          <motion.div
            key={section._id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className={`grid grid-cols-1 border-b lg:grid-cols-[1fr_2fr] ${t.section}`}
          >
            <div className={`border-b px-8 py-10 md:px-16 lg:border-r lg:border-b-0 ${t.rule}`}>
              <span className={`text-xs font-bold tracking-[0.35em] uppercase ${t.name}`}>
                {section.name}
              </span>
            </div>
            <div className="px-8 py-10 md:px-16">
              {section.items.map((item) => {
                const isOpen = open === item._id
                return (
                  <div key={item._id} className={`border-b ${t.item}`}>
                    <button
                      onClick={() => setOpen(isOpen ? null : item._id)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between py-5 text-left"
                    >
                      <span
                        className={`pr-8 text-sm font-bold tracking-wide transition-colors ${t.q}`}
                      >
                        {item.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease }}
                        className={`shrink-0 text-xl font-thin ${t.plus}`}
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
                          transition={{ duration: 0.45, ease }}
                          className="overflow-hidden"
                        >
                          <p className={`pb-5 text-sm leading-relaxed whitespace-pre-line ${t.a}`}>
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}
