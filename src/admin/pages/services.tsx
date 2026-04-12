import { useState } from "react"
import { AdminImageField, AdminTextareaField, AdminTextField } from "../components/fields"
import { ItemActions, ListEditor } from "../components/list-editor"
import type { ItemHelpers } from "../components/list-editor"
import { RouteBadge, SectionHeader } from "../components/misc"
import { useContent } from "../context/content-context"
import type { AdminContent } from "../context/content-context"

type Service = AdminContent["services"][number]

const newService = (): Service => ({
  name: "",
  tag: "",
  desc: "",
  bullets: [""],
  inverted: false,
  minH: "min-h-[360px]",
  gridImg: "",
  gridRotate: 0,
  gridDelay: 0,
})

const ServiceEditor = ({
  service,
  helpers,
}: {
  service: Service
  helpers: ItemHelpers<Service>
}) => {
  const [open, setOpen] = useState(helpers.isDraft ?? false)

  const set = (key: keyof Service, value: unknown) =>
    helpers.update({ ...service, [key]: value })

  const setBullet = (i: number, v: string) => {
    const next = [...service.bullets]
    next[i] = v
    set("bullets", next)
  }

  const addBullet = () => set("bullets", [...service.bullets, ""])
  const removeBullet = (i: number) => set("bullets", service.bullets.filter((_, idx) => idx !== i))

  return (
    <div className="border border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <span className="text-sm font-bold truncate block">{service.name || "Untitled Service"}</span>
          <span className="text-xs text-white/40">{service.tag}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!helpers.isDraft && (
            <>
              <button
                onClick={() => setOpen((o) => !o)}
                className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase hover:text-white transition-colors"
              >
                {open ? "Close" : "Edit"}
              </button>
              <ItemActions
                onMoveUp={helpers.moveUp}
                onMoveDown={helpers.moveDown}
                onRemove={helpers.remove}
                isFirst={helpers.isFirst}
                isLast={helpers.isLast}
              />
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4">
          <AdminTextField label="Name" value={service.name} onChange={(v) => set("name", v)} />
          <AdminTextField label="Tag" value={service.tag} onChange={(v) => set("tag", v)} />
          <AdminTextareaField label="Description" value={service.desc} onChange={(v) => set("desc", v)} rows={3} />

          <div className="border-b border-white/10 py-4">
            <label className="mb-3 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
              Bullet Points
            </label>
            {service.bullets.map((bullet, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => setBullet(i, e.target.value)}
                  className="flex-1 border-b border-white/20 bg-transparent pb-1 text-sm text-white outline-none focus:border-white/50"
                />
                <button
                  onClick={() => removeBullet(i)}
                  className="text-white/20 hover:text-red-400 transition-colors text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addBullet}
              className="mt-2 text-xs font-bold tracking-[0.2em] text-white/30 uppercase hover:text-white transition-colors"
            >
              + Add Bullet
            </button>
          </div>

          <AdminImageField label="Homepage Grid Image" value={service.gridImg} onChange={(v) => set("gridImg", v)} />

          <div className="flex gap-4">
            <div className="flex-1">
              <AdminTextField
                label="Grid Rotation (deg)"
                value={String(service.gridRotate)}
                onChange={(v) => set("gridRotate", parseFloat(v) || 0)}
                type="number"
              />
            </div>
            <div className="flex-1">
              <AdminTextField
                label="Grid Delay (s)"
                value={String(service.gridDelay)}
                onChange={(v) => set("gridDelay", parseFloat(v) || 0)}
                type="number"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-4 border-b border-white/10">
            <label className="text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
              Inverted (white bg)
            </label>
            <button
              onClick={() => set("inverted", !service.inverted)}
              className={`h-5 w-9 transition-colors ${service.inverted ? "bg-white" : "bg-white/20"}`}
            />
          </div>

          <RouteBadge routes={["Homepage Services Scroll", "Services Page"]} />
        </div>
      )}
    </div>
  )
}

export const ServicesAdmin = () => {
  const { content, update } = useContent()

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Services"
        description="Each service appears on both the Homepage Services Scroll and the Services page."
      />
      <ListEditor
        items={content.services}
        onChange={(v) => update("services", v)}
        onAdd={newService}
        addLabel="Add Service"
        renderItem={(service, index, helpers) => (
          <ServiceEditor key={index} service={service} helpers={helpers} />
        )}
      />
    </div>
  )
}
