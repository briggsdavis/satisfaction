import { useMutation, useQuery } from "convex/react"
import { Plus, Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { api } from "../../../../convex/_generated/api"
import { SectionHeader } from "../../components/misc"

export const PortfolioIndex = () => {
  const categories = useQuery(api.portfolio.listCategories)
  const create = useMutation(api.portfolio.createCategory)
  const remove = useMutation(api.portfolio.removeCategory)
  const navigate = useNavigate()

  const handleAdd = async () => {
    const existing = new Set((categories ?? []).map((c) => c.slug))
    let slug = "new-category"
    let i = 1
    while (existing.has(slug)) slug = `new-category-${++i}`
    await create({
      slug,
      name: "New Category",
      color: "#FFFFFF",
      bullets: [],
      headline: "",
      description: "",
    })
    navigate(slug)
  }

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Portfolio — Categories"
        description="Top-level portfolio categories. Click into one to edit its details and projects."
      />

      <div className="space-y-2">
        {(categories ?? []).map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between border border-white/10 px-4 py-3"
          >
            <Link
              to={cat.slug}
              className="flex min-w-0 flex-1 items-center gap-3 transition-colors hover:text-white"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="truncate text-sm font-bold">
                {cat.name || "Untitled"}
              </span>
              <span className="font-mono text-xs text-white/30">
                /{cat.slug}
              </span>
            </Link>
            <button
              onClick={() => {
                if (confirm(`Delete category "${cat.name}"?`))
                  remove({ id: cat._id })
              }}
              className="p-1 text-white/20 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
        >
          <Plus size={12} />
          Add Category
        </button>
      </div>
    </div>
  )
}
