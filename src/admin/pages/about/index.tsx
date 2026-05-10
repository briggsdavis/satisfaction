import { Link } from "react-router"
import { SectionHeader } from "../../components/misc"

const sections = [
  {
    to: "wheel",
    label: "Wheel Section",
    description: "Auto-numbered Who/How/What pinned scroll items",
  },
  {
    to: "timeline",
    label: "Past Projects Timeline",
    description: "Horizontal-scroll past projects and clients",
  },
  {
    to: "values",
    label: "Values",
    description: "Three value cards (image + label + body)",
  },
]

export const AboutIndex = () => (
  <div className="max-w-2xl">
    <SectionHeader title="About" description="Manage the About page content." />
    <div className="space-y-0">
      {sections.map(({ to, label, description }) => (
        <Link
          key={to}
          to={to}
          className="-mx-2 flex items-center justify-between border-b border-white/10 px-2 py-5 transition-colors hover:bg-white/5"
        >
          <div>
            <p className="text-sm font-bold">{label}</p>
            <p className="mt-0.5 text-xs text-white/40">{description}</p>
          </div>
          <span className="text-white/30">→</span>
        </Link>
      ))}
    </div>
  </div>
)
