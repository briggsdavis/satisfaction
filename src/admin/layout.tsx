import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"
import {
  CircleHelp,
  ExternalLink,
  FolderOpen,
  History,
  Home,
  Inbox,
  Info,
  LayoutGrid,
  LogOut,
  Mail,
  Moon,
  RotateCw,
  Settings,
  Shapes,
  Sun,
} from "lucide-react"
import { createContext, use, useEffect, useState } from "react"
import { Link, NavLink, Outlet } from "react-router"
import { api } from "../../convex/_generated/api"

type Theme = "dark" | "light"

const NAV = [
  { to: "/admin", label: "Dashboard", icon: Home, end: true },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
  { to: "/admin/homepage", label: "Homepage", icon: LayoutGrid },
  { to: "/admin/logos", label: "Logos", icon: Shapes },
  { to: "/admin/about", label: "About", icon: Info },
  { to: "/admin/wheel", label: "Wheel", icon: RotateCw },
  { to: "/admin/timeline", label: "Timeline", icon: History },
  { to: "/admin/services", label: "Services", icon: Settings },
  { to: "/admin/projects", label: "Projects", icon: FolderOpen },
  { to: "/admin/faq", label: "FAQ", icon: CircleHelp },
  { to: "/admin/contact", label: "Contact & Footer", icon: Mail },
]

const topLink =
  "flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-ink/50 uppercase transition-colors hover:text-ink"

// [theme, setTheme], shared by the shell and the topbar toggle.
const ThemeContext = createContext<[Theme, (t: Theme) => void]>(["dark", () => {}])

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem("admin-theme") === "light" ? "light" : "dark",
  )
  useEffect(() => localStorage.setItem("admin-theme", theme), [theme])
  return (
    <div className="admin-shell bg-paper text-[0.95rem] text-ink" data-theme={theme}>
      <ThemeContext value={[theme, setTheme]}>{children}</ThemeContext>
    </div>
  )
}

const Topbar = () => {
  const { signOut } = useAuthActions()
  const [theme, setTheme] = use(ThemeContext)
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink/15 px-6">
      <img
        src="/brand/logo.png"
        alt="Social Satisfaction"
        className="admin-brand-logo h-7 w-auto"
      />
      <div className="flex items-center gap-5">
        <Link to="/" target="_blank" rel="noopener noreferrer" className={topLink}>
          <ExternalLink size={12} /> View Site
        </Link>
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={topLink}
        >
          {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <button type="button" onClick={() => void signOut()} className={topLink}>
          <LogOut size={12} /> Sign Out
        </button>
      </div>
    </header>
  )
}

export const AdminLayout = () => {
  const unread = useQuery(api.leads.unread) ?? 0
  return (
    <AdminShell>
      <div className="flex h-screen flex-col overflow-hidden">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-56 shrink-0 overflow-y-auto border-r border-ink/15 px-3 py-6">
            <nav className="space-y-0.5">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                      isActive ? "bg-ink text-paper" : "text-ink/60 hover:bg-ink/5 hover:text-ink"
                    }`
                  }
                >
                  <Icon size={14} />
                  <span className="flex-1">{label}</span>
                  {to === "/admin/leads" && unread > 0 && (
                    <span className="bg-red-500 px-1.5 text-2xs text-white">
                      {unread >= 100 ? "99+" : unread}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </aside>
          <main className="flex-1 overflow-y-auto p-12 max-lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminShell>
  )
}
