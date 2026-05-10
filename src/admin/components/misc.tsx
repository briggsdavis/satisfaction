import { ChevronLeft } from "lucide-react"
import { Link } from "react-router"

export const BackButton = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="mb-6 flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-white/40 uppercase transition-colors hover:text-white"
  >
    <ChevronLeft size={13} />
    {label}
  </Link>
)

export const SectionHeader = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => (
  <div className="mb-8 border-b border-white/10 pb-6">
    <h2 className="font-display text-2xl font-bold tracking-tight uppercase">
      {title}
    </h2>
    {description && <p className="mt-2 text-sm text-white/50">{description}</p>}
  </div>
)
