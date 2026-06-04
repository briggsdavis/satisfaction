import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { AdminConvexVideoField } from "../../components/convex-video-field"
import { BackButton, SectionHeader } from "../../components/misc"

export const HeroVideoAdmin = () => {
  const homepage = useQuery(api.homepage.get)
  const patch = useMutation(api.homepage.patch)

  if (homepage === undefined) return null

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="Hero — iMac Screen Video"
        description="The video that plays on the 3D iMac's screen in the hero. Use a muted, looping clip. Leave empty to use the built-in default."
      />

      <AdminConvexVideoField
        label="Screen Video"
        hint="Recommended: H.264 MP4, ~1920×1080, a few MB. It autoplays muted and loops."
        value={(homepage?.heroVideo as Id<"_storage"> | undefined) ?? null}
        onChange={(v) => {
          if (v) patch({ heroVideo: v })
          else patch({ clearHeroVideo: true })
        }}
      />
    </div>
  )
}
