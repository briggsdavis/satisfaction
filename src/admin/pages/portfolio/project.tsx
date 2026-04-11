import { Link, useParams } from "react-router"
import { AdminImageField, AdminTextareaField, AdminTextField } from "../../components/fields"
import { SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

export const ProjectAdmin = () => {
  const { categorySlug, projectSlug } = useParams<{ categorySlug: string; projectSlug: string }>()
  const { content, update } = useContent()

  const catIndex = content.categories.findIndex((c) => c.slug === categorySlug)
  const cat = content.categories[catIndex]
  const projectIndex = cat?.projects.findIndex((p) => p.slug === projectSlug) ?? -1
  const project = cat?.projects[projectIndex]

  if (!project || !cat) {
    return (
      <div className="max-w-2xl">
        <p className="text-white/40">Project not found.</p>
        <Link to="/admin/portfolio" className="mt-4 inline-block btn-industrial-sm">← Back</Link>
      </div>
    )
  }

  const setField = (key: string, value: unknown) => {
    const nextProjects = cat.projects.map((p, i) =>
      i === projectIndex ? { ...p, [key]: value } : p,
    )
    const nextCats = content.categories.map((c, i) =>
      i === catIndex ? { ...c, projects: nextProjects } : c,
    )
    update("categories", nextCats)
  }

  const setTag = (i: 0 | 1, v: string) => {
    const next = [...project.tags] as [string, string]
    next[i] = v
    setField("tags", next)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-2 text-xs text-white/40">
        <Link to="/admin/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
        <span className="text-white/20">/</span>
        <Link to={`/admin/portfolio/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60">{project.title}</span>
      </div>

      <SectionHeader title={project.title} />

      {/* Live URL preview */}
      <div className="mb-6 border border-white/10 bg-white/5 px-4 py-3">
        <p className="mb-1 text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">Creates Page</p>
        <p className="font-mono text-xs text-white/60">
          /portfolio/<span className="text-white/80">{cat.slug}</span>/<span className="text-white/80">{project.slug}</span>
        </p>
      </div>

      <AdminTextField label="Title" value={project.title} onChange={(v) => setField("title", v)} />
      <AdminTextField label="Slug (URL)" value={project.slug} onChange={(v) => setField("slug", v)} />
      <AdminTextField label="Descriptor" value={project.descriptor} onChange={(v) => setField("descriptor", v)} />

      <div className="border-b border-white/10 py-4">
        <label className="mb-3 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
          Tags (exactly 2)
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            value={project.tags[0]}
            onChange={(e) => setTag(0, e.target.value)}
            placeholder="Tag 1"
            className="flex-1 border-b border-white/20 bg-transparent pb-1 text-sm text-white outline-none focus:border-white/50"
          />
          <input
            type="text"
            value={project.tags[1]}
            onChange={(e) => setTag(1, e.target.value)}
            placeholder="Tag 2"
            className="flex-1 border-b border-white/20 bg-transparent pb-1 text-sm text-white outline-none focus:border-white/50"
          />
        </div>
      </div>

      <AdminImageField label="Project Image" value={project.img} onChange={(v) => setField("img", v)} />
      <AdminTextareaField label="Description" value={project.description} onChange={(v) => setField("description", v)} rows={5} />
    </div>
  )
}
