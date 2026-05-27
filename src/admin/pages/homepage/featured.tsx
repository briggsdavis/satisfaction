import { Link } from "react-router"
import { BackButton, SectionHeader } from "../../components/misc"

export const FeaturedAdmin = () => (
  <div className="max-w-2xl">
    <BackButton to="/admin/homepage" label="Homepage" />
    <SectionHeader
      title="Featured Projects"
      description="The homepage Featured Cascade renders every project with the 'Featured' flag turned on. Manage that flag from the Portfolio editor."
    />
    <Link
      to="/admin/portfolio"
      className="inline-block border border-white/20 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white/70 uppercase transition-colors hover:border-white hover:text-white"
    >
      Open Portfolio →
    </Link>
  </div>
)
