import { useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { api } from "../../../../convex/_generated/api"
import type { Doc } from "../../../../convex/_generated/dataModel"
import { ConvexTextareaField, ConvexTextField } from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"

type Section = Doc<"faqSections">
type Item = Doc<"faqItems">

const ItemEditor = ({
  item,
  isFirst,
  isLast,
  onSwap,
}: {
  item: Item
  isFirst: boolean
  isLast: boolean
  onSwap: (dir: -1 | 1) => void
}) => {
  const [open, setOpen] = useState(false)
  const update = useMutation(api.contact.updateFaqItem)
  const remove = useMutation(api.contact.removeFaqItem)
  return (
    <div className="border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="truncate text-xs">{item.question || "—"}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-2xs font-bold tracking-[0.2em] text-white/40 uppercase hover:text-white"
          >
            {open ? "Close" : "Edit"}
          </button>
          <button
            disabled={isFirst}
            onClick={() => onSwap(-1)}
            className="p-1 text-white/30 hover:text-white disabled:opacity-20"
          >
            <ChevronUp size={12} />
          </button>
          <button
            disabled={isLast}
            onClick={() => onSwap(1)}
            className="p-1 text-white/30 hover:text-white disabled:opacity-20"
          >
            <ChevronDown size={12} />
          </button>
          <button
            onClick={() => remove({ id: item._id })}
            className="p-1 text-white/20 hover:text-red-400"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      {open && (
        <div className="px-3 pb-2">
          <ConvexTextField
            label="Question"
            value={item.question}
            onCommit={(v) => update({ id: item._id, question: v })}
          />
          <ConvexTextareaField
            label="Answer"
            value={item.answer}
            onCommit={(v) => update({ id: item._id, answer: v })}
            rows={3}
          />
        </div>
      )}
    </div>
  )
}

const SectionEditor = ({
  section,
  isFirst,
  isLast,
  onSwap,
}: {
  section: Section
  isFirst: boolean
  isLast: boolean
  onSwap: (dir: -1 | 1) => void
}) => {
  const items = useQuery(api.contact.listFaqItems, { sectionId: section._id }) ?? []
  const sorted = items.toSorted((a, b) => a.order - b.order)

  const updateSection = useMutation(api.contact.updateFaqSection)
  const removeSection = useMutation(api.contact.removeFaqSection)
  const createItem = useMutation(api.contact.createFaqItem)
  const updateItem = useMutation(api.contact.updateFaqItem)
  const [open, setOpen] = useState(true)

  const swapItems = async (a: Item, b: Item) => {
    await updateItem({ id: a._id, order: b.order })
    await updateItem({ id: b._id, order: a.order })
  }

  const addItem = async () => {
    const maxOrder = sorted.reduce((m, x) => Math.max(m, x.order), -1)
    await createItem({
      sectionId: section._id,
      question: "New question",
      answer: "",
      order: maxOrder + 1,
    })
  }

  return (
    <div className="border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span className="text-sm font-bold">{section.name || "Untitled section"}</span>
          <span className="text-2xs text-white/30">
            {sorted.length} {sorted.length === 1 ? "item" : "items"}
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button
            disabled={isFirst}
            onClick={() => onSwap(-1)}
            className="p-1 text-white/30 hover:text-white disabled:opacity-20"
          >
            <ChevronUp size={14} />
          </button>
          <button
            disabled={isLast}
            onClick={() => onSwap(1)}
            className="p-1 text-white/30 hover:text-white disabled:opacity-20"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete section "${section.name}" and all its questions?`))
                removeSection({ id: section._id })
            }}
            className="p-1 text-white/20 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {open && (
        <div className="space-y-2 px-3 py-3">
          <ConvexTextField
            label="Section name"
            value={section.name}
            onCommit={(v) => updateSection({ id: section._id, name: v })}
          />
          {sorted.map((item, i) => (
            <ItemEditor
              key={item._id}
              item={item}
              isFirst={i === 0}
              isLast={i === sorted.length - 1}
              onSwap={(dir) => swapItems(item, sorted[i + dir])}
            />
          ))}
          <button
            onClick={addItem}
            className="flex items-center gap-2 border border-dashed border-white/20 px-3 py-1.5 text-2xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
          >
            <Plus size={11} />
            Add Question
          </button>
        </div>
      )}
    </div>
  )
}

export const FaqAdmin = () => {
  const sections = useQuery(api.contact.listFaqSections) ?? []
  const create = useMutation(api.contact.createFaqSection)
  const update = useMutation(api.contact.updateFaqSection)

  const swap = async (a: Section, b: Section) => {
    await update({ id: a._id, order: b.order })
    await update({ id: b._id, order: a.order })
  }

  const addSection = async () => {
    const maxOrder = sections.reduce((m, x) => Math.max(m, x.order), -1)
    await create({ name: "New Section", order: maxOrder + 1 })
  }

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/contact" label="Contact" />
      <SectionHeader
        title="FAQ"
        description="Sections alternate light/dark on the public page based on display order. Variable count of sections and questions."
      />
      <div className="space-y-3">
        {sections.map((s, i) => (
          <SectionEditor
            key={s._id}
            section={s}
            isFirst={i === 0}
            isLast={i === sections.length - 1}
            onSwap={(dir) => swap(s, sections[i + dir])}
          />
        ))}
        <button
          onClick={addSection}
          className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
        >
          <Plus size={12} />
          Add Section
        </button>
      </div>
    </div>
  )
}
