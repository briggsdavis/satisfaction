import { Upload, X } from "lucide-react"
import React from "react"
import { SectionHeader } from "../components/misc"
import { useContent } from "../context/content-context"

export const BrandAdmin = () => {
  const { content, update } = useContent()
  const logo = content.logo
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update("logo", reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const removeLogo = () => update("logo", "")

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Brand Identity"
        description="Upload a logo to use across the entire site — top nav, footer, admin header, and favicon."
      />

      {/* Current logo preview */}
      <div className="mb-8 border border-white/10 p-6">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Current Logo
        </p>
        <img
          src={logo || "/satisfactionlogo.png"}
          alt="Logo preview"
          className="h-14 w-auto"
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = "none")
          }
        />
        {logo && (
          <p className="mt-3 text-2xs text-white/25">
            Custom logo active — replaces the default.
          </p>
        )}
        {!logo && (
          <p className="mt-3 text-2xs text-white/25">
            Showing default logo (satisfactionlogo.png).
          </p>
        )}
      </div>

      {/* Upload controls */}
      <div className="border-b border-white/10 py-4">
        <label className="mb-3 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
          Upload New Logo
        </label>
        <p className="mb-4 text-xs leading-relaxed text-white/30">
          Upload a PNG, SVG, or WebP. The uploaded image will immediately appear
          in the nav, footer, admin header, and as the browser favicon.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 border border-white/20 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white/50 uppercase transition-colors hover:border-white/50 hover:text-white"
          >
            <Upload size={12} />
            {logo ? "Replace Logo" : "Upload Logo"}
          </button>
          {logo && (
            <button
              type="button"
              onClick={removeLogo}
              className="flex items-center gap-1.5 text-xs text-white/25 transition-colors hover:text-red-400"
            >
              <X size={11} />
              Revert to Default
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/svg+xml,image/webp,image/jpeg"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>

      {/* Where it appears */}
      <div className="mt-8">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Appears In
        </p>
        <div className="space-y-2">
          {[
            "Site navigation (top left)",
            "Footer (bottom left)",
            "Admin header (top left)",
            "Browser favicon (tab icon)",
          ].map((loc) => (
            <div
              key={loc}
              className="flex items-center gap-3 border-b border-white/5 py-2.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span className="text-sm text-white/60">{loc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
