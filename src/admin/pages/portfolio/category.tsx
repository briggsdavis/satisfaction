import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { AdminImageField, AdminTextareaField, AdminTextField } from "../../components/fields"
import { ConfirmDialog, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"
import type { AdminContent } from "../../context/content-context"

type Project = AdminContent["categories"][number]["projects"][number]

const blankProject = (): Project => ({
  slug: "",
  title: "",
  tags: ["", ""],
  descriptor: "",
  img: "",
  description: "",
})

export const CategoryAdmin = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const navigate = useNavigate()

  const { content, update } = useContent()
  const catIndex = content.categories.findIndex((c) => c.slug === categorySlug)
  const cat = content.categories[catIndex]

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [draftProject, setDraftProject] = useState<Project | null>(null)

  if (!cat) {
    return (
      <div className="max-w-2xl">
        <p className="text-white/40">Category not found.</p>
        <Link to="/admin/portfolio" className="mt-4 inline-block btn-industrial-sm">← Back</Link>
      </div>
    )
  }

  const updateCat = (patch: Partial<typeof cat>) => {
    const next = content.categories.map((c, i) => (i === catIndex ? { ...c, ...patch } : c))
    update("categories", next)
  }

  const updateOverview = (key: string, value: string) =>
    updateCat({ overview: { ...cat.overview, [key]: value } })

  const setBullet = (i: number, v: string) => {
    const next = [...cat.bullets]
    next[i] = v
    updateCat({ bullets: next })
  }

  const confirmProject = () => {
    if (draftProject) {
      updateCat({ projects: [...cat.projects, draftProject] })
      setDraftProject(null)
      navigate(`/admin/portfolio/${cat.slug}`)
    }
  }

  const deleteProject = (slug: string) => {
    updateCat({ projects: cat.projects.filter((p) => p.slug !== slug) })
    setDeleteTarget(null)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/portfolio" className="text-xs text-white/40 hover:text-white transition-colors">
          ← Portfolio
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-xs text-white/60">{cat.name}</span>
      </div>

      <SectionHeader title={cat.name} description={`/portfolio/${cat.slug}`} />

      {/* Category metadata */}
      <AdminTextField label="Name" value={cat.name} onChange={(v) => updateCat({ name: v })} />
      <AdminTextField label="Slug (URL)" value={cat.slug} onChange={(v) => updateCat({ slug: v })} />
      <AdminImageField label="Header Image" value={cat.img} onChange={(v) => updateCat({ img: v })} />
      <AdminTextField label="Height" value={cat.height} onChange={(v) => updateCat({ height: v })} />

      <div className="border-b border-white/10 py-4">
        <label className="mb-3 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
          Bullets (5 items)
        </label>
        {cat.bullets.map((b, i) => (
          <input
            key={i}
            type="text"
            value={b}
            onChange={(e) => setBullet(i, e.target.value)}
            placeholder={`Bullet ${i + 1}`}
            className="mb-2 block w-full border-b border-white/20 bg-transparent pb-1 text-sm text-white outline-none focus:border-white/50"
          />
        ))}
      </div>

      <div className="mt-6 mb-4">
        <p className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase">Overview</p>
      </div>
      <AdminTextField label="Headline" value={cat.overview.headline} onChange={(v) => updateOverview("headline", v)} />
      <AdminTextareaField label="Description" value={cat.overview.description} onChange={(v) => updateOverview("description", v)} rows={3} />
      <AdminTextareaField label="Problem" value={cat.overview.problem} onChange={(v) => updateOverview("problem", v)} rows={3} />
      <AdminTextareaField label="Solution" value={cat.overview.solution} onChange={(v) => updateOverview("solution", v)} rows={3} />
      <AdminTextareaField label="Execution" value={cat.overview.execution} onChange={(v) => updateOverview("execution", v)} rows={3} />
      <AdminTextareaField label="Results" value={cat.overview.results} onChange={(v) => updateOverview("results", v)} rows={3} />

      {/* Projects */}
      <div className="mt-10 mb-4 border-t border-white/10 pt-8">
        <p className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase mb-4">
          Projects ({cat.projects.length})
        </p>
        {cat.projects.map((p) => (
          <div key={p.slug} className="flex items-center justify-between border-b border-white/10 py-3">
            <div>
              <p className="text-sm font-bold">{p.title}</p>
              <p className="text-[10px] text-white/30">/portfolio/{cat.slug}/{p.slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/admin/portfolio/${cat.slug}/${p.slug}`}
                className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase hover:text-white transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => setDeleteTarget(p.slug)}
                className="p-1 text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {/* Draft new project form */}
        {draftProject !== null ? (
          <div className="mt-4 border border-dashed border-white/30">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <span className="text-xs font-bold tracking-[0.25em] text-white/40 uppercase">New Project</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDraftProject(null)}
                  className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmProject}
                  className="text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors hover:text-white/60"
                >
                  Create →
                </button>
              </div>
            </div>
            <div className="px-4 pb-4">
              <AdminTextField
                label="Title"
                value={draftProject.title}
                onChange={(v) => setDraftProject({ ...draftProject, title: v })}
                placeholder="e.g. Summer Campaign 2024"
              />
              <AdminTextField
                label="Slug (URL)"
                value={draftProject.slug}
                onChange={(v) => setDraftProject({ ...draftProject, slug: v })}
                placeholder="e.g. summer-campaign-2024"
              />
              <AdminTextField
                label="Descriptor"
                value={draftProject.descriptor}
                onChange={(v) => setDraftProject({ ...draftProject, descriptor: v })}
                placeholder="e.g. Brand Campaign"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setDraftProject(blankProject())}
            className="mt-4 flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase hover:border-white/40 hover:text-white/70 transition-colors"
          >
            <Plus size={12} /> Add Project
          </button>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete project "${cat.projects.find((p) => p.slug === deleteTarget)?.title}"?`}
          onConfirm={() => deleteProject(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
