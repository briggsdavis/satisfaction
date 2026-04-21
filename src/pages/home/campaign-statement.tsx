import { motion } from "motion/react"

const CAMPAIGN_WORDS = ["CAMPAIGNS", "BUILT", "TO", "PERFORM."]

export const CampaignStatement = () => (
  <section className="relative overflow-hidden border-t border-white/10 bg-black pb-8 md:pb-12">
    <motion.img
      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
      alt=""
      className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[17.6rem] w-[17.6rem] -translate-x-1/2 -translate-y-1/2 rounded-lg object-cover shadow-2xl md:h-[26.4rem] md:w-[26.4rem]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{ duration: 0.45, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
    />
    {CAMPAIGN_WORDS.map((word, i) => {
      const isRight = i % 2 === 1
      return (
        <motion.div
          key={word}
          className={`flex items-end px-8 md:px-16 ${isRight ? "justify-end" : "justify-start"}`}
          initial={{ opacity: 0, x: isRight ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{
            duration: 0.7,
            delay: i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span className="massive-text text-5xl leading-[0.88] select-none md:text-9xl lg:text-11xl">
            {word}
          </span>
        </motion.div>
      )
    })}

    {/* Bottom metadata row */}
    <div className="flex items-start justify-between px-8 py-4 md:px-16">
      <div className="font-mono text-xs leading-snug font-bold tracking-widest text-white/15 uppercase">
        <span>Strategy · Production · Creative</span>
        <br />
        <span>Social Satisfaction</span>
      </div>
    </div>
  </section>
)
