import type { GalleryOrientation, GalleryTemplate } from "../model"

// Frame geometry for the masonry-like gallery templates. Shared by the server
// (slot capacity) and the client (layout).

type Frame = { x: number; y: number; width: number; height: number }

export const galleryTemplates: Record<
  GalleryTemplate,
  { width: number; height: number; gutter: number; label: string; frames: Frame[] }
> = {
  long: {
    label: "Extended",
    width: 1000,
    height: 2264,
    gutter: 16,
    frames: [
      { x: 0, y: 0, width: 560, height: 400 },
      { x: 576, y: 0, width: 424, height: 650 },
      { x: 0, y: 416, width: 320, height: 340 },
      { x: 336, y: 416, width: 224, height: 340 },
      { x: 576, y: 666, width: 424, height: 318 },
      { x: 0, y: 772, width: 560, height: 1120 / 3 },
      { x: 576, y: 1000, width: 424, height: 424 },
      { x: 0, y: 3484 / 3, width: 272, height: 408 },
      { x: 288, y: 3484 / 3, width: 272, height: 788 / 3 },
      { x: 288, y: 1440, width: 712, height: 400.5 },
      { x: 0, y: 4756 / 3, width: 272, height: 340 },
      { x: 0, y: 5824 / 3, width: 272, height: 968 / 3 },
      { x: 288, y: 1856.5, width: 440, height: 407.5 },
      { x: 744, y: 1856.5, width: 256, height: 407.5 },
    ],
  },
  short: {
    label: "Compact",
    width: 1000,
    height: 1450,
    gutter: 16,
    frames: [
      { x: 0, y: 0, width: 560, height: 400 },
      { x: 576, y: 0, width: 424, height: 686 },
      { x: 0, y: 416, width: 272, height: 408 },
      { x: 288, y: 416, width: 272, height: 270 },
      { x: 288, y: 702, width: 712, height: 400.5 },
      { x: 0, y: 840, width: 272, height: 340 },
      { x: 0, y: 1196, width: 272, height: 254 },
      { x: 288, y: 1118.5, width: 440, height: 331.5 },
      { x: 744, y: 1118.5, width: 256, height: 331.5 },
    ],
  },
}

export const MAX_SLOTS = 126

/** Editable slot count: every filled batch, plus one empty batch to grow into. */
export const slotCapacity = (slots: readonly unknown[], template: GalleryTemplate) => {
  const size = galleryTemplates[template].frames.length
  const used = slots.findLastIndex(Boolean) + 1
  return Math.min(MAX_SLOTS, (Math.floor(used / size) + 1) * size)
}

/** Writes `value` at `index`, padding with nulls and trimming trailing empties. */
export const setSlot = <T extends {}>(
  slots: readonly (T | null)[],
  index: number,
  value: T | null,
  template: GalleryTemplate,
): (T | null)[] => {
  if (!Number.isInteger(index) || index < 0 || index >= slotCapacity(slots, template))
    throw new Error("Frame not found")
  const next = Array.from({ length: Math.max(slots.length, index + 1) }, (_, i) => slots[i] ?? null)
  next[index] = value
  return trimSlots(next)
}

export const trimSlots = <T extends {}>(slots: readonly (T | null)[]) =>
  slots.slice(0, slots.findLastIndex((s) => s !== null) + 1)

/** Frames in reading order, mirrored per orientation; `index` is the source slot. */
export const positionedFrames = (template: GalleryTemplate, orientation: GalleryOrientation) => {
  const { width, height, frames } = galleryTemplates[template]
  const flipX = orientation === "horizontal" || orientation === "both"
  const flipY = orientation === "vertical" || orientation === "both"
  return frames
    .map((frame, index) => ({
      ...frame,
      index,
      x: flipX ? width - frame.x - frame.width : frame.x,
      y: flipY ? height - frame.y - frame.height : frame.y,
    }))
    .sort((a, b) => a.y - b.y || a.x - b.x)
}
