import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"

export const useStorageUrl = (id: Id<"_storage"> | null | undefined) => {
  return useQuery(api.files.getUrl, id ? { storageId: id } : "skip") ?? null
}
