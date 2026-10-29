import { useMutation } from "convex/react"
import { useCallback, useRef } from "react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import type { Media } from "../../convex/model"

/** Uploads a file to Convex storage, resolving to its id. */
export const useUpload = () => {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  return useCallback(
    async (file: File) => {
      const response = await fetch(await generateUploadUrl(), {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      if (!response.ok) throw new Error("Upload failed. Please try again.")
      const { storageId } = (await response.json()) as { storageId: Id<"_storage"> }
      return storageId
    },
    [generateUploadUrl],
  )
}

export const mediaTypeOf = (file: File): Media["type"] | null =>
  file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null

/**
 * A hidden file input. `pick(context)` opens it; `onFiles` receives the files
 * plus whatever context was passed (e.g. which slot was clicked).
 */
export const useFilePicker = <C = undefined,>(
  onFiles: (files: File[], context: C) => void,
  { accept = "image/*", multiple = false }: { accept?: string; multiple?: boolean } = {},
) => {
  const ref = useRef<HTMLInputElement>(null)
  const context = useRef<C>(undefined as C)
  const pick = useCallback((value?: C) => {
    context.current = value as C
    ref.current?.click()
  }, [])
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (files.length) onFiles(files, context.current)
  }
  const input = (
    <input
      ref={ref}
      type="file"
      accept={accept}
      multiple={multiple}
      hidden
      aria-hidden
      tabIndex={-1}
      onChange={onChange}
    />
  )
  return { pick, input }
}
