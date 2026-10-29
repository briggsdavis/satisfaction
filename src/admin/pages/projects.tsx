import { useMutation, useQuery } from "convex/react"
import { Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { api } from "../../../convex/_generated/api"
import { AddButton, Page } from "../ui"

export const ProjectsAdmin = () => {
  const projects = useQuery(api.projects.list) ?? []
  const create = useMutation(api.projects.create)
  const update = useMutation(api.projects.update)
  const remove = useMutation(api.projects.remove)
  const navigate = useNavigate()

  return (
    <Page
      title="Projects"
      description="Turn on Featured to show a project on the homepage and About page."
    >
      <div className="space-y-2">
        {projects.map((p) => (
          <div key={p._id} className="flex flex-wrap items-center gap-x-4 border border-ink/15">
            <Link
              to={p._id}
              className="flex min-w-0 flex-1 items-center gap-4 px-4 py-3 hover:bg-ink/5"
            >
              {p.coverUrl && <img src={p.coverUrl} alt="" className="h-10 w-14 object-cover" />}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{p.title || "Untitled"}</p>
                <p className="truncate font-mono text-xs text-ink/40">/work/{p.slug}</p>
              </div>
            </Link>
            <label className="flex cursor-pointer items-center gap-2 px-2 text-xs text-ink/70">
              <input
                type="checkbox"
                role="switch"
                aria-checked={p.featured}
                checked={p.featured}
                onChange={(e) => void update({ id: p._id, patch: { featured: e.target.checked } })}
                className="peer sr-only"
              />
              <span className="relative h-5 w-9 rounded-full bg-ink/20 transition-colors peer-checked:bg-yellow-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
              Featured
            </label>
            <button
              type="button"
              aria-label={`Delete ${p.title}`}
              onClick={() =>
                confirm(`Delete "${p.title}"? This cannot be undone.`) && void remove({ id: p._id })
              }
              className="mr-4 p-2 text-ink/40 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <AddButton onClick={async () => navigate(await create())}>Add project</AddButton>
      </div>
    </Page>
  )
}
