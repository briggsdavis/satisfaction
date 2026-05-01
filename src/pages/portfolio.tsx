import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link, useNavigationType } from "react-router"
import { TextReveal } from "../components/text-reveal"
import { CATEGORIES, type Category } from "../lib/categories"

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
      className={`group relative block overflow-hidden rounded-[16px] [backface-visibility:hidden] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image */}
      <motion.img
        src={category.img}
        alt={category.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Permanent gradient from bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      {/* Bottom border line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />

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
                    className="flex list-none items-start gap-2.5 text-xs leading-relaxed text-white/70 lowercase"
                  >
                    <span className="mt-[3px] shrink-0 text-xs text-white/30">
                      -
                    </span>
                    {bullet}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category title — visible on hover for all cards */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2"
            >
              <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
                <span
                  className="h-[6px] w-[6px] shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Link>
  )
}

// ─── Portfolio page ───────────────────────────────────────────────────────────
// Layout: full → split → full → split → full → split  (9 categories total)
export const Portfolio = () => {
  const navType = useNavigationType()
  const titleDelay = navType === "PUSH" ? 0.75 : 0

  return (
    <div className="pt-32">
      {/* Page header */}
      <section className="border-b border-white/10 px-8 pb-16 text-center md:px-16">
        <span className="mb-6 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
          Selected Work
        </span>
        <TextReveal
          text="PORTFOLIO"
          className="massive-text justify-center text-6xl leading-none md:text-10xl lg:text-11xl"
          slideFrom="left"
          delay={titleDelay}
        />
      </section>

      {/* Vertical masonry grid — mirrors FeaturedCascade pattern rotated 90° */}
      <div className="flex flex-col gap-4 px-8 py-8 md:px-16">
        {/* Row 1 — full width */}
        <CategoryCard category={CATEGORIES[0]} className="h-[42vh]" />

        {/* Row 2 — 2 equal columns */}
        <div className="flex flex-col gap-4 md:flex-row">
          <CategoryCard category={CATEGORIES[1]} className="h-[56vh] flex-1" />
          <CategoryCard category={CATEGORIES[2]} className="h-[56vh] flex-1" />
        </div>

        {/* Row 3 — wide top + two under */}
        <div className="flex flex-col gap-4">
          <CategoryCard category={CATEGORIES[3]} className="h-[40vh]" />
          <div className="flex flex-col gap-4 md:flex-row">
            <CategoryCard
              category={CATEGORIES[4]}
              className="h-[34vh] flex-1"
            />
            <CategoryCard
              category={CATEGORIES[5]}
              className="h-[34vh] flex-1"
            />
          </div>
        </div>

        {/* Row 4 — 2 equal columns */}
        <div className="flex flex-col gap-4 md:flex-row">
          <CategoryCard category={CATEGORIES[6]} className="h-[56vh] flex-1" />
          <CategoryCard category={CATEGORIES[7]} className="h-[56vh] flex-1" />
        </div>

        {/* Row 5 — 2 equal columns (web-development + motion-graphics) */}
        <div className="flex flex-col gap-4 md:flex-row">
          <CategoryCard category={CATEGORIES[8]} className="h-[56vh] flex-1" />
          <CategoryCard category={CATEGORIES[9]} className="h-[56vh] flex-1" />
        </div>
      </div>
    </div>
  )
}
