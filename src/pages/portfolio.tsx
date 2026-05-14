import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link, useNavigationType } from "react-router"
import { api } from "../../convex/_generated/api"
import type { Doc, Id } from "../../convex/_generated/dataModel"
import { TextReveal } from "../components/text-reveal"

type Category = Doc<"categories">

const CategoryImage = ({
  storageId,
  alt,
}: {
  storageId: Id<"_storage"> | undefined
  alt: string
}) => {
  const url = useQuery(api.files.getUrl, storageId ? { storageId } : "skip")
  if (!url) return null
  return (
    <motion.img
      src={url}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

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
      <CategoryImage storageId={category.image} alt={category.name} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
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

// Repeating layout template — capacities [1, 2, 3, 2, 1, 2] = 11 per cycle.
// Each "group" type renders the slice of categories it consumes; renderer
// walks the template and picks groups that fit the remaining count.
type GroupKind =
  | "full" // 1
  | "pair" // 2
  | "wideTwo" // 3 (wide top + 2 under)
const TEMPLATE: GroupKind[] = [
  "full",
  "pair",
  "wideTwo",
  "pair",
  "full",
  "pair",
]
const GROUP_SIZE: Record<GroupKind, number> = {
  full: 1,
  pair: 2,
  wideTwo: 3,
}

const renderGroup = (
  kind: GroupKind,
  cats: Category[],
  key: string,
): React.ReactNode => {
  if (kind === "full") {
    return <CategoryCard key={key} category={cats[0]} className="h-[42vh]" />
  }
  if (kind === "pair") {
    return (
      <div key={key} className="flex flex-col gap-4 md:flex-row">
        <CategoryCard category={cats[0]} className="h-[56vh] flex-1" />
        {cats[1] && (
          <CategoryCard category={cats[1]} className="h-[56vh] flex-1" />
        )}
      </div>
    )
  }
  return (
    <div key={key} className="flex flex-col gap-4">
      <CategoryCard category={cats[0]} className="h-[40vh]" />
      <div className="flex flex-col gap-4 md:flex-row">
        {cats[1] && (
          <CategoryCard category={cats[1]} className="h-[34vh] flex-1" />
        )}
        {cats[2] && (
          <CategoryCard category={cats[2]} className="h-[34vh] flex-1" />
        )}
      </div>
    </div>
  )
}

const renderTemplate = (cats: Category[]): React.ReactNode[] => {
  const out: React.ReactNode[] = []
  let i = 0
  let t = 0
  while (i < cats.length) {
    const kind = TEMPLATE[t % TEMPLATE.length]
    const size = GROUP_SIZE[kind]
    const slice = cats.slice(i, i + size)
    if (slice.length === 0) break
    out.push(renderGroup(kind, slice, `${t}-${i}`))
    i += size
    t++
  }
  return out
}

export const Portfolio = () => {
  const navType = useNavigationType()
  const titleDelay = navType === "PUSH" ? 0.75 : 0
  const categories = useQuery(api.portfolio.listCategories) ?? []

  return (
    <div className="pt-32">
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

      <div className="flex flex-col gap-4 px-8 py-8 md:px-16">
        {renderTemplate(categories)}
      </div>
    </div>
  )
}
