// Controlled form field primitives — mirrors the styling from src/pages/contact.tsx

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
}) => (
  <div className="border-b border-white/10 py-4">
    <label className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
      {label}
    </label>
    <input
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="https://..."
      className="w-full border-b border-white/20 bg-transparent pb-2 text-sm text-white transition-colors outline-none placeholder:text-white/15 focus:border-white/50"
    />
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
