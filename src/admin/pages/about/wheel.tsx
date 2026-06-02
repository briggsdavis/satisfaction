import { useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { api } from "../../../../convex/_generated/api"
import type { Doc } from "../../../../convex/_generated/dataModel"
import { AdminConvexImageField } from "../../components/convex-image-field"
import { ConvexTextareaField, ConvexTextField } from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"

type Item = Doc<"aboutWheel">

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
  const update = useMutation(api.about.updateWheel)
  const remove = useMutation(api.about.removeWheel)

  return (
    <div className="border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="truncate text-sm font-bold">{item.heading || "Untitled"}</span>
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
              if (confirm(`Delete "${item.heading || "this item"}"?`)) remove({ id: item._id })
            }}
            className="p-1 text-white/20 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="px-4 pb-2">
        <ConvexTextField
          label="Heading"
          value={item.heading}
          onCommit={(v) => update({ id: item._id, heading: v })}
        />
        <ConvexTextareaField
          label="Body"
          value={item.body}
          onCommit={(v) => update({ id: item._id, body: v })}
          rows={4}
        />
        <AdminConvexImageField
          label="Image"
          aspectHint="4:5 (portrait) — cropped to fit"
          value={item.image ?? null}
          onChange={(v) => v && update({ id: item._id, image: v })}
        />
      </div>
    </div>
  )
}

export const WheelAdmin = () => {
  const items = useQuery(api.about.listWheel) ?? []
  const create = useMutation(api.about.createWheel)
  const update = useMutation(api.about.updateWheel)

  const swap = async (a: Item, b: Item) => {
    await update({ id: a._id, order: b.order })
    await update({ id: b._id, order: a.order })
  }

  const handleAdd = async () => {
    const maxOrder = items.reduce((m, x) => Math.max(m, x.order), -1)
    await create({
      heading: "New Item",
      body: "",
      order: maxOrder + 1,
    })
  }

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/about" label="About" />
      <SectionHeader
        title="Wheel Section"
        description="Pinned scroll section on the About page. Items auto-number 01, 02, 03 in display order. Variable count."
      />
      <div className="space-y-3">
        {items.map((item, i) => (
          <ItemEditor
            key={item._id}
            item={item}
            isFirst={i === 0}
            isLast={i === items.length - 1}
            onSwap={(dir) => swap(item, items[i + dir])}
          />
        ))}

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
        >
          <Plus size={12} />
          Add Item
        </button>
      </div>
    </div>
  )
}
