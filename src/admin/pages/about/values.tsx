import { AdminImageField, AdminTextareaField, AdminTextField } from "../../components/fields"
import { BackButton, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

export const ValuesAdmin = () => {
  const { content, update } = useContent()
  const values = content.values

  const setItem = (i: number, key: string, value: string | number) => {
    const next = values.map((v, idx) =>
      idx === i ? { ...v, [key]: value } : v,
    )
    update("values", next)
  }

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/about" label="About" />
      <SectionHeader
        title="About — Values"
        description="Culture, Dynamics, Creativity cards. Edit only — add/delete not available."
      />
      {values.map((val, i) => (
        <div key={i} className="mb-8 border border-white/10 p-6">
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
            {val.label}
          </p>
          <AdminTextField label="Label" value={val.label} onChange={(v) => setItem(i, "label", v)} />
          <AdminImageField label="Image URL" value={val.img} onChange={(v) => setItem(i, "img", v)} />
          <AdminTextareaField label="Body Text" value={val.body} onChange={(v) => setItem(i, "body", v)} rows={4} />
        </div>
      ))}
    </div>
  )
}
