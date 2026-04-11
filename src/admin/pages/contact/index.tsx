import { Link } from "react-router"
import { SectionHeader } from "../../components/misc"

export const ContactIndex = () => (
  <div className="max-w-2xl">
    <SectionHeader title="Contact" description="Manage contact information and FAQ content." />
    <div className="space-y-0">
      {[
        { to: "info", label: "Contact Information", description: "Email, phone, location, Instagram — fixed fields, editable content" },
        { to: "faq", label: "FAQ Builder", description: "Add, edit, remove, and reorder FAQ sections and questions" },
      ].map(({ to, label, description }) => (
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
