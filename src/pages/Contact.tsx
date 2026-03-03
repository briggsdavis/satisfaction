import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, MessageSquare, ChevronDown } from 'lucide-react';
import { DeBlurText } from '../components/DeBlurText';
import { useDynamicText } from '../components/DynamicBackground';
import { scrollToSection } from '../lib/scrollToSection';

const faqs = [
  { q: "What is your typical project timeline?", a: "Most projects range from 4 to 12 weeks depending on complexity and scope." },
  { q: "Do you work internationally?", a: "Yes, we have worked with clients across Europe, North America, and Asia." },
  { q: "What are your primary services?", a: "We specialize in industrial videography, photography, and spatial graphic design." },
  { q: "How do you handle project budgets?", a: "We provide transparent, milestone-based pricing tailored to each project's unique requirements." },
  { q: "Can we visit your studio in Berlin?", a: "Visits are by appointment only. Please contact us to schedule a meeting." },
  { q: "Do you offer long-term maintenance?", a: "Yes, we provide ongoing support and updates for all digital installations and brand systems." },
  { q: "What is 'Industrial Brutalism'?", a: "It's a design philosophy that celebrates raw materials, structural honesty, and high-impact spatial logic." },
  { q: "How do I start a project?", a: "Simply fill out the inquiry form below, and we'll get back to you within 48 hours." },
  { q: "Do you provide raw files?", a: "Raw files can be provided upon request as part of specific licensing agreements." },
  { q: "What equipment do you use?", a: "We use industry-standard cinema cameras and high-end industrial photography gear." },
];

export const Contact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { textColor, textColorMuted } = useDynamicText();

  return (
    <motion.div className="pt-40 px-8 pb-32 min-h-screen" style={{ color: textColor }}>
      <div className="mb-32">
        <DeBlurText className="text-[12vw] leading-none">Contact</DeBlurText>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-48">
        {/* Contact Info */}
        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Mail className="text-neon-pink w-6 h-6" />
              <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40">Email</h4>
              <p className="text-2xl font-medium">hello@colebank.design</p>
            </div>
            <div className="space-y-4">
              <Phone className="text-neon-pink w-6 h-6" />
              <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40">Phone</h4>
              <p className="text-2xl font-medium">+49 30 1234 5678</p>
            </div>
            <div className="space-y-4">
              <MapPin className="text-neon-pink w-6 h-6" />
              <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40">Address</h4>
              <p className="text-2xl font-medium">Torstraße 123, 10119 Berlin, Germany</p>
            </div>
            <div className="space-y-4">
              <MessageSquare className="text-neon-pink w-6 h-6" />
              <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40">WhatsApp</h4>
              <p className="text-2xl font-medium">+49 176 1234 5678</p>
            </div>
          </div>

          <button
            onClick={() => scrollToSection('contact-faq')}
            className="btn-industrial flex items-center gap-3"
          >
            Frequently Asked Questions
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Inquiry Form */}
        <div>
          <h3 className="text-4xl massive-text mb-12">Inquiry Form</h3>
          <form className="space-y-8">
            {[
              { label: 'Name', type: 'text' },
              { label: 'Company', type: 'text' },
              { label: 'Email', type: 'email' },
              { label: 'Project Type', type: 'text' },
              { label: 'Budget Range', type: 'text' },
              { label: 'Timeline', type: 'text' },
            ].map((field) => (
              <div key={field.label} className="relative group">
                <input
                  type={field.type}
                  placeholder={field.label}
                  className="w-full bg-transparent border-b border-current/20 py-4 focus:outline-none focus:border-neon-pink transition-colors placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest placeholder:font-bold"
                  style={{ color: 'inherit' }}
                />
              </div>
            ))}
            <div className="relative group">
              <textarea
                placeholder="Further Messages"
                rows={4}
                className="w-full bg-transparent border-b border-current/20 py-4 focus:outline-none focus:border-neon-pink transition-colors placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest placeholder:font-bold resize-none"
                style={{ color: 'inherit' }}
              />
            </div>
            <button type="submit" className="btn-industrial w-full mt-8">
              Submit Form
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="contact-faq" className="grid grid-cols-1 lg:grid-cols-3 gap-24 border-t border-current/10 pt-24">
        <div>
          <h2 className="text-8xl massive-text leading-none">FAQ</h2>
        </div>
        <div className="lg:col-span-2 space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-current/10 last:border-b-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full py-8 flex justify-between items-center group text-left"
              >
                <span className="text-xl font-bold uppercase tracking-tight group-hover:text-neon-pink transition-colors">
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <motion.p
                      style={{ color: textColorMuted }}
                      className="pb-8 text-lg leading-relaxed max-w-2xl"
                    >
                      {faq.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
