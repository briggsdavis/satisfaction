import { ChevronDown, Mail, MapPin, MessageSquare, Phone } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { DeBlurText } from "../components/de-blur-text"

const faqs = [
  {
    q: "What is your typical project timeline?",
    a: "Most projects range from 4 to 12 weeks depending on complexity and scope.",
  },
  {
    q: "Do you work internationally?",
    a: "Yes, we have worked with clients across the United States and internationally.",
  },
  {
    q: "What are your primary services?",
    a: "We specialize in videography, photography, and graphic design.",
  },
  {
    q: "How do you handle project budgets?",
    a: "We provide transparent, milestone-based pricing tailored to each project's unique requirements.",
  },
  {
    q: "Can we meet in person?",
    a: "Meetings are by appointment only. Please contact us to schedule a time.",
  },
  {
    q: "Do you offer long-term maintenance?",
    a: "Yes, we provide ongoing support and updates for all digital installations and brand systems.",
  },
  {
    q: "What sets your work apart?",
    a: "A unique combination of military discipline, entrepreneurial drive, and creative vision rooted in real brand strategy.",
  },
  {
    q: "How do I start a project?",
    a: "Reach out via email or phone and we'll get back to you within 48 hours.",
  },
  {
    q: "Do you provide raw files?",
    a: "Raw files can be provided upon request as part of specific licensing agreements.",
  },
  {
    q: "What equipment do you use?",
    a: "We use industry-standard cinema cameras and high-end photography gear.",
  },
]

export const Contact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen px-8 pt-40 pb-32">
      <div className="mb-32">
        <DeBlurText className="text-[12vw] leading-none">Contact</DeBlurText>
      </div>

      <div className="mb-48">
        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-4">
            <Mail className="text-white/60 h-6 w-6" />
            <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              Email
            </h4>
            <a
              href="mailto:devon@devoncolebank.com"
              className="hover:text-white/60 block text-2xl font-medium transition-colors"
            >
              devon@devoncolebank.com
            </a>
          </div>
          <div className="space-y-4">
            <Phone className="text-white/60 h-6 w-6" />
            <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              Phone
            </h4>
            <a
              href="tel:+14125550123"
              className="hover:text-white/60 block text-2xl font-medium transition-colors"
            >
              +1 (412) 555-0123
            </a>
          </div>
          <div className="space-y-4">
            <MapPin className="text-white/60 h-6 w-6" />
            <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              Location
            </h4>
            <p className="text-2xl font-medium">Pittsburgh, Pennsylvania</p>
          </div>
          <div className="space-y-4">
            <MessageSquare className="text-white/60 h-6 w-6" />
            <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              Social
            </h4>
            <a
              href="https://www.instagram.com/devoncolebank/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 block text-2xl font-medium transition-colors"
            >
              @devoncolebank
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 gap-24 border-t border-current/10 pt-24 lg:grid-cols-3">
        <div>
          <h2 className="massive-text text-5xl leading-none md:text-8xl">
            FAQ
          </h2>
        </div>
        <div className="space-y-0 lg:col-span-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-current/10 last:border-b-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="group flex w-full items-center justify-between py-8 text-left"
              >
                <span className="group-hover:text-white/60 text-xl font-bold tracking-tight uppercase transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-500 ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-8 text-lg leading-relaxed text-white/60">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
