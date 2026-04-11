import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"

// Generic CRUD list with reorder (up/down buttons — no drag library needed)

type ListEditorProps<T> = {
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T, index: number, helpers: {
    update: (value: T) => void
    remove: () => void
    moveUp: () => void
    moveDown: () => void
    isFirst: boolean
    isLast: boolean
  }) => React.ReactNode
  onAdd: () => T
  addLabel?: string
  canDelete?: boolean
}

import React from "react"

export function ListEditor<T>({
  items,
  onChange,
  renderItem,
  onAdd,
  addLabel = "Add Item",
  canDelete = true,
}: ListEditorProps<T>) {
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
      <button
        onClick={() => onChange([...items, onAdd()])}
        className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
      >
        <Plus size={12} />
        {addLabel}
      </button>
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
