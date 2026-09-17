import { v, type Infer } from "convex/values"
import type { Doc } from "../_generated/dataModel"

export const aspectRatio = v.union(
  v.literal("16:9"),
  v.literal("9:16"),
  v.literal("4:5"),
  v.literal("5:4"),
  v.literal("1:1"),
  v.literal("3:2"),
  v.literal("2:3"),
  v.literal("4:3"),
)
export const galleryOrientation = v.union(
  v.literal("original"),
  v.literal("horizontal"),
  v.literal("vertical"),
  v.literal("both"),
)
export type GalleryOrientation = Infer<typeof galleryOrientation>

export const galleryTemplateId = v.union(v.literal("long"), v.literal("short"))
export type GalleryTemplateId = Infer<typeof galleryTemplateId>

export const galleryTemplates = {
  long: {
    width: 1000,
    height: 2264,
    gutter: 16,
    frames: [
      { x: 0, y: 0, width: 560, height: 400, ratio: "3:2" },
      { x: 576, y: 0, width: 424, height: 650, ratio: "2:3" },
      { x: 0, y: 416, width: 320, height: 340, ratio: "1:1" },
      { x: 336, y: 416, width: 224, height: 340, ratio: "2:3" },
      { x: 576, y: 666, width: 424, height: 318, ratio: "4:3" },
      { x: 0, y: 772, width: 560, height: 1120 / 3, ratio: "3:2" },
      { x: 576, y: 1000, width: 424, height: 424, ratio: "1:1" },
      { x: 0, y: 3484 / 3, width: 272, height: 408, ratio: "2:3" },
      { x: 288, y: 3484 / 3, width: 272, height: 788 / 3, ratio: "1:1" },
      { x: 288, y: 1440, width: 712, height: 400.5, ratio: "16:9" },
      { x: 0, y: 4756 / 3, width: 272, height: 340, ratio: "4:5" },
      { x: 0, y: 5824 / 3, width: 272, height: 968 / 3, ratio: "4:5" },
      { x: 288, y: 1856.5, width: 440, height: 407.5, ratio: "1:1" },
      { x: 744, y: 1856.5, width: 256, height: 407.5, ratio: "2:3" },
    ],
  },
  short: {
    width: 1000,
    height: 1450,
    gutter: 16,
    frames: [
      { x: 0, y: 0, width: 560, height: 400, ratio: "3:2" },
      { x: 576, y: 0, width: 424, height: 686, ratio: "2:3" },
      { x: 0, y: 416, width: 272, height: 408, ratio: "2:3" },
      { x: 288, y: 416, width: 272, height: 270, ratio: "1:1" },
      { x: 288, y: 702, width: 712, height: 400.5, ratio: "16:9" },
      { x: 0, y: 840, width: 272, height: 340, ratio: "4:5" },
      { x: 0, y: 1196, width: 272, height: 254, ratio: "1:1" },
      { x: 288, y: 1118.5, width: 440, height: 331.5, ratio: "4:3" },
      { x: 744, y: 1118.5, width: 256, height: 331.5, ratio: "4:5" },
    ],
  },
} as const
export const galleryLayout = v.array(
  v.array(
    v.object({
      id: v.string(),
      ratio: aspectRatio,
      image: v.optional(v.id("_storage")),
    }),
  ),
)
export type GalleryLayout = Infer<typeof galleryLayout>

export const getGalleryLayout = (
  project: Pick<Doc<"projects">, "gallery" | "galleryLayout">,
): GalleryLayout =>
  project.galleryLayout ?? [
    project.gallery.map((image, index) => ({
      id: `legacy-${index}`,
      image,
      ratio: "1:1" as const,
    })),
  ]

export const galleryEdit = v.union(
  v.object({ type: v.literal("setImage"), index: v.number(), image: v.id("_storage") }),
  v.object({ type: v.literal("clearImage"), index: v.number() }),
)

export function editGallery(
  layout: GalleryLayout,
  edit: Infer<typeof galleryEdit>,
  templateId: GalleryTemplateId,
): GalleryLayout {
  const slots = layout.flat().map((slot) => ({ ...slot }))
  const galleryTemplate = galleryTemplates[templateId]
  const count = galleryTemplate.frames.length
  const capacity = Math.max(count, Math.ceil(slots.length / count) * count)
  // Both template sizes divide the 126-slot capacity.
  if (!Number.isInteger(edit.index) || edit.index < 0 || edit.index >= capacity || capacity > 126)
    throw new Error("Image frame not found")
  while (slots.length < capacity) {
    const index = slots.length
    slots.push({ id: `template-${index}`, ratio: galleryTemplate.frames[index % count].ratio })
  }
  if (edit.type === "setImage") slots[edit.index].image = edit.image
  else delete slots[edit.index].image
  return [slots]
}
