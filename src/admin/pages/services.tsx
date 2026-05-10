import { useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { api } from "../../../convex/_generated/api"
import type { Doc, Id } from "../../../convex/_generated/dataModel"
import { AdminConvexImageField } from "../components/convex-image-field"
import { ConvexTextField } from "../components/convex-text-field"
import { SectionHeader } from "../components/misc"

type Service = Doc<"services">
type Size = Service["size"]

const SIZES: Size[] = ["short", "medium", "tall", "xtall"]

const ServiceEditor = ({
  service,
  isFirst,
  isLast,
  onSwap,
}: {
  service: Service
  isFirst: boolean
  isLast: boolean
  onSwap: (dir: -1 | 1) => void
}) => {
  const [open, setOpen] = useState(false)
  const update = useMutation(api.services.update)
  const remove = useMutation(api.services.remove)

  const setBullet = (i: number, v: string) => {
    const next = [...service.bullets]
    next[i] = v
    update({ id: service._id, bullets: next })
  }
  const addBullet = () =>
    update({ id: service._id, bullets: [...service.bullets, ""] })
  const removeBullet = (i: number) =>
    update({
      id: service._id,
      bullets: service.bullets.filter((_, idx) => idx !== i),
    })

  return (
    <div className="border border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: service.color }}
          />
          <span className="truncate text-sm font-bold">
            {service.name || "Untitled Service"}
          </span>
          <span className="shrink-0 text-2xs tracking-[0.2em] text-white/30 uppercase">
            {service.size}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase transition-colors hover:text-white"
          >
            {open ? "Close" : "Edit"}
          </button>
          <button
            disabled={isFirst}
            onClick={() => onSwap(-1)}
            className="p-1 text-white/30 hover:text-white disabled:opacity-20"
          >
            <ChevronUp size={14} />
          </button>
          <button
            disabled={isLast}
            onClick={() => onSwap(1)}
            className="p-1 text-white/30 hover:text-white disabled:opacity-20"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => remove({ id: service._id })}
            className="p-1 text-white/20 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4">
          <ConvexTextField
            label="Name"
            value={service.name}
            onCommit={(v) => update({ id: service._id, name: v })}
          />

          <div className="border-b border-white/10 py-4">
            <p className="mb-2 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
              Color
            </p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={service.color}
                onChange={(e) =>
                  update({ id: service._id, color: e.target.value })
                }
                className="h-8 w-12 cursor-pointer border border-white/20 bg-transparent"
              />
              <span className="text-xs text-white/40">{service.color}</span>
            </div>
          </div>

          <div className="border-b border-white/10 py-4">
            <p className="mb-2 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
              Size
            </p>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => update({ id: service._id, size: s })}
                  className={`border px-3 py-1.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                    service.size === s
                      ? "border-white bg-white text-black"
                      : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <AdminConvexImageField
            label="Image"
            value={service.image}
            onChange={(v) => v && update({ id: service._id, image: v })}
          />

          <div className="border-b border-white/10 py-4">
            <p className="mb-3 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
              Bullets
            </p>
            {service.bullets.map((bullet, i) => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <BulletInput value={bullet} onCommit={(v) => setBullet(i, v)} />
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
        </div>
      )}
    </div>
  )
}

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

export const ServicesAdmin = () => {
  const services = useQuery(api.services.list)
  const create = useMutation(api.services.create)
  const update = useMutation(api.services.update)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const swap = async (a: Service, b: Service) => {
    await update({ id: a._id, order: b.order })
    await update({ id: b._id, order: a.order })
  }

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> }
      const maxOrder = (services ?? []).reduce(
        (m, s) => Math.max(m, s.order),
        -1,
      )
      await create({
        name: file.name.replace(/\.[^.]+$/, ""),
        image: storageId,
        color: "#FFFFFF",
        bullets: [],
        size: "medium",
        order: maxOrder + 1,
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Services"
        description="Each service appears on the Services page, the homepage Services Carousel, and the Contact form's service dropdown."
      />

      <div className="space-y-3">
        {(services ?? []).map((service, i) => (
          <ServiceEditor
            key={service._id}
            service={service}
            isFirst={i === 0}
            isLast={!services || i === services.length - 1}
            onSwap={(dir) => services && swap(service, services[i + dir])}
          />
        ))}

        <button
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70 disabled:opacity-40"
        >
          <Plus size={12} />
          {uploading ? "Uploading…" : "Add Service"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAddFile}
        />
      </div>
    </div>
  )
}
