import {
  FileText,
  Globe,
  Home,
  Image,
  Info,
  LayoutGrid,
  Mail,
  Settings,
} from "lucide-react"
import { NavLink } from "react-router"

const links = [
  { to: "/admin", label: "Dashboard", icon: Home, end: true },
  { to: "/admin/homepage", label: "Homepage", icon: LayoutGrid },
  { to: "/admin/about", label: "About", icon: Info },
  { to: "/admin/services", label: "Services", icon: Settings },
  { to: "/admin/portfolio", label: "Portfolio", icon: Image },
  { to: "/admin/contact", label: "Contact", icon: Mail },
  { to: "/admin/footer", label: "Footer", icon: FileText },
  { to: "/admin/seo", label: "SEO", icon: Globe },
]

export const AdminSidebar = () => (
  <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-black">
    <div className="flex-1 overflow-y-auto py-6">
      <nav className="space-y-0.5 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                isActive
                  ? "bg-white text-black"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  </aside>
)
