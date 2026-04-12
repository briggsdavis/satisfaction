import { AdminTextField } from "../../components/fields"
import { BackButton, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

// Fixed fields — editable content but the fields themselves cannot be removed
export const ContactInfoAdmin = () => {
  const { content, update } = useContent()
  const info = content.contactInfo

  const set = (key: keyof typeof info, value: string) =>
    update("contactInfo", { ...info, [key]: value })

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/contact" label="Contact" />
      <SectionHeader
        title="Contact Information"
        description="These fields are fixed. You can edit the content but cannot remove the fields."
      />
      <AdminTextField label="Email" value={info.email} onChange={(v) => set("email", v)} type="email" />
      <AdminTextField label="Phone" value={info.phone} onChange={(v) => set("phone", v)} type="tel" />
      <AdminTextField label="Location" value={info.location} onChange={(v) => set("location", v)} />
      <AdminTextField label="Instagram Handle" value={info.instagram} onChange={(v) => set("instagram", v)} />
    </div>
  )
}
