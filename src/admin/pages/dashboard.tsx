import { useQuery } from "convex/react"
import { Link } from "react-router"
import { api } from "../../../convex/_generated/api"

export const Dashboard = () => {
  const categories = useQuery(api.portfolio.listCategories) ?? []
  const projects = useQuery(api.portfolio.listProjects) ?? []
  const services = useQuery(api.services.list) ?? []
  const collaborationLogos =
    useQuery(api.logos.list, { carousel: "collaboration" }) ?? []
  const workLogos = useQuery(api.logos.list, { carousel: "work" }) ?? []
  const faqSections = useQuery(api.contact.listFaqSections) ?? []

  const stats = [
    {
      label: "Categories",
      count: categories.length,
      to: "/admin/portfolio",
    },
    {
      label: "Projects",
      count: projects.length,
      to: "/admin/portfolio",
    },
    {
      label: "Services",
      count: services.length,
      to: "/admin/services",
    },
    {
      label: "Logos",
      count: collaborationLogos.length + workLogos.length,
      to: "/admin/homepage",
    },
    {
      label: "FAQ Sections",
      count: faqSections.length,
      to: "/admin/contact",
    },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-10 border-b border-white/10 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight uppercase">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-white/40">
          All edits save instantly to Convex and appear live on the site.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map(({ label, count, to }) => (
          <Link
            key={label}
            to={to}
            className="border border-white/10 p-6 transition-colors hover:border-white/30"
          >
            <p className="text-3xl font-bold">{count}</p>
            <p className="mt-1 text-xs font-bold tracking-[0.25em] text-white/40 uppercase">
              {label}
            </p>
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Quick Links
        </p>
        {[
          { to: "/admin/homepage", label: "Homepage Sections" },
          { to: "/admin/about", label: "About Page" },
          { to: "/admin/services", label: "Services" },
          { to: "/admin/portfolio", label: "Portfolio & Projects" },
          { to: "/admin/contact", label: "Contact & FAQ" },
          { to: "/admin/footer", label: "Footer" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-white/60 transition-colors hover:text-white"
          >
            {label}
            <span className="text-white/20">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
