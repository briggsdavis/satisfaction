import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { AdminConvexImageField } from "../../components/convex-image-field"
import { BackButton, SectionHeader } from "../../components/misc"

// Each slot has a fixed size in the hero layout (see SLOTS in
// src/components/scattered-images.tsx). Ratios below mirror those dimensions;
// every slot is object-cover, so the image is cropped to fit.
const SLOTS = [
  { label: "Slot 1 — top-left (laptop)", ratio: "28:19 (≈3:2 landscape)" },
  { label: "Slot 2 — upper-left (workspace)", ratio: "22:15 (≈3:2 landscape)" },
  { label: "Slot 3 — top-centre (icon)", ratio: "1:1 (square)" },
  { label: "Slot 4 — top-right (UI screenshot)", ratio: "9:4 (wide landscape)" },
  { label: "Slot 5 — left (studio)", ratio: "18:11 (landscape)" },
  { label: "Slot 6 — centre-left (graphic)", ratio: "11:10 (near-square)" },
  { label: "Slot 7 — right (logo card)", ratio: "6:7 (near-square)" },
  { label: "Slot 8 — far-right (camera lens)", ratio: "1:1 (square)" },
  { label: "Slot 9 — bottom-left (phone mockup)", ratio: "7:10 (portrait)" },
  { label: "Slot 10 — bottom-right (lifestyle)", ratio: "7:4 (landscape)" },
]

export const HeroAdmin = () => {
  const homepage = useQuery(api.homepage.get)
  const patch = useMutation(api.homepage.patch)

  if (homepage === undefined) return null

  const bySlot = new Map<number, Id<"_storage">>()
  for (const entry of homepage?.heroImages ?? []) {
    bySlot.set(entry.slot, entry.image as Id<"_storage">)
  }

  const setSlot = async (index: number, id: Id<"_storage"> | null) => {
    const next = new Map(bySlot)
    if (id) next.set(index, id)
    else next.delete(index)
    const heroImages = [...next.entries()]
      .toSorted(([a], [b]) => a - b)
      .map(([slot, image]) => ({ slot, image }))
    await patch({ heroImages })
  }

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="Hero — Scattered Images"
        description="Upload the 10 images that float around the hero. Layout, position, and timing are fixed in code; only the images themselves are editable."
      />

      {SLOTS.map((slot, i) => (
        <AdminConvexImageField
          key={i}
          label={slot.label}
          aspectHint={slot.ratio}
          value={bySlot.get(i) ?? null}
          onChange={(v) => setSlot(i, v)}
        />
      ))}
    </div>
  )
}
