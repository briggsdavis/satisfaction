import { v, type Infer } from "convex/values"
import type { Doc } from "../_generated/dataModel"

export const aspectRatios = ["16:9", "9:16", "4:5", "5:4", "1:1"] as const
export const aspectRatio = v.union(
  v.literal("16:9"),
  v.literal("9:16"),
  v.literal("4:5"),
  v.literal("5:4"),
  v.literal("1:1"),
)
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
  v.object({ type: v.literal("addColumn") }),
  v.object({ type: v.literal("removeColumn"), column: v.number() }),
  v.object({ type: v.literal("addSlot"), column: v.number(), id: v.string(), ratio: aspectRatio }),
  v.object({ type: v.literal("removeSlot"), id: v.string() }),
  v.object({ type: v.literal("setImage"), id: v.string(), image: v.id("_storage") }),
  v.object({ type: v.literal("setRatio"), id: v.string(), ratio: aspectRatio }),
  v.object({ type: v.literal("moveSlot"), id: v.string(), column: v.number(), index: v.number() }),
)

// Keep the embedded layout bounded: at most three columns and 120 slots.
export function editGallery(layout: GalleryLayout, edit: Infer<typeof galleryEdit>): GalleryLayout {
  const columns = layout.map((column) => column.map((slot) => ({ ...slot })))
  const columnAt = (index: number) => {
    if (!Number.isInteger(index) || !columns[index]) throw new Error("Column not found")
    return columns[index]
  }
  if (edit.type === "addColumn") {
    if (columns.length >= 3) throw new Error("A gallery can have up to three columns")
    columns.push([])
  } else if (edit.type === "removeColumn") {
    if (columns.length === 1 || columnAt(edit.column).length)
      throw new Error("Only empty extra columns can be removed")
    columns.splice(edit.column, 1)
  } else if (edit.type === "addSlot") {
    if (columns.flat().length >= 120) throw new Error("A gallery can have up to 120 images")
    if (!edit.id || edit.id.length > 100 || columns.flat().some((slot) => slot.id === edit.id))
      throw new Error("Invalid image slot ID")
    columnAt(edit.column).push({ id: edit.id, ratio: edit.ratio })
  } else {
    const source = columns.find((column) => column.some((slot) => slot.id === edit.id))
    const index = source?.findIndex((slot) => slot.id === edit.id) ?? -1
    if (!source || index < 0) throw new Error("Image slot no longer exists")
    const slot = source[index]
    if (edit.type === "setImage") slot.image = edit.image
    if (edit.type === "setRatio") slot.ratio = edit.ratio
    if (edit.type === "removeSlot") source.splice(index, 1)
    if (edit.type === "moveSlot") {
      const target = columnAt(edit.column)
      const maxIndex = target.length - (source === target ? 1 : 0)
      if (!Number.isInteger(edit.index) || edit.index < 0 || edit.index > maxIndex)
        throw new Error("Invalid image position")
      source.splice(index, 1)
      target.splice(edit.index, 0, slot)
    }
  }
  return columns
}
