import { useMutation, useQuery } from "convex/react"
import { useNavigate } from "react-router"
import { api } from "../../../convex/_generated/api"
import { AddButton, OrderedList, Page } from "../ui"

export const ServicesAdmin = () => {
  const services = useQuery(api.services.list) ?? []
  const create = useMutation(api.services.create)
  const remove = useMutation(api.services.remove)
  const reorder = useMutation(api.services.reorder)
  const navigate = useNavigate()

  return (
    <Page
      title="Services"
      description="Shown on Services, Portfolio, the homepage carousel, and the contact dropdown. Each has a page at /portfolio/[slug]."
    >
      <OrderedList
        items={services}
        title={(s) => (
          <span className="flex items-center gap-3">
            <span className="h-3 w-3 shrink-0" style={{ backgroundColor: s.color }} />
            {s.name || "Untitled"}
            <span className="font-mono text-xs font-normal text-ink/40">/{s.slug}</span>
          </span>
        )}
        onReorder={(ids) => reorder({ ids })}
        onRemove={(s) => remove({ id: s._id })}
        href={(s) => s._id}
      />
      <div className="mt-3">
        <AddButton onClick={async () => navigate(await create())}>Add service</AddButton>
      </div>
    </Page>
  )
}
