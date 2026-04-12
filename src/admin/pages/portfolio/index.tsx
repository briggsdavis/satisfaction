import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { AdminTextField } from "../../components/fields"
import { ConfirmDialog, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"
import type { AdminContent } from "../../context/content-context"

type Category = AdminContent["categories"][number]

const blankCategory = (): Category => ({
  slug: "",
  name: "",
  img: "",
  height: "680px",
  bullets: ["", "", "", "", ""],
  overview: {
    headline: "",
    description: "",
    problem: "",
    solution: "",
    execution: "",
    results: "",
  },
  projects: [],
})

export const PortfolioIndex = () => {
  const { content, update } = useContent()
  const categories = content.categories
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  // Draft state for new category
  const [draft, setDraft] = useState<Category | null>(null)

  const confirmCategory = () => {
    if (draft) {
      update("categories", [...categories, draft])
      setDraft(null)
    }
  }

  const deleteCategory = (slug: string) => {
    update("categories", categories.filter((c) => c.slug !== slug))
    setDeleteTarget(null)
  }

  return (
    <div className="max-w-3xl">
      <SectionHeader
        title="Portfolio"
        description="Categories contain projects. Each project creates a /portfolio/:category/:project page."
      />

      <div className="space-y-1">
        {categories.map((cat) => (
          <div key={cat.slug} className="border border-white/10">
            {/* Category row */}
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => setExpanded((e) => (e === cat.slug ? null : cat.slug))}
                className="flex flex-1 items-center gap-3 text-left"
              >
                {expanded === cat.slug ? (
                  <ChevronDown size={14} className="text-white/40 shrink-0" />
                ) : (
                  <ChevronRight size={14} className="text-white/40 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-bold">{cat.name}</p>
                  <p className="text-xs text-white/40">{cat.projects.length} project{cat.projects.length !== 1 ? "s" : ""} · /portfolio/{cat.slug}</p>
                </div>
              </button>
              <Link
                to={cat.slug}
                className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase hover:text-white transition-colors shrink-0"
              >
                Edit
              </Link>
              <button
                onClick={() => setDeleteTarget(cat.slug)}
                className="p-1 text-white/20 hover:text-red-400 transition-colors shrink-0"
                title="Delete category"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Projects sub-list */}
            {expanded === cat.slug && (
              <div className="border-t border-white/10 pl-10 pr-4">
                {cat.projects.map((p) => (
                  <div key={p.slug} className="flex items-center justify-between border-b border-white/5 py-2.5">
                    <div>
                      <p className="text-xs font-bold">{p.title}</p>
                      <p className="text-[10px] text-white/30">/portfolio/{cat.slug}/{p.slug}</p>
                    </div>
                    <Link
                      to={`${cat.slug}/${p.slug}`}
                      className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase hover:text-white transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
                <Link
                  to={`${cat.slug}?new`}
                  className="flex items-center gap-1.5 py-3 text-xs font-bold tracking-[0.2em] text-white/30 uppercase hover:text-white transition-colors"
                >
                  <Plus size={11} /> Add Project
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Draft new category form */}
      {draft !== null ? (
        <div className="mt-4 border border-dashed border-white/30">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="text-xs font-bold tracking-[0.25em] text-white/40 uppercase">New Category</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDraft(null)}
                className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase transition-colors hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmCategory}
                className="text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors hover:text-white/60"
              >
                Create →
              </button>
            </div>
          </div>
          <div className="px-4 pb-4">
            <AdminTextField
              label="Category Name"
              value={draft.name}
              onChange={(v) => setDraft({ ...draft, name: v })}
              placeholder="e.g. Photography"
            />
            <AdminTextField
              label="Slug (URL)"
              value={draft.slug}
              onChange={(v) => setDraft({ ...draft, slug: v })}
              placeholder="e.g. photography"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setDraft(blankCategory())}
          className="mt-4 flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
        >
          <Plus size={12} />
          Add Category
        </button>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${categories.find((c) => c.slug === deleteTarget)?.name}"? This will also remove all its projects.`}
          onConfirm={() => deleteCategory(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
