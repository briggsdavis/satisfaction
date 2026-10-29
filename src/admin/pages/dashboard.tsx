import { useQuery } from "convex/react"
import { Link } from "react-router"
import { api } from "../../../convex/_generated/api"
import { Page } from "../ui"

export const Dashboard = () => {
  const stats = [
    { label: "Unread leads", count: useQuery(api.leads.unread), to: "/admin/leads" },
    { label: "Services", count: useQuery(api.services.list)?.length, to: "/admin/services" },
    { label: "Projects", count: useQuery(api.projects.list)?.length, to: "/admin/projects" },
    {
      label: "Logos",
      count:
        (useQuery(api.logos.list, { carousel: "collaboration" })?.length ?? 0) +
        (useQuery(api.logos.list, { carousel: "work" })?.length ?? 0),
      to: "/admin/logos",
    },
    { label: "FAQ sections", count: useQuery(api.faq.list)?.length, to: "/admin/faq" },
  ]

  return (
    <Page title="Dashboard" description="Edits save instantly and appear live on the site.">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map(({ label, count, to }) => (
          <Link
            key={label}
            to={to}
            className="border border-ink/15 p-6 transition-colors hover:border-ink/40"
          >
            <p className="text-3xl font-bold">{count ?? "–"}</p>
            <p className="mt-1 text-xs font-bold tracking-[0.25em] text-ink/50 uppercase">
              {label}
            </p>
          </Link>
        ))}
      </div>
    </Page>
  )
}
