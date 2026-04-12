// Controlled form field primitives — mirrors the styling from src/pages/contact.tsx
import { Upload, X } from "lucide-react"
import React from "react"

export const AdminTextField = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) => (
  <div className="border-b border-white/10 py-4">
    <label className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-b border-white/20 bg-transparent pb-2 text-sm text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"
    />
  </div>
)

export const AdminTextareaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) => (
  <div className="border-b border-white/10 py-4">
    <label className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
      {label}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full resize-none border-b border-white/20 bg-transparent pb-2 text-sm text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"
    />
  </div>
)

export const AdminImageField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
    // reset input so the same file can be re-selected if needed
    e.target.value = ""
  }

  return (
    <div className="border-b border-white/10 py-4">
      <label className="mb-3 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 border border-white/20 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-white/50 uppercase transition-colors hover:border-white/50 hover:text-white"
        >
          <Upload size={11} />
          {value ? "Change Image" : "Upload Image"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex items-center gap-1 text-xs text-white/25 transition-colors hover:text-red-400"
            title="Remove image"
          >
            <X size={11} />
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {value && (
        <img
          src={value}
          alt="preview"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          className="mt-3 h-24 w-40 border border-white/10 object-cover"
        />
      )}
    </div>
  )
}
