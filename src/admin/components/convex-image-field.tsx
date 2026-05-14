import { useMutation, useQuery } from "convex/react"
import { Upload, X } from "lucide-react"
import React, { useRef, useState } from "react"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"

type Props = {
  label: string
  value: Id<"_storage"> | null
  onChange: (id: Id<"_storage"> | null) => void
}

export const AdminConvexImageField = ({ label, value, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const removeFile = useMutation(api.files.remove)
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
      <label className="mb-3 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 border border-white/20 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-white/50 uppercase transition-colors hover:border-white/50 hover:text-white disabled:opacity-40"
        >
          <Upload size={11} />
          {uploading ? "Uploading…" : value ? "Change Image" : "Upload Image"}
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
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {url && (
        <img
          src={url}
          alt="preview"
          className="mt-3 h-24 w-40 border border-white/10 object-cover"
        />
      )}
    </div>
  )
}
