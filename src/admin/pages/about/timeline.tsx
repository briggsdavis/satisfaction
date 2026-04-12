import { AdminTextareaField, AdminTextField } from "../../components/fields"
import { BackButton, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

export const TimelineAdmin = () => {
  const { content, update } = useContent()
  const items = content.timeline

  const setItem = (i: number, key: string, value: string | null) => {
    const next = items.map((item, idx) =>
      idx === i ? { ...item, [key]: value } : item,
    )
    update("timeline", next)
  }

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/about" label="About" />
      <SectionHeader
        title="About — Timeline"
        description="Past projects & clients horizontal scroll. Edit only — add/delete not available."
      />
      {items.map((item, i) => (
        <div key={i} className="mb-8 border border-white/10 p-6">
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
            Entry {i + 1}
          </p>
          <AdminTextField label="Date Range" value={item.date} onChange={(v) => setItem(i, "date", v)} />
          <AdminTextField label="Client" value={item.client} onChange={(v) => setItem(i, "client", v)} />
          <AdminTextField
            label="Campaign (leave blank if none)"
            value={item.campaign ?? ""}
            onChange={(v) => setItem(i, "campaign", v || null)}
          />
          <AdminTextField label="Role" value={item.role} onChange={(v) => setItem(i, "role", v)} />
          <AdminTextareaField label="Description" value={item.description} onChange={(v) => setItem(i, "description", v)} rows={4} />
        </div>
      ))}
    </div>
  )
}
