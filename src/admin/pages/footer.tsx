import { AdminTextField, AdminTextareaField } from "../components/fields"
import { ItemActions, ListEditor } from "../components/list-editor"
import { SectionHeader } from "../components/misc"
import { useContent } from "../context/content-context"
import type { AdminContent } from "../context/content-context"

type SocialLink = AdminContent["footer"]["socialLinks"][number]

export const FooterAdmin = () => {
  const { content, update } = useContent()
  const footer = content.footer

  const set = (key: keyof typeof footer, value: unknown) =>
    update("footer", { ...footer, [key]: value })

  return (
    <div className="max-w-2xl">
      <SectionHeader title="Footer" description="Footer description, contact email, and social links." />

      <AdminTextareaField
        label="Description"
        value={footer.description}
        onChange={(v) => set("description", v)}
        rows={3}
      />
      <AdminTextField
        label="Contact Email"
        value={footer.email}
        onChange={(v) => set("email", v)}
        type="email"
      />

      <div className="mt-6">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">Social Links</p>
        <ListEditor<SocialLink>
          items={footer.socialLinks}
          onChange={(v) => set("socialLinks", v)}
          onAdd={() => ({ label: "", href: "" })}
          addLabel="Add Social Link"
          renderItem={(link, index, helpers) => (
            <div key={index} className="border border-white/10 p-4 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/60">{link.label || "New Link"}</span>
                <ItemActions
                  onMoveUp={helpers.moveUp}
                  onMoveDown={helpers.moveDown}
                  onRemove={helpers.remove}
                  isFirst={helpers.isFirst}
                  isLast={helpers.isLast}
                />
              </div>
              <AdminTextField label="Label" value={link.label} onChange={(v) => helpers.update({ ...link, label: v })} />
              <AdminTextField label="URL" value={link.href} onChange={(v) => helpers.update({ ...link, href: v })} type="url" />
            </div>
          )}
        />
      </div>
    </div>
  )
}
