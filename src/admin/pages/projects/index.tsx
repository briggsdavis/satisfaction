import { useMutation, useQuery } from "convex/react"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { api } from "../../../../convex/_generated/api"
import type { Doc } from "../../../../convex/_generated/dataModel"
import { SectionHeader } from "../../components/misc"

const ProjectRow = ({ project }: { project: Doc<"projects"> }) => {
  const updateProject = useMutation(api.portfolio.updateProject)
  const removeProject = useMutation(api.portfolio.removeProject)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setFeatured = async (featured: boolean) => {
    setSaving(true)
    setError(null)
    try {
      await updateProject({ id: project._id, featured })
    } catch {
      setError("Could not update featured status. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const deleteProject = async () => {
    if (!confirm(`Delete "${project.title || "Untitled"}"? This cannot be undone.`)) return
    setDeleting(true)
    setError(null)
    try {
      await removeProject({ id: project._id })
    } catch {
      setError("Could not delete the project. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-x-4">
        <Link
          to={project.slug}
          className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-white"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{project.title || "Untitled"}</p>
            <p className="truncate font-mono text-xs text-white/30">/{project.slug}</p>
          </div>
          <span className="shrink-0 text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
            Edit →
          </span>
        </Link>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 px-4 py-3 text-xs text-white/70">
          <input
            type="checkbox"
            role="switch"
            aria-checked={project.featured}
            aria-label={`Feature ${project.title || "Untitled"} on the homepage`}
            checked={project.featured}
            disabled={saving || deleting}
            onChange={(event) => void setFeatured(event.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-5 w-9 rounded-full bg-white/20 transition-colors peer-checked:bg-yellow-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-white peer-disabled:opacity-40 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
          <span>{saving ? "Saving…" : "Featured"}</span>
        </label>
        <button
          type="button"
          aria-label={`Delete ${project.title || "Untitled"}`}
          disabled={saving || deleting}
          onClick={() => void deleteProject()}
          className="mr-4 flex shrink-0 items-center gap-2 rounded px-2 py-2 text-xs text-red-300 transition-colors hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-40"
        >
          <Trash2 size={14} />
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
      {error && (
        <p role="alert" className="px-4 pb-3 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}

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
        description="Manage your portfolio projects. Turn on Featured to show a project on the homepage."
      />

      <div className="space-y-2">
        {(projects ?? []).map((project) => (
          <ProjectRow key={project._id} project={project} />
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
