import { useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useRef, useState } from "react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { AdminConvexImageField } from "../../components/convex-image-field"
import { ConvexTextField } from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"

type Carousel = "collaboration" | "work"
type LogoId = Id<"collaborationLogos"> | Id<"workLogos">
type Logo = {
  _id: LogoId
  image: Id<"_storage">
  alt: string
  order: number
}

const CarouselEditor = ({
  carousel,
  title,
  description,
}: {
  carousel: Carousel
  title: string
  description: string
}) => {
  const logos = useQuery(api.logos.list, { carousel }) as Logo[] | undefined
  const add = useMutation(api.logos.add)
  const update = useMutation(api.logos.update)
  const remove = useMutation(api.logos.remove)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const swap = async (a: Logo, b: Logo) => {
    await update({ carousel, id: a._id, order: b.order })
    await update({ carousel, id: b._id, order: a.order })
  }

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (files.length === 0) return
    setUploading(true)
    try {
      const baseOrder = (logos ?? []).reduce((m, l) => Math.max(m, l.order), -1) + 1
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const uploadUrl = await generateUploadUrl()
          const res = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          })
          const { storageId } = (await res.json()) as {
            storageId: Id<"_storage">
          }
          return { storageId, name: file.name.replace(/\.[^.]+$/, "") }
        }),
      )
      await Promise.all(
        uploaded.map((u, i) =>
          add({
            carousel,
            image: u.storageId,
            alt: u.name,
            order: baseOrder + i,
          }),
        ),
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-12">
      <p className="mb-1 text-xs font-bold tracking-[0.3em] text-white/50 uppercase">{title}</p>
      <p className="mb-4 text-xs text-white/30">{description}</p>

      <div className="space-y-3">
        {(logos ?? []).map((logo, i) => (
          <div key={logo._id} className="border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <span className="truncate text-sm">{logo.alt || "Untitled"}</span>
              <div className="flex items-center gap-1">
                <button
                  disabled={i === 0}
                  onClick={() => logos && swap(logo, logos[i - 1])}
                  className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  disabled={!logos || i === logos.length - 1}
                  onClick={() => logos && swap(logo, logos[i + 1])}
                  className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => remove({ id: logo._id })}
                  className="p-1 text-white/20 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="px-4 pb-2">
              <ConvexTextField
                label="Alt Text"
                value={logo.alt}
                onCommit={(v) => update({ carousel, id: logo._id, alt: v })}
              />
              <AdminConvexImageField
                label="Logo Image"
                aspectHint="not cropped — scaled to fit a ~160×56 box; any aspect ratio works (transparent PNG recommended)"
                value={logo.image}
                onChange={(v) => v && update({ carousel, id: logo._id, image: v })}
              />
            </div>
          </div>
        ))}
        <button
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase transition-colors hover:border-white/40 hover:text-white/70 disabled:opacity-40"
        >
          <Plus size={12} />
          {uploading ? "Uploading…" : "Add Logo"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          aria-label="Upload brand logos"
          className="hidden"
          onChange={handleAddFile}
        />
      </div>
    </div>
  )
}

export const BrandsAdmin = () => (
  <div className="max-w-2xl">
    <BackButton to="/admin/homepage" label="Homepage" />
    <SectionHeader
      title="Logo Carousels"
      description="Both homepage logo carousels. Each is an independent list."
    />

    <CarouselEditor
      carousel="collaboration"
      title="Collaborations Carousel"
      description="The first carousel ('Brands & creative teams we've worked with')."
    />
    <CarouselEditor
      carousel="work"
      title="Our Work Carousel"
      description="The second carousel ('Logos we've designed')."
    />
  </div>
)
