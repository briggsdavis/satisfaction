import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { ConvexTextField } from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"

export const ContactInfoAdmin = () => {
  const info = useQuery(api.contact.getInfo)
  const patch = useMutation(api.contact.patchInfo)

  if (info === undefined) return null

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/contact" label="Contact" />
      <SectionHeader
        title="Contact Information"
        description="Single source of truth for the contact sidebar and footer social links. Handles only — URLs are constructed in code."
      />
      <ConvexTextField
        label="Email"
        value={info?.email ?? ""}
        onCommit={(v) => patch({ email: v })}
      />
      <ConvexTextField
        label="Phone"
        value={info?.phone ?? ""}
        onCommit={(v) => patch({ phone: v })}
      />
      <ConvexTextField
        label="Location"
        value={info?.location ?? ""}
        onCommit={(v) => patch({ location: v })}
      />
      <ConvexTextField
        label="Instagram handle (no @)"
        value={info?.instagram ?? ""}
        onCommit={(v) => patch({ instagram: v.replace(/^@/, "") })}
      />
      <ConvexTextField
        label="TikTok handle (no @)"
        value={info?.tiktok ?? ""}
        onCommit={(v) => patch({ tiktok: v.replace(/^@/, "") })}
      />
      <ConvexTextField
        label="LinkedIn URL"
        value={info?.linkedin ?? ""}
        onCommit={(v) => patch({ linkedin: v })}
      />
      <ConvexTextField
        label="YouTube handle"
        value={info?.youtube ?? ""}
        onCommit={(v) => patch({ youtube: v.replace(/^@/, "") })}
      />
    </div>
  )
}
