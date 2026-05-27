import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { AdminConvexImageField } from "../../components/convex-image-field"
import { BackButton, SectionHeader } from "../../components/misc"

export const CampaignAdmin = () => {
  const homepage = useQuery(api.homepage.get)
  const patch = useMutation(api.homepage.patch)

  if (homepage === undefined) return null

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="Campaign Statement"
        description="Edit the centered image behind the 'CAMPAIGNS / BUILT / TO / PERFORM.' headline. The headline text itself is fixed in code."
      />

      <AdminConvexImageField
        label="Centered Image"
        value={(homepage?.campaignImage as Id<"_storage"> | undefined) ?? null}
        onChange={(v) => {
          if (v) patch({ campaignImage: v })
        }}
      />
    </div>
  )
}
