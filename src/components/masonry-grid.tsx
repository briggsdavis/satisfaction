import { Children, isValidElement, useState, type ReactNode } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const COLUMNS = { 0: 1, 768: 2, 1280: 3 }
const GUTTERS = { 0: 16 }
const RATIOS = ["aspect-square", "aspect-4/3", "aspect-3/4", "aspect-video"] as const

const ratioFor = (seed: number, index: number) => {
  let value = seed ^ Math.imul(index + 1, 0x45d9f3b)
  value ^= value >>> 16
  return RATIOS[(value >>> 0) % RATIOS.length]
}

export const MasonryGrid = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  const [seed] = useState(() => Math.floor(Math.random() * 0x7fffffff))

  return (
    <ResponsiveMasonry
      className={className}
      columnsCountBreakPoints={COLUMNS}
      gutterBreakPoints={GUTTERS}
    >
      <Masonry>
        {Children.toArray(children).map((child, index) => (
          <div
            key={isValidElement(child) ? child.key : index}
            className={`${ratioFor(seed, index)} w-full min-w-0 overflow-hidden`}
          >
            {child}
          </div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
