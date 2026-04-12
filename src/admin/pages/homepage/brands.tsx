import { useState } from "react"
import { AdminImageField, AdminTextField } from "../../components/fields"
import { ItemActions, ListEditor } from "../../components/list-editor"
import type { ItemHelpers } from "../../components/list-editor"
import { BackButton, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

type Brand = { name: string; logo?: string }

const BrandCard = ({
  brand,
  index,
  helpers,
}: {
  brand: Brand
  index: number
  helpers: ItemHelpers<Brand>
}) => {
  const [open, setOpen] = useState(helpers.isDraft ?? false)

  return (
    <div className="border border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          {brand.logo && (
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-6 w-10 object-contain opacity-60"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          )}
          <span className="text-sm font-bold truncate">{brand.name || "Untitled"}</span>
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
        <div className="border-t border-white/10 px-4 pb-2">
          <AdminTextField
            label="Brand Name"
            value={brand.name}
            onChange={(v) => helpers.update({ ...brand, name: v })}
          />
          <AdminImageField
            label="Logo URL (optional)"
            value={brand.logo ?? ""}
            onChange={(v) => helpers.update({ ...brand, logo: v || undefined })}
          />
        </div>
      )}
    </div>
  )
}

export const BrandsAdmin = () => {
  const { content, update } = useContent()
  const brands = content.brands

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="Brands Carousel"
        description="The scrolling brand ticker on the homepage. Add, edit, or remove client names."
      />
      <ListEditor
        items={brands}
        onChange={(v) => update("brands", v)}
        onAdd={() => ({ name: "", logo: undefined })}
        addLabel="Add Brand"
        renderItem={(brand, index, helpers) => (
          <BrandCard key={index} brand={brand} index={index} helpers={helpers} />
        )}
      />
    </div>
  )
}
