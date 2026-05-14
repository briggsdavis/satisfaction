import { useMutation, useQuery } from "convex/react"
import { Link } from "react-router"
import { api } from "../../../convex/_generated/api"
import { ConvexTextareaField } from "../components/convex-text-field"
import { SectionHeader } from "../components/misc"

export const FooterAdmin = () => {
  const footer = useQuery(api.footer.get)
  const patch = useMutation(api.footer.patch)

  if (footer === undefined) return null

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Footer"
        description="The description paragraph that appears in the footer. Email and social links are managed under Contact (single source of truth)."
      />

      <ConvexTextareaField
        label="Description"
        value={footer?.description ?? ""}
        onCommit={(v) => patch({ description: v })}
        rows={4}
      />

      <p className="mt-6 text-xs leading-relaxed text-white/40">
        Footer email and social links are pulled from{" "}
        <Link
          to="/admin/contact/info"
          className="text-white/70 underline hover:text-white"
        >
          Contact → Information
        </Link>
        . Edit them there.
      </p>
    </div>
  )
}
