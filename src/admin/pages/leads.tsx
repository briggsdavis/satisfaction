import { useMutation, useQuery } from "convex/react"
import { Trash2 } from "lucide-react"
import { api } from "../../../convex/_generated/api"
import { Page } from "../ui"

const when = (t: number) =>
  new Date(t).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })

export const LeadsAdmin = () => {
  const leads = useQuery(api.leads.list)
  const setRead = useMutation(api.leads.setRead)
  const remove = useMutation(api.leads.remove)

  return (
    <Page title="Leads" description="Contact form and branding brief submissions, newest first.">
      {leads?.length === 0 && <p className="text-sm text-ink/50">No submissions yet.</p>}
      <div className="space-y-3">
        {leads?.map((lead) => (
          <article
            key={lead._id}
            className={`border p-5 ${lead.read ? "border-ink/10 opacity-70" : "border-ink/30"}`}
          >
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">
                  {lead.name}{" "}
                  <a href={`mailto:${lead.email}`} className="font-normal text-ink/60 underline">
                    {lead.email}
                  </a>
                </p>
                <p className="text-xs tracking-[0.2em] text-ink/50 uppercase">
                  {lead.kind === "branding" ? "Branding brief" : "Contact"} ·{" "}
                  {when(lead._creationTime)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => void setRead({ id: lead._id, read: !lead.read })}
                  className="font-bold tracking-[0.2em] text-ink/60 uppercase hover:text-ink"
                >
                  Mark {lead.read ? "unread" : "read"}
                </button>
                <button
                  type="button"
                  aria-label="Delete lead"
                  onClick={() => confirm("Delete this lead?") && void remove({ id: lead._id })}
                  className="text-ink/40 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </header>
            <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-2 text-sm">
              {Object.entries(lead.fields).map(([key, value]) => (
                <div key={key} className="contents">
                  <dt className="text-ink/50 capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                  <dd className="whitespace-pre-line">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </Page>
  )
}
