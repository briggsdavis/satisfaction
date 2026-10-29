import { ChevronDown, ChevronUp, Plus, Trash2, Upload, X } from "lucide-react"
import { useId, useState, type ReactNode } from "react"
import { Link } from "react-router"
import type { Id } from "../../convex/_generated/dataModel"
import { errorMessage } from "../lib/hooks"
import { useFilePicker, useUpload } from "../lib/upload"

export const label = "block text-xs font-bold tracking-[0.3em] text-ink/50 uppercase"
const input =
  "w-full border-b border-ink/25 bg-transparent pb-2 text-sm text-ink transition-colors outline-none placeholder:text-ink/30 focus:border-ink/60"
const subtle =
  "flex items-center gap-2 border border-ink/25 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-ink/60 uppercase transition-colors hover:border-ink/60 hover:text-ink disabled:opacity-40"

export const Page = ({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) => (
  <div className="max-w-3xl">
    <div className="mb-8 border-b border-ink/15 pb-6">
      <h1 className="font-display text-2xl font-bold tracking-tight uppercase">{title}</h1>
      {description && <p className="mt-2 text-sm text-ink/60">{description}</p>}
    </div>
    {children}
  </div>
)

export const Section = ({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) => (
  <section className="mb-12">
    <h2 className={label}>{title}</h2>
    {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    <div className="mt-2">{children}</div>
  </section>
)

/** Text input that commits on blur (or Enter), not per keystroke. Remounts when `value` changes upstream. */
export const TextField = ({
  label: text,
  value,
  onCommit,
  multiline,
  rows = 4,
  placeholder,
  normalize = (v: string) => v,
}: {
  label: string
  value: string
  onCommit: (value: string) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
  normalize?: (value: string) => string
}) => {
  const id = useId()
  const props = {
    id,
    defaultValue: value,
    placeholder,
    className: `${input} ${multiline ? "resize-y" : ""}`,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = normalize(e.currentTarget.value)
      if (next !== value) onCommit(next)
    },
  }
  return (
    <div className="border-b border-ink/10 py-5">
      <label htmlFor={id} className={`mb-2 ${label}`}>
        {text}
      </label>
      {multiline ? (
        <textarea key={value} rows={rows} {...props} />
      ) : (
        <input
          key={value}
          {...props}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
      )}
    </div>
  )
}

/** Upload/replace/remove one image or video. Old files are pruned server-side. */
export const MediaField = ({
  label: text,
  hint,
  url,
  kind = "image",
  onChange,
  removable = true,
}: {
  label: string
  hint?: string
  url: string | null | undefined
  kind?: "image" | "video"
  onChange: (id: Id<"_storage"> | null) => Promise<unknown>
  removable?: boolean
}) => {
  const upload = useUpload()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const run = async (work: () => Promise<unknown>) => {
    setBusy(true)
    setError(null)
    try {
      await work()
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setBusy(false)
    }
  }
  const picker = useFilePicker(([file]) => void run(async () => onChange(await upload(file))), {
    accept: `${kind}/*`,
  })

  return (
    <div className="border-b border-ink/10 py-5">
      <p className={label}>{text}</p>
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
      <div className="mt-3 flex items-center gap-3">
        <button type="button" disabled={busy} onClick={() => picker.pick()} className={subtle}>
          <Upload size={11} />
          {busy ? "Uploading…" : url ? `Change ${kind}` : `Upload ${kind}`}
        </button>
        {url && removable && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void run(() => onChange(null))}
            className="flex items-center gap-1 text-xs text-ink/40 transition-colors hover:text-red-400"
          >
            <X size={11} /> Remove
          </button>
        )}
        {picker.input}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {url &&
        (kind === "video" ? (
          <video
            src={url}
            muted
            loop
            playsInline
            autoPlay
            controls
            className="mt-3 h-40 w-64 border border-ink/10 bg-black object-contain"
          />
        ) : (
          <img src={url} alt="" className="mt-3 h-24 w-40 border border-ink/10 object-cover" />
        ))}
    </div>
  )
}

/** Moves the item at `index` by `delta` within `ids`. */
const move = <T,>(ids: T[], index: number, delta: number) => {
  const next = [...ids]
  const [item] = next.splice(index, 1)
  next.splice(index + delta, 0, item)
  return next
}

const iconButton = "p-1 text-ink/40 hover:text-ink disabled:opacity-20"

/**
 * An ordered list of collapsible cards with move up/down and delete.
 * `onReorder` receives the full id order, committed atomically server-side.
 */
export const OrderedList = <T extends { _id: string }>({
  items,
  title,
  onReorder,
  onRemove,
  confirmRemove = true,
  children,
  href,
  onAdd,
  addLabel,
  defaultOpen = false,
}: {
  items: T[]
  title: (item: T) => ReactNode
  onReorder: (ids: T["_id"][]) => unknown
  onRemove: (item: T) => unknown
  confirmRemove?: boolean
  /** Expanded editor body. Omit and pass `href` for rows that open elsewhere. */
  children?: (item: T) => ReactNode
  href?: (item: T) => string
  onAdd?: () => unknown
  addLabel?: string
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const ids = items.map((i) => i._id)
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const expanded = defaultOpen !== open.has(item._id)
        return (
          <div key={item._id} className="border border-ink/15">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              {href ? (
                <Link
                  to={href(item)}
                  className="min-w-0 flex-1 truncate text-sm font-bold hover:underline"
                >
                  {title(item)}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() =>
                    setOpen((s) => {
                      const next = new Set(s)
                      if (!next.delete(item._id)) next.add(item._id)
                      return next
                    })
                  }
                  className="min-w-0 flex-1 truncate text-left text-sm font-bold"
                >
                  {title(item)}
                </button>
              )}
              <div className="flex shrink-0 items-center gap-1">
                <button
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => onReorder(move(ids, i, -1))}
                  className={iconButton}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  aria-label="Move down"
                  disabled={i === items.length - 1}
                  onClick={() => onReorder(move(ids, i, 1))}
                  className={iconButton}
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  aria-label="Delete"
                  onClick={() =>
                    (!confirmRemove || confirm("Delete this item? This cannot be undone.")) &&
                    onRemove(item)
                  }
                  className="p-1 text-ink/30 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {expanded && children && (
              <div className="border-t border-ink/10 px-4 pb-2">{children(item)}</div>
            )}
          </div>
        )
      })}
      {onAdd && <AddButton onClick={onAdd}>{addLabel ?? "Add"}</AddButton>}
    </div>
  )
}

export const AddButton = ({
  onClick,
  children,
  disabled,
}: {
  onClick: () => unknown
  children: ReactNode
  disabled?: boolean
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => void onClick()}
    className="flex items-center gap-2 border border-dashed border-ink/30 px-4 py-2 text-xs font-bold tracking-[0.25em] text-ink/50 uppercase transition-colors hover:border-ink/60 hover:text-ink disabled:opacity-40"
  >
    <Plus size={12} />
    {children}
  </button>
)
