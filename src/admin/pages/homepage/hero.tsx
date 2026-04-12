import { BackButton, ReadOnlyFrame, SectionHeader } from "../../components/misc"

export const HeroAdmin = () => (
  <div className="max-w-2xl">
    <BackButton to="/admin/homepage" label="Homepage" />
    <SectionHeader
      title="Hero Banner"
      description="The homepage hero is a 3D animated section. Its metadata labels are shown below for reference only."
    />

    <ReadOnlyFrame label="READ ONLY — NO EDITING">
      <div className="bg-black px-8 py-10 font-sans">
        <div className="flex justify-between text-xs font-bold tracking-[0.35em] text-white/30 uppercase">
          <div>
            Marketing Agency<br />Creative Production
          </div>
          <div className="text-right">
            Social Satisfaction<br />Full-Service Agency
          </div>
        </div>
        <div className="mt-8 flex justify-between text-xs font-bold tracking-[0.35em] text-white/15 uppercase">
          <span>Marketing Agency</span>
          <span>Scroll ↓</span>
        </div>
      </div>
    </ReadOnlyFrame>

    <p className="text-xs text-white/30 leading-relaxed">
      The Hero Banner renders a 3D MacBook scene and is not editable through the CMS. To update the metadata labels, edit <code className="text-white/50">src/pages/home/hero.tsx</code> directly.
    </p>
  </div>
)
