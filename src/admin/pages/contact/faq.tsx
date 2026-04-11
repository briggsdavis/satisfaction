import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { AdminTextareaField, AdminTextField } from "../../components/fields"
import { SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"
import type { AdminContent } from "../../context/content-context"

type FaqSection = AdminContent["faqSections"][number]
type FaqItem = FaqSection["items"][number]

export const FaqAdmin = () => {
  const { content, update } = useContent()
  const sections = content.faqSections
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const updateSections = (next: FaqSection[]) => update("faqSections", next)

  const updateSection = (si: number, patch: Partial<FaqSection>) =>
    updateSections(sections.map((s, i) => (i === si ? { ...s, ...patch } : s)))

  const updateItem = (si: number, ii: number, patch: Partial<FaqItem>) => {
    const items = sections[si].items.map((item, i) => (i === ii ? { ...item, ...patch } : item))
    updateSection(si, { items })
  }

  const moveSection = (si: number, dir: -1 | 1) => {
    const next = [...sections]
    const target = si + dir
    if (target < 0 || target >= next.length) return
    ;[next[si], next[target]] = [next[target], next[si]]
    updateSections(next)
  }

  const deleteSection = (si: number) => updateSections(sections.filter((_, i) => i !== si))
  const addSection = () => updateSections([...sections, { section: "New Section", items: [] }])

  const moveItem = (si: number, ii: number, dir: -1 | 1) => {
    const items = [...sections[si].items]
    const target = ii + dir
    if (target < 0 || target >= items.length) return
    ;[items[ii], items[target]] = [items[target], items[ii]]
    updateSection(si, { items })
  }

  const deleteItem = (si: number, ii: number) => {
    updateSection(si, { items: sections[si].items.filter((_, i) => i !== ii) })
  }

  const addItem = (si: number) => {
    updateSection(si, { items: [...sections[si].items, { q: "", a: "" }] })
  }

  return (
    <div className="max-w-3xl">
      <SectionHeader
        title="FAQ Builder"
        description="Add, edit, remove, and reorder FAQ sections and questions."
      />

      <div className="space-y-2">
        {sections.map((section, si) => (
          <div key={si} className="border border-white/10">
            {/* Section header row */}
            <div className="flex items-center gap-2 px-4 py-3">
              <button
                onClick={() => setExpandedSection((e) => (e === si ? null : si))}
                className="flex flex-1 items-center gap-2 text-left"
              >
                {expandedSection === si ? <ChevronDown size={14} className="text-white/40" /> : <ChevronUp size={14} className="text-white/40 rotate-180" />}
                <span className="text-sm font-bold">{section.section}</span>
                <span className="text-xs text-white/30">({section.items.length} items)</span>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => moveSection(si, -1)} disabled={si === 0} className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"><ChevronUp size={13} /></button>
                <button onClick={() => moveSection(si, 1)} disabled={si === sections.length - 1} className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"><ChevronDown size={13} /></button>
                <button onClick={() => deleteSection(si)} className="p-1 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>

            {expandedSection === si && (
              <div className="border-t border-white/10 px-4 pb-4">
                <AdminTextField
                  label="Section Title"
                  value={section.section}
                  onChange={(v) => updateSection(si, { section: v })}
                />

                <div className="mt-4 space-y-2">
                  {section.items.map((item, ii) => {
                    const key = `${si}-${ii}`
                    const isOpen = expandedItem === key
                    return (
                      <div key={ii} className="border border-white/10">
                        <div className="flex items-center gap-2 px-3 py-2">
                          <button
                            onClick={() => setExpandedItem((e) => (e === key ? null : key))}
                            className="flex-1 text-left text-xs text-white/60 truncate hover:text-white transition-colors"
                          >
                            {item.q || "New question"}
                          </button>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => moveItem(si, ii, -1)} disabled={ii === 0} className="p-1 text-white/20 hover:text-white disabled:opacity-20 transition-colors"><ChevronUp size={12} /></button>
                            <button onClick={() => moveItem(si, ii, 1)} disabled={ii === section.items.length - 1} className="p-1 text-white/20 hover:text-white disabled:opacity-20 transition-colors"><ChevronDown size={12} /></button>
                            <button onClick={() => deleteItem(si, ii)} className="p-1 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                          </div>
                        </div>
                        {isOpen && (
                          <div className="border-t border-white/10 px-3 pb-3">
                            <AdminTextField label="Question" value={item.q} onChange={(v) => updateItem(si, ii, { q: v })} />
                            <AdminTextareaField label="Answer" value={item.a} onChange={(v) => updateItem(si, ii, { a: v })} rows={3} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <button
                    onClick={() => addItem(si)}
                    className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-white/30 uppercase hover:text-white transition-colors py-2"
                  >
                    <Plus size={11} /> Add Question
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addSection}
        className="mt-4 flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase hover:border-white/40 hover:text-white/70 transition-colors"
      >
        <Plus size={12} /> Add Section
      </button>
    </div>
  )
}
