import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { OrderedList, Page, TextField } from "../ui"

const FIELDS = [
  ["date", "Date (e.g. 2024-2025)"],
  ["client", "Client"],
  ["campaign", "Campaign (optional)"],
  ["role", "Role"],
  ["description", "Description"],
] as const

export const TimelineAdmin = () => {
  const items = useQuery(api.timeline.list) ?? []
  const create = useMutation(api.timeline.create)
  const update = useMutation(api.timeline.update)
  const remove = useMutation(api.timeline.remove)
  const reorder = useMutation(api.timeline.reorder)

  return (
    <Page title="Timeline" description="Horizontal-scroll past projects on the About page.">
      <OrderedList
        items={items}
        title={(item) => `${item.client || "Untitled"}${item.date ? ` · ${item.date}` : ""}`}
        onReorder={(ids) => reorder({ ids })}
        onRemove={(item) => remove({ id: item._id })}
        onAdd={() => create()}
        addLabel="Add entry"
      >
        {(item) =>
          FIELDS.map(([key, label]) => (
            <TextField
              key={key}
              label={label}
              multiline={key === "description"}
              value={item[key] ?? ""}
              onCommit={(value) => update({ id: item._id, patch: { [key]: value } })}
            />
          ))
        }
      </OrderedList>
    </Page>
  )
}
