import { Link } from "react-router"
import { useContent } from "../context/content-context"

export const Dashboard = () => {
  const { content } = useContent()

  const stats = [
    { label: "Categories", count: content.categories.length, to: "/admin/portfolio" },
    { label: "Projects", count: content.categories.reduce((n, c) => n + c.projects.length, 0), to: "/admin/portfolio" },
    { label: "Services", count: content.services.length, to: "/admin/services" },
    { label: "Brands", count: content.brands.length, to: "/admin/homepage" },
    { label: "FAQ Sections", count: content.faqSections.length, to: "/admin/contact" },
    { label: "FAQ Items", count: content.faqSections.reduce((n, s) => n + s.items.length, 0), to: "/admin/contact" },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-10 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight uppercase">Dashboard</h1>
        <p className="mt-2 text-sm text-white/40">
          All edits are stored locally in this browser. Changes do not affect the live site until deployed.
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
            <p className="mt-1 text-xs font-bold tracking-[0.25em] text-white/40 uppercase">{label}</p>
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase mb-4">Quick Links</p>
        {[
          { to: "/admin/homepage", label: "Homepage Sections" },
          { to: "/admin/about", label: "About Page" },
          { to: "/admin/services", label: "Services" },
          { to: "/admin/portfolio", label: "Portfolio & Projects" },
          { to: "/admin/contact", label: "Contact & FAQ" },
          { to: "/admin/footer", label: "Footer" },
          { to: "/admin/seo", label: "SEO & Meta Tags" },
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
