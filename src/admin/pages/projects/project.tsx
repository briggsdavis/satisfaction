import { useQuery } from "convex/react"
import { useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { api } from "../../../../convex/_generated/api"
import { useProject } from "../../../hooks/use-project"

export const ProjectAdmin = () => {
  const { projectSlug } = useParams<{ projectSlug: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const project = useProject(projectSlug, true)
  const categories = useQuery(api.portfolio.listCategories) ?? []

  useEffect(() => {
    if (project && (project.slug !== projectSlug || searchParams.has("projectId"))) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete("projectId")
      const search = nextParams.size ? `?${nextParams}` : ""
      navigate(`/admin/projects/${project.slug}${search}`, { replace: true })
    }
  }, [navigate, project, projectSlug, searchParams])

  if (project === undefined) return null
  if (!project) return <p className="text-white/50">Project not found.</p>

  const primary = categories.find((category) => category._id === project.categoryIds[0])
  const publicPath = `/portfolio/${primary?.slug ?? ""}/${project.slug}`

  return (
    <div className="relative -m-8 h-[calc(100vh-4rem)] overflow-hidden bg-black">
      {primary && (
        <iframe
          src={`${publicPath}?edit=1`}
          title="Project page editor"
          sandbox="allow-same-origin allow-scripts"
          className="h-full w-full border-0"
        />
      )}
    </div>
  )
}
