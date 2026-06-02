import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { AdminConvexImageField } from "../../components/convex-image-field"
import { ConvexTextareaField, ConvexTextField } from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"

type Value = {
  image?: Id<"_storage">
  label: string
  body: string
}

const SLOT_LABELS = ["Slot 1", "Slot 2", "Slot 3"]

export const ValuesAdmin = () => {
  const about = useQuery(api.about.get)
  const upsert = useMutation(api.about.upsert)

  if (about === undefined) return null

  const current: Value[] = (about?.values ?? []).slice(0, 3)
  while (current.length < 3) current.push({ label: "", body: "" })

  const updateAt = async (i: number, patch: Partial<Value>) => {
    const next = current.map((v, idx) => (idx === i ? { ...v, ...patch } : v))
    await upsert({ values: next })
  }

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/about" label="About" />
      <SectionHeader
        title="Values"
        description="Three value cards on the About page (e.g. Culture / Dynamics / Creativity). Image, label, and body for each."
      />

      {current.map((value, i) => (
        <div key={i} className="mb-6 border border-white/10 p-4">
          <p className="mb-2 text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
            {SLOT_LABELS[i]}
          </p>
          <ConvexTextField
            label="Label (chip text, e.g. CULTURE)"
            value={value.label}
            onCommit={(v) => updateAt(i, { label: v })}
          />
          <ConvexTextareaField
            label="Body (revealed on click)"
            value={value.body}
            onCommit={(v) => updateAt(i, { body: v })}
            rows={4}
          />
          <AdminConvexImageField
            label="Image"
            aspectHint="2:3 (portrait) — cropped to fit"
            value={value.image ?? null}
            onChange={(v) => v && updateAt(i, { image: v })}
          />
        </div>
      ))}
    </div>
  )
}
