import { useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"

export const useProject = (slug: string | undefined, editing = false) => {
  const [selection, setSelection] = useState<{
    slug: string | undefined
    id: Id<"projects"> | null
  }>({ slug, id: null })
  const projectId = editing ? selection.id : null
  const projectBySlug = useQuery(
    api.portfolio.getProjectBySlug,
    !projectId && slug ? { slug } : "skip",
  )
  const projectById = useQuery(api.portfolio.getProject, projectId ? { id: projectId } : "skip")

  if (!editing) return projectBySlug

  if (slug !== selection.slug) {
    // Keep the ID after a rename, but resolve other project routes afresh.
    setSelection({ slug, id: projectById?.slug === slug ? projectId : null })
    return undefined
  }

  if (!projectId && projectBySlug) {
    // Attach editing to the permanent ID before allowing a slug-changing save.
    setSelection({ slug, id: projectBySlug._id })
    return undefined
  }

  return projectId ? projectById : projectBySlug
}
