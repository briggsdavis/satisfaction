import { AdminTextareaField, AdminTextField } from "../../components/fields"
import { BackButton, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

export const WhatWeDoAdmin = () => {
  const { content, update } = useContent()
  const w = content.whatWeDo

  const set = (key: keyof typeof w, value: string) =>
    update("whatWeDo", { ...w, [key]: value })

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="What We Do / Why We're Different"
        description="Two-panel scroll section on the homepage."
      />

      <div className="mb-8">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Panel 1 — What We Do
        </p>
        <AdminTextareaField
          label="Body Text"
          value={w.panel1Body}
          onChange={(v) => set("panel1Body", v)}
          rows={5}
        />
      </div>

      <div>
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Panel 2 — Why We're Different
        </p>
        <AdminTextField
          label="Left Column Label"
          value={w.panel2Col1Label}
          onChange={(v) => set("panel2Col1Label", v)}
        />
        <AdminTextareaField
          label="Left Column Body"
          value={w.panel2Col1Body}
          onChange={(v) => set("panel2Col1Body", v)}
          rows={4}
        />
        <AdminTextField
          label="Right Column Label"
          value={w.panel2Col2Label}
          onChange={(v) => set("panel2Col2Label", v)}
        />
        <AdminTextareaField
          label="Right Column Body"
          value={w.panel2Col2Body}
          onChange={(v) => set("panel2Col2Body", v)}
          rows={4}
        />
      </div>
    </div>
  )
}
