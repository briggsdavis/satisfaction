import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { ConvexTextareaField } from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"

export const FaqCtaAdmin = () => {
  const homepage = useQuery(api.homepage.get)
  const patch = useMutation(api.homepage.patch)

  if (homepage === undefined) return null

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="FAQ CTA"
        description="The body paragraph in the homepage FAQ call-to-action section. The eyebrow ('Got Questions') and 'FAQ' heading are fixed in code."
      />
      <ConvexTextareaField
        label="Body Text"
        value={homepage?.faqCtaBody ?? ""}
        onCommit={(v) => patch({ faqCtaBody: v })}
        rows={4}
      />
    </div>
  )
}
