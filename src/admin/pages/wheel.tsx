import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { MediaField, OrderedList, Page, TextField } from "../ui"

export const WheelAdmin = () => {
  const items = useQuery(api.wheel.list) ?? []
  const create = useMutation(api.wheel.create)
  const update = useMutation(api.wheel.update)
  const remove = useMutation(api.wheel.remove)
  const reorder = useMutation(api.wheel.reorder)

  return (
    <Page
      title="Wheel"
      description="Pinned scroll section on the About page. Items auto-number in display order."
    >
      <OrderedList
        items={items}
        title={(item) => item.heading || "Untitled"}
        onReorder={(ids) => reorder({ ids })}
        onRemove={(item) => remove({ id: item._id })}
        onAdd={() => create()}
        addLabel="Add item"
      >
        {(item) => (
          <>
            <TextField
              label="Heading"
              value={item.heading}
              onCommit={(heading) => update({ id: item._id, patch: { heading } })}
            />
            <TextField
              label="Body"
              multiline
              value={item.body}
              onCommit={(body) => update({ id: item._id, patch: { body } })}
            />
            <MediaField
              label="Image"
              hint="4:5 portrait"
              url={item.imageUrl}
              removable={false}
              onChange={async (image) => image && update({ id: item._id, patch: { image } })}
            />
          </>
        )}
      </OrderedList>
    </Page>
  )
}
