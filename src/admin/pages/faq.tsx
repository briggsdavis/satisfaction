import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { OrderedList, Page, TextField } from "../ui"

export const FaqAdmin = () => {
  const sections = useQuery(api.faq.list) ?? []
  const createSection = useMutation(api.faq.createSection)
  const updateSection = useMutation(api.faq.updateSection)
  const removeSection = useMutation(api.faq.removeSection)
  const reorderSections = useMutation(api.faq.reorderSections)
  const createItem = useMutation(api.faq.createItem)
  const updateItem = useMutation(api.faq.updateItem)
  const removeItem = useMutation(api.faq.removeItem)
  const reorderItems = useMutation(api.faq.reorderItems)

  return (
    <Page
      title="FAQ"
      description="Sections alternate light and dark on the About page, in display order."
    >
      <OrderedList
        items={sections}
        defaultOpen
        title={(s) => `${s.name || "Untitled section"} · ${s.items.length}`}
        onReorder={(ids) => reorderSections({ ids })}
        onRemove={(s) => removeSection({ id: s._id })}
        onAdd={() => createSection()}
        addLabel="Add section"
      >
        {(section) => (
          <div className="space-y-3 pb-3">
            <TextField
              label="Section name"
              value={section.name}
              onCommit={(name) => updateSection({ id: section._id, patch: { name } })}
            />
            <OrderedList
              items={section.items}
              title={(item) => item.question || "Untitled"}
              onReorder={(ids) => reorderItems({ ids })}
              onRemove={(item) => removeItem({ id: item._id })}
              confirmRemove={false}
              onAdd={() => createItem({ sectionId: section._id })}
              addLabel="Add question"
            >
              {(item) => (
                <>
                  <TextField
                    label="Question"
                    value={item.question}
                    onCommit={(question) => updateItem({ id: item._id, patch: { question } })}
                  />
                  <TextField
                    label="Answer"
                    multiline
                    rows={3}
                    value={item.answer}
                    onCommit={(answer) => updateItem({ id: item._id, patch: { answer } })}
                  />
                </>
              )}
            </OrderedList>
          </div>
        )}
      </OrderedList>
    </Page>
  )
}
