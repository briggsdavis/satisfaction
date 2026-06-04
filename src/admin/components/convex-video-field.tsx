import { useMutation, useQuery } from "convex/react"
import { Upload, X } from "lucide-react"
import React, { useRef, useState } from "react"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"

type Props = {
  label: string
  value: Id<"_storage"> | null
  onChange: (id: Id<"_storage"> | null) => void
  // Short note rendered under the label as guidance (e.g. recommended codec).
  hint?: string
}

export const AdminConvexVideoField = ({ label, value, onChange, hint }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const removeFile = useMutation(api.files.remove)
  // Signed URL for the admin preview only. The public site serves the video
  // through the CDN-cached /hero-video route instead.
  const url = useQuery(api.files.getUrl, value ? { storageId: value } : "skip")

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> }
      const previous = value
      onChange(storageId)
      if (previous) await removeFile({ storageId: previous }).catch(() => {})
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!value) return
    const previous = value
    onChange(null)
    await removeFile({ storageId: previous }).catch(() => {})
  }

  return (
    <div className="border-b border-white/10 py-4">
      <label
        className={`block text-xs font-bold tracking-[0.35em] text-white/40 uppercase ${
          hint ? "mb-1" : "mb-3"
        }`}
      >
        {label}
      </label>
      {hint && <p className="mb-3 text-xs text-white/30">{hint}</p>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 border border-white/20 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-white/50 uppercase transition-colors hover:border-white/50 hover:text-white disabled:opacity-40"
        >
          <Upload size={11} />
          {uploading ? "Uploading…" : value ? "Change Video" : "Upload Video"}
        </button>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1 text-xs text-white/25 transition-colors hover:text-red-400"
          >
            <X size={11} />
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          aria-label={`Upload ${label.toLowerCase()}`}
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {url && (
        <video
          src={url}
          muted
          loop
          playsInline
          autoPlay
          controls
          className="mt-3 h-40 w-64 border border-white/10 bg-black object-contain"
        />
      )}
    </div>
  )
}
