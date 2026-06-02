// Position-based aspect-ratio hints for the admin.
//
// The public masonry grids (category portfolio page, project-page gallery)
// size their cells in vh/vw and ALTERNATE the cell shape by position, so a
// given image is cropped to a different aspect ratio depending on where it
// falls in the sequence — and that position shifts every time an entry is
// added or removed. These helpers replicate the exact grid walks used on the
// public pages so the admin can show the shape each entry will actually take.
//
// Because the cells are viewport-relative there is no single fixed ratio; we
// report the approximate ratio at a common desktop size and label it as such.

import type { Id } from "../../convex/_generated/dataModel"

const REF_W = 1440
const REF_H = 900
const PAD = 64 // md:px-16 → 4rem on each side
const GAP = 16 // gap-4 between paired cells
const CONTENT_W = REF_W - PAD * 2 // full-bleed content column width
const HALF_W = (CONTENT_W - GAP) / 2 // one cell of a side-by-side pair
const vh = (n: number) => (n / 100) * REF_H

const fmt = (x: number) => (Number.isInteger(x) ? `${x}` : x.toFixed(1))

const ratioText = (r: number) => (r >= 1 ? `${fmt(r)}:1` : `1:${fmt(1 / r)}`)

const shapeWord = (r: number) => {
  if (r >= 2.2) return "ultra-wide landscape"
  if (r >= 1.5) return "landscape"
  if (r >= 1.15) return "wide"
  if (r >= 0.88) return "square"
  if (r >= 0.7) return "portrait"
  return "tall portrait"
}

const describe = (w: number, h: number) => {
  const r = w / h
  return `${shapeWord(r)} · ~${ratioText(r)} at ${REF_W}×${REF_H}`
}

// ── Category portfolio masonry (project cover images) ─────────────────────
// Walk mirrors MasonryGrid in src/pages/category.tsx: a full-width band,
// then a side-by-side pair, repeating. A pair with no partner spans full
// width. Returns the cover's shape at `index` within its category's list.
type Cell = { w: number; h: number }

const categoryCell = (count: number, index: number): Cell | undefined => {
  let i = 0
  while (i < count) {
    if (i === index) return { w: CONTENT_W, h: vh(42) } // full-width band
    i++
    if (i >= count) break
    const left = i
    const right = i + 1 < count ? i + 1 : undefined
    if (index === left) {
      // Lone left card stretches to full width (flex-1 with no sibling).
      return right === undefined ? { w: CONTENT_W, h: vh(72) } : { w: HALF_W, h: vh(72) }
    }
    if (index === right) return { w: HALF_W, h: vh(72) }
    i += right === undefined ? 1 : 2
  }
  return undefined
}

export const categoryCoverHint = (
  orderedIds: Id<"projects">[],
  projectId: Id<"projects">,
  categoryName: string,
): string => {
  const index = orderedIds.indexOf(projectId)
  const total = orderedIds.length
  if (index < 0 || total === 0) {
    return "varies by position in the portfolio masonry (recalculates as projects are added)"
  }
  const cell = categoryCell(total, index)
  const base = cell ? describe(cell.w, cell.h) : "varies"
  return `${base} — position ${index + 1} of ${total} in "${categoryName}"; shifts as projects are added/reordered`
}

// ── Project-page gallery masonry (gallery images) ─────────────────────────
// Walk mirrors buildGalleryRows in src/pages/project-page.tsx:
// full → pair → wideTwo, repeating (1 + 2 + 3 = 6 images per cycle).
const GALLERY_TEMPLATE = ["full", "pair", "wideTwo"] as const
const GALLERY_SIZE: Record<(typeof GALLERY_TEMPLATE)[number], number> = {
  full: 1,
  pair: 2,
  wideTwo: 3,
}

const galleryCell = (count: number, index: number): Cell | undefined => {
  let i = 0
  let t = 0
  while (i < count) {
    const kind = GALLERY_TEMPLATE[t % GALLERY_TEMPLATE.length]
    const size = Math.min(GALLERY_SIZE[kind], count - i)
    if (index >= i && index < i + size) {
      const pos = index - i
      if (kind === "full") return { w: CONTENT_W, h: vh(48) }
      if (kind === "pair") {
        // Lone left card spans full width.
        return size === 1 ? { w: CONTENT_W, h: vh(58) } : { w: HALF_W, h: vh(58) }
      }
      // wideTwo: top full-width band, then a bottom pair.
      if (pos === 0) return { w: CONTENT_W, h: vh(42) }
      return size === 2 ? { w: CONTENT_W, h: vh(36) } : { w: HALF_W, h: vh(36) }
    }
    i += size
    t++
  }
  return undefined
}

export const galleryImageHint = (count: number, index: number): string => {
  const cell = galleryCell(count, index)
  return cell ? describe(cell.w, cell.h) : "varies"
}
