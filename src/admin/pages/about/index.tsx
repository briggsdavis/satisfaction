import { Link } from "react-router"
import { SectionHeader } from "../../components/misc"

const sections = [
  { to: "body", label: "Body Copy", description: "Three animated intro paragraphs" },
  { to: "timeline", label: "Timeline", description: "Past projects & clients — edit only" },
  { to: "values", label: "Values", description: "Culture, Dynamics, Creativity cards — edit only" },
]

export const AboutIndex = () => (
  <div className="max-w-2xl">
    <SectionHeader title="About" description="Manage the About page content." />
    <div className="space-y-0">
      {sections.map(({ to, label, description }) => (
        <Link
          key={to}
          to={to}
          className="flex items-center justify-between border-b border-white/10 py-5 px-2 -mx-2 transition-colors hover:bg-white/5"
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
