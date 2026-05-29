import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { api } from "../../../../convex/_generated/api"
import type { Doc } from "../../../../convex/_generated/dataModel"
import { AdminConvexImageField } from "../../components/convex-image-field"
import { ConvexTextareaField, ConvexTextField } from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"

type Size = NonNullable<Doc<"categories">["size"]>
const SIZES: Size[] = ["short", "medium", "tall", "xtall"]

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const BulletInput = ({ value, onCommit }: { value: string; onCommit: (v: string) => void }) => {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <input
      type="text"
      aria-label="Bullet"
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

export const ServiceAdmin = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>()
  const navigate = useNavigate()
  const service = useQuery(
    api.portfolio.getCategoryBySlug,
    serviceSlug ? { slug: serviceSlug } : "skip",
  )

  const update = useMutation(api.portfolio.updateCategory)
  const remove = useMutation(api.portfolio.removeCategory)

  if (service === undefined) return null
  if (!service) {
    return (
      <div className="max-w-2xl">
        <BackButton to="/admin/services" label="Services" />
        <p className="text-white/50">Service not found.</p>
      </div>
    )
  }

  const setBullet = (i: number, v: string) => {
    const next = [...service.bullets]
    next[i] = v
    update({ id: service._id, bullets: next })
  }
  const addBullet = () => update({ id: service._id, bullets: [...service.bullets, ""] })
  const removeBullet = (i: number) =>
    update({
      id: service._id,
      bullets: service.bullets.filter((_, idx) => idx !== i),
    })

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/services" label="Services" />
      <SectionHeader
        title={service.name || "Untitled Service"}
        description={`Detail page: /portfolio/${service.slug}`}
      />

      <ConvexTextField
        label="Name"
        value={service.name}
        onCommit={(v) => update({ id: service._id, name: v })}
      />
      <ConvexTextField
        label="Slug"
        value={service.slug}
        onCommit={(v) => update({ id: service._id, slug: slugify(v) })}
      />

      <div className="border-b border-white/10 py-4">
        <label
          htmlFor="service-color"
          className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase"
        >
          Color
        </label>
        <div className="flex items-center gap-3">
          <input
            id="service-color"
            aria-label="Color"
            type="color"
            value={service.color}
            onChange={(e) => update({ id: service._id, color: e.target.value })}
            className="h-8 w-12 cursor-pointer border border-white/20 bg-transparent"
          />
          <span className="text-xs text-white/40">{service.color}</span>
        </div>
      </div>

      <div className="border-b border-white/10 py-4">
        <p className="mb-2 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
          Card Size (Services page)
        </p>
        <div className="flex gap-2">
          {SIZES.map((s) => {
            const active = (service.size ?? "medium") === s
            return (
              <button
                key={s}
                onClick={() => update({ id: service._id, size: s })}
                className={`border px-3 py-1.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                  active
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      <AdminConvexImageField
        label="Image"
        value={service.image ?? null}
        onChange={(v) => v && update({ id: service._id, image: v })}
      />

      <div className="border-b border-white/10 py-4">
        <p className="mb-3 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
          Bullets (shown on hover)
        </p>
        {service.bullets.map((b, i) => (
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
        label="Detail Page Headline"
        value={service.headline}
        onCommit={(v) => update({ id: service._id, headline: v })}
      />
      <ConvexTextareaField
        label="Detail Page Description"
        value={service.description}
        onCommit={(v) => update({ id: service._id, description: v })}
        rows={4}
      />

      <div className="mt-10 border-t border-white/10 pt-6">
        <button
          onClick={() => {
            if (
              confirm(
                `Delete service "${service.name}"? Projects assigned to it will lose this service but won't be deleted.`,
              )
            ) {
              remove({ id: service._id })
              navigate("/admin/services")
            }
          }}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-red-400/70 uppercase transition-colors hover:text-red-400"
        >
          Delete service
        </button>
      </div>
    </div>
  )
}
