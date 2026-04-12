import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { AdminImageField, AdminTextareaField, AdminTextField } from "../../components/fields"
import { ConfirmDialog, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"
import type { AdminContent } from "../../context/content-context"

type Category = AdminContent["categories"][number]

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

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
  const [draft, setDraft] = useState<Category | null>(null)

  const setDraftField = (key: keyof Category, value: unknown) =>
    setDraft((d) => d ? { ...d, [key]: value } : d)

  const setDraftOverview = (key: string, value: string) =>
    setDraft((d) => d ? { ...d, overview: { ...d.overview, [key]: value } } : d)

  const setDraftBullet = (i: number, value: string) =>
    setDraft((d) => {
      if (!d) return d
      const next = [...d.bullets]
      next[i] = value
      return { ...d, bullets: next }
    })

  const handleNameChange = (name: string) =>
    setDraft((d) => d ? { ...d, name, slug: toSlug(name) } : d)

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
                  <p className="text-xs text-white/40">
                    {cat.projects.length} project{cat.projects.length !== 1 ? "s" : ""} · /portfolio/{cat.slug}
                  </p>
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
          {/* Header */}
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

          <div className="px-4 pb-6">
            {/* Name + auto-slug */}
            <AdminTextField
              label="Category Name"
              value={draft.name}
              onChange={handleNameChange}
              placeholder="e.g. Photography"
            />
            <div className="border-b border-white/10 py-3">
              <p className="text-[10px] font-bold tracking-[0.3em] text-white/25 uppercase">
                URL Slug (auto-generated)
              </p>
              <p className="mt-1 font-mono text-xs text-white/50">
                /portfolio/<span className="text-white/70">{draft.slug || "…"}</span>
              </p>
            </div>

            <AdminImageField
              label="Header Image"
              value={draft.img}
              onChange={(v) => setDraftField("img", v)}
            />

            {/* Bullets */}
            <div className="border-b border-white/10 py-4">
              <label className="mb-3 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
                Bullets (5 items)
              </label>
              {draft.bullets.map((b, i) => (
                <input
                  key={i}
                  type="text"
                  value={b}
                  onChange={(e) => setDraftBullet(i, e.target.value)}
                  placeholder={`Bullet ${i + 1}`}
                  className="mb-2 block w-full border-b border-white/20 bg-transparent pb-1 text-sm text-white outline-none focus:border-white/50"
                />
              ))}
            </div>

            {/* Overview */}
            <div className="mt-4 mb-2">
              <p className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase">Overview</p>
            </div>
            <AdminTextField
              label="Headline"
              value={draft.overview.headline}
              onChange={(v) => setDraftOverview("headline", v)}
            />
            <AdminTextareaField
              label="Description"
              value={draft.overview.description}
              onChange={(v) => setDraftOverview("description", v)}
              rows={3}
            />
            <AdminTextareaField
              label="Problem"
              value={draft.overview.problem}
              onChange={(v) => setDraftOverview("problem", v)}
              rows={3}
            />
            <AdminTextareaField
              label="Solution"
              value={draft.overview.solution}
              onChange={(v) => setDraftOverview("solution", v)}
              rows={3}
            />
            <AdminTextareaField
              label="Execution"
              value={draft.overview.execution}
              onChange={(v) => setDraftOverview("execution", v)}
              rows={3}
            />
            <AdminTextareaField
              label="Results"
              value={draft.overview.results}
              onChange={(v) => setDraftOverview("results", v)}
              rows={3}
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
