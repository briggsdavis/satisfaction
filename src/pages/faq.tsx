import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import { TextReveal } from "../components/text-reveal"

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

const FaqSection = ({
  sectionId,
  name,
  isLight,
  openFaq,
  onToggle,
}: {
  sectionId: Id<"faqSections">
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

export const Faq = () => {
  const sections = useQuery(api.contact.listFaqSections) ?? []
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const { hash } = useLocation()

  useEffect(() => {
    if (hash !== "#faq") return
    const timer = setTimeout(() => document.getElementById("faq")?.scrollIntoView(), 400)
    return () => clearTimeout(timer)
  }, [hash])

  const toggleFaq = (key: string) => setOpenFaq((current) => (current === key ? null : key))

  return (
    <section id="faq">
      <div className="grid grid-cols-1 border-b border-white/10 lg:grid-cols-[1fr_2fr]">
        <div className="border-b border-white/10 px-8 py-12 md:px-16 lg:border-r lg:border-b-0 lg:py-16">
          <span className="mb-4 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
            Frequently Asked
          </span>
          <TextReveal
            text="FAQ"
            className="massive-text text-4xl leading-none md:text-6xl lg:text-8xl"
          />
        </div>
        <div className="hidden lg:block" />
      </div>

      {sections.map((section, index) => (
        <FaqSection
          key={section._id}
          sectionId={section._id}
          name={section.name}
          isLight={index % 2 === 0}
          openFaq={openFaq}
          onToggle={toggleFaq}
        />
      ))}
    </section>
  )
}
