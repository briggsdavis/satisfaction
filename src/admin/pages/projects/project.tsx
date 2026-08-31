import { useQuery } from "convex/react"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { api } from "../../../../convex/_generated/api"

export const ProjectAdmin = () => {
  const { projectSlug } = useParams<{ projectSlug: string }>()
  const navigate = useNavigate()
  const project = useQuery(
    api.portfolio.getProjectBySlug,
    projectSlug ? { slug: projectSlug } : "skip",
  )
  const categories = useQuery(api.portfolio.listCategories) ?? []

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === "project-slug" && typeof event.data.slug === "string") {
        navigate(`/admin/projects/${event.data.slug}`, { replace: true })
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [navigate])

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
