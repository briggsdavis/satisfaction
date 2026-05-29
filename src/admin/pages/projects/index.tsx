import { useMutation, useQuery } from "convex/react"
import { Plus } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { api } from "../../../../convex/_generated/api"
import { SectionHeader } from "../../components/misc"

export const ProjectsIndex = () => {
  const projects = useQuery(api.portfolio.listProjects)
  const services = useQuery(api.portfolio.listCategories) ?? []
  const createProject = useMutation(api.portfolio.createProject)
  const navigate = useNavigate()

  const handleAdd = async () => {
    const existing = new Set((projects ?? []).map((p) => p.slug))
    let slug = "new-project"
    let i = 1
    while (existing.has(slug)) slug = `new-project-${++i}`
    // Default to the first service so the project has a valid /portfolio/[slug] URL.
    const categoryIds = services.length > 0 ? [services[0]._id] : []
    await createProject({
      slug,
      title: "New Project",
      description: "",
      approach: "",
      execution: "",
      results: "",
      gallery: [],
      featured: false,
      categoryIds,
    })
    navigate(slug)
  }

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Projects"
        description="Every portfolio project. Each project is assigned to one or more services — it appears under each, and shows them as tags on its page."
      />

      <div className="space-y-2">
        {(projects ?? []).map((p) => (
          <Link
            key={p._id}
            to={p.slug}
            className="flex items-center justify-between border border-white/10 px-4 py-3 transition-colors hover:bg-white/5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{p.title || "Untitled"}</p>
              <p className="font-mono text-xs text-white/30">
                {p.featured && <span className="mr-2 text-yellow-400/70">★ featured</span>}/{p.slug}
              </p>
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
              Edit →
            </span>
          </Link>
        ))}

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
        >
          <Plus size={12} />
          Add Project
        </button>
      </div>
    </div>
  )
}
