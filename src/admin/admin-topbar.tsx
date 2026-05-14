import { ExternalLink } from "lucide-react"
import { Link } from "react-router"

export const AdminTopbar = () => (
  <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-black px-6">
    <div className="flex items-center gap-4">
      <img
        src="/logo/satisfaction.png"
        alt="Social Satisfaction"
        className="h-7 w-auto"
      />
    </div>

    <div className="flex items-center gap-3">
      <Link
        to="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-white/40 uppercase transition-colors hover:text-white"
      >
        <ExternalLink size={12} className="relative -top-0.5" />
        View Site
      </Link>
    </div>
  </header>
)
