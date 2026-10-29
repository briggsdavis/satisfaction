import DOMPurify from "dompurify"
import { ImagePlus } from "lucide-react"
import type { ElementType, ReactNode } from "react"
import { cn } from "../lib/cn"
import { useEditing } from "./edit-mode"

const outline =
  "rounded-sm outline-1 outline-white/30 outline-dashed transition-colors hover:outline-white/70 focus:outline-white"

/** Plain text that becomes inline-editable in edit mode. Commits on blur. */
export const EditableText = ({
  value,
  onCommit,
  as: Tag = "p",
  className,
  multiline = false,
  placeholder,
}: {
  value: string
  onCommit: (value: string) => void
  as?: ElementType
  className?: string
  multiline?: boolean
  placeholder?: string
}) => {
  const editing = useEditing()
  if (!editing) return <Tag className={className}>{value}</Tag>
  return (
    <Tag
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={cn(
        outline,
        "empty:before:text-white/30 empty:before:content-[attr(data-placeholder)]",
        className,
      )}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && event.key === "Enter") {
          event.preventDefault()
          event.currentTarget.blur()
        }
      }}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        const next = (event.currentTarget.innerText ?? "").trim()
        if (next !== value) onCommit(next)
      }}
    >
      {value}
    </Tag>
  )
}

const isHtml = (value: string) => /<[a-z][\s\S]*>/i.test(value)

/** Sanitized rich text (legacy HTML or plain text with newlines). */
export const EditableRich = ({
  value,
  onCommit,
  className,
}: {
  value: string
  onCommit: (value: string) => void
  className?: string
}) => {
  const editing = useEditing()
  if (!editing && !isHtml(value))
    return <p className={cn("whitespace-pre-line", className)}>{value}</p>
  const html = DOMPurify.sanitize(isHtml(value) ? value : value.replaceAll("\n", "<br>"))
  return (
    <div
      contentEditable={editing}
      suppressContentEditableWarning
      className={cn("rich-text", editing && cn(outline, "min-h-8"), className)}
      dangerouslySetInnerHTML={{ __html: html }}
      onBlur={(event) => {
        const next = DOMPurify.sanitize(event.currentTarget.innerHTML)
        if (next !== html) onCommit(next)
      }}
    />
  )
}

/** Dashed upload target, optionally over a preview. */
export const UploadTarget = ({
  onClick,
  label,
  preview,
  busy,
  className,
}: {
  onClick: () => void
  label: string
  preview?: ReactNode
  busy?: boolean
  className?: string
}) => (
  <button
    type="button"
    disabled={busy}
    onClick={onClick}
    className={cn(
      "group relative flex items-center justify-center overflow-hidden border border-dashed border-white/30 bg-white/5 text-white/50 hover:border-white/70 hover:text-white disabled:cursor-wait",
      className,
    )}
  >
    {preview && (
      <div className="absolute inset-0 opacity-60 transition-opacity group-hover:opacity-40">
        {preview}
      </div>
    )}
    <span className="relative flex items-center gap-2 bg-black/70 px-4 py-2 text-xs font-bold tracking-wider uppercase">
      <ImagePlus size={14} />
      {busy ? "Uploading…" : label}
    </span>
  </button>
)
