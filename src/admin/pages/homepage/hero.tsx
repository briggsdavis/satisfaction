import { AdminTextField, AdminTextareaField } from "../../components/fields"
import { BackButton, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

export const HeroAdmin = () => {
  const { content, update } = useContent()
  const hero = content.hero

  const set = (key: keyof typeof hero, value: string) =>
    update("hero", { ...hero, [key]: value })

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="Hero Banner — Labels"
        description="Edit the metadata text labels that frame the 3D hero. The 3D scene itself is not editable here."
      />

      <div className="mb-6 border border-white/10 bg-black px-6 py-5">
        <p className="mb-4 text-2xs font-bold tracking-[0.3em] text-white/20 uppercase">
          Preview
        </p>
        <div className="flex justify-between text-xs font-bold tracking-[0.35em] text-white/30 uppercase">
          <div className="whitespace-pre-line">{hero.topLeft || "—"}</div>
          <div className="text-right whitespace-pre-line">
            {hero.topRight || "—"}
          </div>
        </div>
        <div className="mt-6 flex justify-between text-xs font-bold tracking-[0.35em] text-white/15 uppercase">
          <span>{hero.bottomLeft || "—"}</span>
          <span>Scroll ↓</span>
        </div>
      </div>

      <AdminTextareaField
        label="Top Left (each line = one row of text)"
        value={hero.topLeft}
        onChange={(v) => set("topLeft", v)}
        placeholder={"Marketing Agency\nCreative Production"}
        rows={2}
      />
      <AdminTextareaField
        label="Top Right (each line = one row of text)"
        value={hero.topRight}
        onChange={(v) => set("topRight", v)}
        placeholder={"Social Satisfaction\nFull-Service Agency"}
        rows={2}
      />
      <AdminTextField
        label="Bottom Left"
        value={hero.bottomLeft}
        onChange={(v) => set("bottomLeft", v)}
        placeholder="Marketing Agency"
      />

      <p className="mt-6 text-xs leading-relaxed text-white/25">
        "Scroll ↓" on the bottom right is fixed and cannot be edited.
      </p>
    </div>
  )
}
