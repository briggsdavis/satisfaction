import { useEffect, useState } from "react"

// Text/textarea that commits to its onChange handler on blur (or Cmd/Ctrl-Enter
// for textareas), so we don't fire a Convex mutation on every keystroke.

type BaseProps = {
  label: string
  value: string
  onCommit: (v: string) => void
  placeholder?: string
}

export const ConvexTextField = ({
  label,
  value,
  onCommit,
  placeholder = "",
  type = "text",
}: BaseProps & { type?: string }) => {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <div className="border-b border-white/10 py-4">
      <label className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
        {label}
      </label>
      <input
        type={type}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => local !== value && onCommit(local)}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur()
        }}
        placeholder={placeholder}
        className="w-full border-b border-white/20 bg-transparent pb-2 text-sm text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"
      />
    </div>
  )
}

export const ConvexTextareaField = ({
  label,
  value,
  onCommit,
  placeholder = "",
  rows = 4,
}: BaseProps & { rows?: number }) => {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <div className="border-b border-white/10 py-4">
      <label className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
        {label}
      </label>
      <textarea
        rows={rows}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => local !== value && onCommit(local)}
        placeholder={placeholder}
        className="w-full resize-none border-b border-white/20 bg-transparent pb-2 text-sm text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"
      />
    </div>
  )
}
