import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { AdminConvexImageField } from "../../components/convex-image-field"
import { BackButton, SectionHeader } from "../../components/misc"

const SLOT_LABELS = [
  "Slot 1 — top-left (laptop)",
  "Slot 2 — upper-left (workspace)",
  "Slot 3 — top-centre (icon)",
  "Slot 4 — top-right (UI screenshot)",
  "Slot 5 — left (studio)",
  "Slot 6 — centre-left (graphic)",
  "Slot 7 — right (logo card)",
  "Slot 8 — far-right (camera lens)",
  "Slot 9 — bottom-left (phone mockup)",
  "Slot 10 — bottom-right (lifestyle)",
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

      {SLOT_LABELS.map((label, i) => (
        <AdminConvexImageField
          key={i}
          label={label}
          value={bySlot.get(i) ?? null}
          onChange={(v) => setSlot(i, v)}
        />
      ))}
    </div>
  )
}
