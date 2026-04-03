import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link } from "react-router"
import { CATEGORIES, type Category } from "../lib/categories"
import { TextReveal } from "../components/text-reveal"

// ─── Single category image card ───────────────────────────────────────────────
const CategoryCard = ({
  category,
  className = "",
}: {
  category: Category
  className?: string
}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/portfolio/${category.slug}`}
      className={`group relative block overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image */}
      <img
        src={category.img}
        alt={category.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Permanent gradient from bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      {/* Bottom-left overlay */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        {/* Bullet points — expand on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ul className="mb-5 space-y-1.5">
                {category.bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.055,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-start gap-2.5 list-none text-xs leading-relaxed text-white/70"
                  >
                    <span className="mt-[3px] shrink-0 text-white/30 text-[10px]">—</span>
                    {bullet}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tag pills */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-[9px] font-bold tracking-[0.22em] uppercase text-white backdrop-blur-sm">
            <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-white/80" />
            {category.name}
          </span>
          <span className="bg-black/60 px-2.5 py-1 text-[9px] font-bold tracking-[0.22em] uppercase text-white/45 backdrop-blur-sm">
            Portfolio
          </span>
        </div>
      </div>

      {/* Top-right CTA chip — appears on hover */}
      <div className="absolute right-5 top-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="block bg-white px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase text-black">
          View Work →
        </span>
      </div>
    </Link>
  )
}

// ─── Portfolio page ───────────────────────────────────────────────────────────
// Layout: full → split → full → split → full → split  (9 categories total)
export const Portfolio = () => (
  <div className="pt-32">
    {/* Page header */}
    <section className="border-b border-white/10 px-8 pb-16 md:px-16">
      <span className="mb-6 block text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">
        Selected Work
      </span>
      <TextReveal
        text="PORTFOLIO"
        className="massive-text text-[18vw] leading-none"
      />
    </section>

    {/* Image grid — px-8 matches navbar margin; gap-8 between every image */}
    <div className="flex flex-col gap-8 px-4 py-8 md:px-8">

      {/* Row 1 — full width */}
      <CategoryCard category={CATEGORIES[0]} className="h-[62vh] md:h-[68vh]" />

      {/* Row 2 — 2 columns */}
      <div className="flex flex-col gap-8 md:flex-row">
        <CategoryCard category={CATEGORIES[1]} className="h-[72vh] flex-1" />
        <CategoryCard category={CATEGORIES[2]} className="h-[72vh] flex-1" />
      </div>

      {/* Row 3 — full width */}
      <CategoryCard category={CATEGORIES[3]} className="h-[62vh] md:h-[68vh]" />

      {/* Row 4 — 2 columns */}
      <div className="flex flex-col gap-8 md:flex-row">
        <CategoryCard category={CATEGORIES[4]} className="h-[72vh] flex-1" />
        <CategoryCard category={CATEGORIES[5]} className="h-[72vh] flex-1" />
      </div>

      {/* Row 5 — full width */}
      <CategoryCard category={CATEGORIES[6]} className="h-[62vh] md:h-[68vh]" />

      {/* Row 6 — 2 columns */}
      <div className="flex flex-col gap-8 md:flex-row">
        <CategoryCard category={CATEGORIES[7]} className="h-[72vh] flex-1" />
        <CategoryCard category={CATEGORIES[8]} className="h-[72vh] flex-1" />
      </div>

    </div>
  </div>
)
