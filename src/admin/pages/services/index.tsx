import { useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { api } from "../../../../convex/_generated/api"
import type { Doc } from "../../../../convex/_generated/dataModel"
import { SectionHeader } from "../../components/misc"

type Service = Doc<"categories">

export const ServicesIndex = () => {
  const services = useQuery(api.portfolio.listCategories)
  const create = useMutation(api.portfolio.createCategory)
  const update = useMutation(api.portfolio.updateCategory)
  const remove = useMutation(api.portfolio.removeCategory)
  const navigate = useNavigate()

  const swap = async (a: Service, b: Service) => {
    await update({ id: a._id, order: b.order ?? 0 })
    await update({ id: b._id, order: a.order ?? 0 })
  }

  const handleAdd = async () => {
    const list = services ?? []
    const existing = new Set(list.map((s) => s.slug))
    let slug = "new-service"
    let i = 1
    while (existing.has(slug)) slug = `new-service-${++i}`
    const maxOrder = list.reduce((m, s) => Math.max(m, s.order ?? -1), -1)
    await create({
      slug,
      name: "New Service",
      color: "#FFFFFF",
      bullets: [],
      headline: "",
      description: "",
      size: "medium",
      order: maxOrder + 1,
    })
    navigate(slug)
  }

  const list = services ?? []

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Services"
        description="The single list of services. Each appears on the Services page, the homepage carousel, the Portfolio grid, and the Contact dropdown — and has its own detail page at /portfolio/[slug]. Click one to edit it."
      />

      <div className="space-y-2">
        {list.map((service, i) => (
          <div
            key={service._id}
            className="flex items-center justify-between border border-white/10 px-4 py-3"
          >
            <Link
              to={service.slug}
              className="flex min-w-0 flex-1 items-center gap-3 transition-colors hover:text-white"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: service.color }}
              />
              <span className="truncate text-sm font-bold">{service.name || "Untitled"}</span>
              <span className="font-mono text-xs text-white/30">/{service.slug}</span>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <button
                disabled={i === 0}
                onClick={() => swap(service, list[i - 1])}
                className="p-1 text-white/30 hover:text-white disabled:opacity-20"
              >
                <ChevronUp size={14} />
              </button>
              <button
                disabled={i === list.length - 1}
                onClick={() => swap(service, list[i + 1])}
                className="p-1 text-white/30 hover:text-white disabled:opacity-20"
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete service "${service.name}"?`)) remove({ id: service._id })
                }}
                className="p-1 text-white/20 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
        >
          <Plus size={12} />
          Add Service
        </button>
      </div>
    </div>
  )
}
