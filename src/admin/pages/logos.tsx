import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../../convex/_generated/api"
import type { Carousel } from "../../../convex/model"
import { errorMessage } from "../../lib/hooks"
import { useFilePicker, useUpload } from "../../lib/upload"
import { AddButton, MediaField, OrderedList, Page, Section, TextField } from "../ui"

const Editor = ({ carousel, title, hint }: { carousel: Carousel; title: string; hint: string }) => {
  const logos = useQuery(api.logos.list, { carousel }) ?? []
  const add = useMutation(api.logos.add)
  const update = useMutation(api.logos.update)
  const remove = useMutation(api.logos.remove)
  const reorder = useMutation(api.logos.reorder)
  const upload = useUpload()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const picker = useFilePicker(
    async (files) => {
      setBusy(true)
      setError(null)
      try {
        const uploaded = await Promise.all(
          files.map(async (file) => ({
            image: await upload(file),
            alt: file.name.replace(/\.[^.]+$/, ""),
          })),
        )
        await add({ carousel, logos: uploaded })
      } catch (cause) {
        setError(errorMessage(cause))
      } finally {
        setBusy(false)
      }
    },
    { multiple: true },
  )

  return (
    <Section title={title} hint={hint}>
      <OrderedList
        items={logos}
        title={(logo) => logo.alt || "Untitled"}
        onReorder={(ids) => reorder({ ids })}
        onRemove={(logo) => remove({ id: logo._id })}
      >
        {(logo) => (
          <>
            <TextField
              label="Alt text"
              value={logo.alt}
              onCommit={(alt) => update({ id: logo._id, patch: { alt } })}
            />
            <MediaField
              label="Logo"
              hint="Scaled to fit about 160×56, never cropped. Transparent PNG recommended."
              url={logo.url}
              removable={false}
              onChange={async (image) => image && update({ id: logo._id, patch: { image } })}
            />
          </>
        )}
      </OrderedList>
      <div className="mt-3 flex items-center gap-4">
        <AddButton disabled={busy} onClick={() => picker.pick()}>
          {busy ? "Uploading…" : "Add logos"}
        </AddButton>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
      {picker.input}
    </Section>
  )
}

export const LogosAdmin = () => (
  <Page title="Logos" description="Two independent carousels.">
    <Editor
      carousel="collaboration"
      title="Collaborations"
      hint="Homepage: 'Brands & creative teams we've worked with'."
    />
    <Editor carousel="work" title="Our work" hint="Homepage and About: 'Logos we've designed'." />
  </Page>
)
