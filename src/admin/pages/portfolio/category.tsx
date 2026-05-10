import { useMutation, useQuery } from "convex/react"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { api } from "../../../../convex/_generated/api"
import { AdminConvexImageField } from "../../components/convex-image-field"
import {
  ConvexTextareaField,
  ConvexTextField,
} from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const BulletInput = ({
  value,
  onCommit,
}: {
  value: string
  onCommit: (v: string) => void
}) => {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <input
      type="text"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => local !== value && onCommit(local)}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur()
      }}
      className="flex-1 border-b border-white/20 bg-transparent pb-1 text-sm text-white outline-none focus:border-white/50"
    />
  )
}

export const CategoryAdmin = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const navigate = useNavigate()
  const category = useQuery(
    api.portfolio.getCategoryBySlug,
    categorySlug ? { slug: categorySlug } : "skip",
  )
  const projects = useQuery(
    api.portfolio.listProjectsByCategory,
    category ? { categoryId: category._id } : "skip",
  )

  const update = useMutation(api.portfolio.updateCategory)
  const remove = useMutation(api.portfolio.removeCategory)
  const createProject = useMutation(api.portfolio.createProject)

  if (category === undefined) return null
  if (!category) {
    return (
      <div className="max-w-2xl">
        <BackButton to="/admin/portfolio" label="Portfolio" />
        <p className="text-white/50">Category not found.</p>
      </div>
    )
  }

  const setBullet = (i: number, v: string) => {
    const next = [...category.bullets]
    next[i] = v
    update({ id: category._id, bullets: next })
  }
  const addBullet = () =>
    update({ id: category._id, bullets: [...category.bullets, ""] })
  const removeBullet = (i: number) =>
    update({
      id: category._id,
      bullets: category.bullets.filter((_, idx) => idx !== i),
    })

  const handleAddProject = async () => {
    const existing = new Set((projects ?? []).map((p) => p.slug))
    let slug = "new-project"
    let i = 1
    while (existing.has(slug)) slug = `new-project-${++i}`
    await createProject({
      slug,
      title: "New Project",
      description: "",
      approach: "",
      execution: "",
      results: "",
      gallery: [],
      featured: false,
      categoryIds: [category._id],
      serviceIds: [],
    })
    navigate(slug)
  }

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/portfolio" label="Portfolio" />
      <SectionHeader
        title={category.name || "Untitled Category"}
        description={`URL: /portfolio/${category.slug}`}
      />

      <ConvexTextField
        label="Name"
        value={category.name}
        onCommit={(v) => update({ id: category._id, name: v })}
      />
      <ConvexTextField
        label="Slug"
        value={category.slug}
        onCommit={(v) => update({ id: category._id, slug: slugify(v) })}
      />

      <div className="border-b border-white/10 py-4">
        <p className="mb-2 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
          Color
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={category.color}
            onChange={(e) =>
              update({ id: category._id, color: e.target.value })
            }
            className="h-8 w-12 cursor-pointer border border-white/20 bg-transparent"
          />
          <span className="text-xs text-white/40">{category.color}</span>
        </div>
      </div>

      <AdminConvexImageField
        label="Hero Image"
        value={category.image}
        onChange={(v) => v && update({ id: category._id, image: v })}
      />

      <div className="border-b border-white/10 py-4">
        <p className="mb-3 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
          Bullets (shown on hover on Portfolio page)
        </p>
        {category.bullets.map((b, i) => (
          <div key={i} className="mb-2 flex items-center gap-2">
            <BulletInput value={b} onCommit={(v) => setBullet(i, v)} />
            <button
              onClick={() => removeBullet(i)}
              className="text-xs text-white/20 transition-colors hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addBullet}
          className="mt-2 text-xs font-bold tracking-[0.2em] text-white/30 uppercase transition-colors hover:text-white"
        >
          + Add Bullet
        </button>
      </div>

      <ConvexTextField
        label="Overview Headline"
        value={category.headline}
        onCommit={(v) => update({ id: category._id, headline: v })}
      />
      <ConvexTextareaField
        label="Overview Description"
        value={category.description}
        onCommit={(v) => update({ id: category._id, description: v })}
        rows={4}
      />

      {/* Projects */}
      <div className="mt-10">
        <p className="mb-3 text-xs font-bold tracking-[0.3em] text-white/50 uppercase">
          Projects in this category
        </p>
        <div className="space-y-2">
          {(projects ?? []).map((p) => (
            <Link
              key={p._id}
              to={p.slug}
              className="flex items-center justify-between border border-white/10 px-4 py-3 transition-colors hover:bg-white/5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {p.title || "Untitled"}
                </p>
                <p className="font-mono text-xs text-white/30">
                  {p.featured && (
                    <span className="mr-2 text-yellow-400/70">★ featured</span>
                  )}
                  /{p.slug}
                </p>
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                Edit →
              </span>
            </Link>
          ))}

          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70"
          >
            <Plus size={12} />
            Add Project
          </button>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6">
        <button
          onClick={() => {
            if (
              confirm(
                `Delete category "${category.name}"? Projects assigned to it will lose this category but won't be deleted.`,
              )
            ) {
              remove({ id: category._id })
              navigate("/admin/portfolio")
            }
          }}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-red-400/70 uppercase transition-colors hover:text-red-400"
        >
          <Trash2 size={12} />
          Delete category
        </button>
      </div>
    </div>
  )
}
