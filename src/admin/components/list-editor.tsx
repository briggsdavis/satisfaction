import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import React, { useState } from "react"

// Generic CRUD list with reorder (up/down buttons — no drag library needed)

export type ItemHelpers<T> = {
  update: (value: T) => void
  remove: () => void
  moveUp: () => void
  moveDown: () => void
  isFirst: boolean
  isLast: boolean
  /** True when this item is a new unsaved draft — use to start expanded */
  isDraft?: boolean
}

type ListEditorProps<T> = {
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T, index: number, helpers: ItemHelpers<T>) => React.ReactNode
  onAdd: () => T
  addLabel?: string
  canDelete?: boolean
}

export function ListEditor<T>({
  items,
  onChange,
  renderItem,
  onAdd,
  addLabel = "Add Item",
}: ListEditorProps<T>) {
  const [draft, setDraft] = useState<T | null>(null)

  const update = (index: number, value: T) => {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const next = [...items]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    const next = [...items]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
  }

  const confirmDraft = () => {
    if (draft !== null) {
      onChange([...items, draft])
      setDraft(null)
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) =>
        renderItem(item, index, {
          update: (v) => update(index, v),
          remove: () => remove(index),
          moveUp: () => moveUp(index),
          moveDown: () => moveDown(index),
          isFirst: index === 0,
          isLast: index === items.length - 1,
        }),
      )}

      {draft !== null ? (
        <div className="border border-dashed border-white/30">
          {/* Draft header bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="text-xs font-bold tracking-[0.25em] text-white/40 uppercase">
              New {addLabel.replace(/^Add\s+/i, "")}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDraft(null)}
                className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase transition-colors hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDraft}
                className="text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors hover:text-white/60"
              >
                Create →
              </button>
            </div>
          </div>
          {/* Render the draft using the same renderItem so it matches the real item UI */}
          {renderItem(draft, -1, {
            update: (v) => setDraft(v),
            remove: () => setDraft(null),
            moveUp: () => {},
            moveDown: () => {},
            isFirst: true,
            isLast: true,
            isDraft: true,
          })}
        </div>
      ) : (
        <button
          onClick={() => setDraft(onAdd())}
          className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
        >
          <Plus size={12} />
          {addLabel}
        </button>
      )}
    </div>
  )
}

// Reorder + delete button row — reuse inside renderItem
export const ItemActions = ({
  onMoveUp,
  onMoveDown,
  onRemove,
  isFirst,
  isLast,
  canDelete = true,
}: {
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  isFirst: boolean
  isLast: boolean
  canDelete?: boolean
}) => (
  <div className="flex items-center gap-1 shrink-0">
    <button
      onClick={onMoveUp}
      disabled={isFirst}
      className="p-1 text-white/30 transition-colors hover:text-white disabled:opacity-20"
      title="Move up"
    >
      <ChevronUp size={14} />
    </button>
    <button
      onClick={onMoveDown}
      disabled={isLast}
      className="p-1 text-white/30 transition-colors hover:text-white disabled:opacity-20"
      title="Move down"
    >
      <ChevronDown size={14} />
    </button>
    {canDelete && (
      <button
        onClick={onRemove}
        className="p-1 text-white/20 transition-colors hover:text-red-400"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    )}
  </div>
)
