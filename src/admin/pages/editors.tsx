import { useMutation, useQuery } from "convex/react"
import { ArrowLeft, ExternalLink, PanelRightClose, PanelRightOpen } from "lucide-react"
import { useState, type ReactNode } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import { heroVariants } from "../../../convex/model"
import { EditMode } from "../../edit/edit-mode"
import { ServicePage } from "../../features/services/service"
import { ProjectPage } from "../../features/work/project"
import { errorMessage } from "../../lib/hooks"
import { AdminShell } from "../layout"
import { label, TextField } from "../ui"

/**
 * Full-screen editor: the real public page in <EditMode> (true viewport, so
 * vw units and sticky scenes behave), plus a floating settings panel.
 */
const Editor = ({
  back,
  live,
  panel,
  children,
}: {
  back: string
  live: string
  panel: ReactNode
  children: ReactNode
}) => {
  const [open, setOpen] = useState(true)
  return (
    <div className="min-h-screen bg-black text-white">
      <EditMode>{children}</EditMode>
      <AdminShell>
        <aside className="fixed right-4 bottom-4 z-5000 w-80 border border-ink/20 bg-paper/95 text-sm shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between gap-2 border-b border-ink/15 px-4 py-3">
            <Link
              to={back}
              className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] uppercase hover:underline"
            >
              <ArrowLeft size={12} /> Admin
            </Link>
            <div className="flex items-center gap-3">
              <a
                href={live}
                target="_blank"
                rel="noreferrer"
                aria-label="View live"
                className="text-ink/60 hover:text-ink"
              >
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                aria-label={open ? "Collapse panel" : "Expand panel"}
                onClick={() => setOpen((o) => !o)}
                className="text-ink/60 hover:text-ink"
              >
                {open ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
              </button>
            </div>
          </div>
          {open && (
            <div className="max-h-[70vh] overflow-y-auto px-4 pb-4" data-lenis-prevent>
              <p className="pt-4 text-xs text-ink/50">
                Click text and images on the page to edit them.
              </p>
              {panel}
            </div>
          )}
        </aside>
      </AdminShell>
    </div>
  )
}

/** Commits and surfaces server validation errors (e.g. "Slug is taken"). */
const useSaver = <A,>(save: (value: A) => Promise<unknown>) => {
  const [error, setError] = useState<string | null>(null)
  const commit = (value: A) => {
    setError(null)
    save(value).catch((cause) => setError(errorMessage(cause)))
  }
  return [commit, error] as const
}

const select = "mt-2 w-full border border-ink/25 bg-paper px-2 py-1.5 text-sm text-ink"

export const ServiceEditor = () => {
  const id = useParams().id as Id<"services">
  const service = useQuery(api.services.get, { id })
  const update = useMutation(api.services.update)
  const [patch, error] = useSaver((p: Parameters<typeof update>[0]["patch"]) =>
    update({ id, patch: p }),
  )
  if (service === undefined) return null
  if (!service) return <p className="p-8 text-white/50">Service not found.</p>

  return (
    <Editor
      back="/admin/services"
      live={`/portfolio/${service.slug}`}
      panel={
        <>
          <TextField label="Slug" value={service.slug} onCommit={(slug) => patch({ slug })} />
          {error && <p className="pt-2 text-xs text-red-400">{error}</p>}
          <label className="block border-b border-ink/10 py-5">
            <span className={label}>Hero design</span>
            <select
              value={service.hero}
              onChange={(e) => patch({ hero: e.target.value as typeof service.hero })}
              className={select}
            >
              {heroVariants.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
          <label className="block border-b border-ink/10 py-5">
            <span className={label}>Card height (Services page)</span>
            <select
              value={service.size}
              onChange={(e) => patch({ size: e.target.value as typeof service.size })}
              className={select}
            >
              {(["short", "medium", "tall", "xtall"] as const).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center justify-between border-b border-ink/10 py-5">
            <span className={label}>Color</span>
            <input
              type="color"
              value={service.color}
              onChange={(e) => patch({ color: e.target.value })}
              className="h-8 w-12"
            />
          </label>
          <TextField
            label="Bullets (one per line)"
            multiline
            value={service.bullets.join("\n")}
            onCommit={(text) =>
              patch({
                bullets: text
                  .split("\n")
                  .map((b) => b.trim())
                  .filter(Boolean),
              })
            }
          />
        </>
      }
    >
      <ServicePage service={service} />
    </Editor>
  )
}

export const ProjectEditor = () => {
  const id = useParams().id as Id<"projects">
  const project = useQuery(api.projects.get, { id })
  const update = useMutation(api.projects.update)
  const remove = useMutation(api.projects.remove)
  const navigate = useNavigate()
  const [patch, error] = useSaver((p: Parameters<typeof update>[0]["patch"]) =>
    update({ id, patch: p }),
  )
  if (project === undefined) return null
  if (!project) return <p className="p-8 text-white/50">Project not found.</p>

  return (
    <Editor
      back="/admin/projects"
      live={`/work/${project.slug}`}
      panel={
        <>
          <TextField label="Slug" value={project.slug} onCommit={(slug) => patch({ slug })} />
          {error && <p className="pt-2 text-xs text-red-400">{error}</p>}
          <label className="flex items-center justify-between border-b border-ink/10 py-5">
            <span className={label}>Featured</span>
            <input
              type="checkbox"
              checked={project.featured}
              onChange={(e) => patch({ featured: e.target.checked })}
            />
          </label>
          <button
            type="button"
            onClick={async () => {
              if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
              navigate("/admin/projects")
              await remove({ id })
            }}
            className="mt-5 text-xs font-bold tracking-[0.2em] text-red-400 uppercase hover:underline"
          >
            Delete project
          </button>
        </>
      }
    >
      <ProjectPage project={project} />
    </Editor>
  )
}
