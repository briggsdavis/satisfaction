import type { Id } from "../../../convex/_generated/dataModel"
import { MediaField, Page, Section, TextField } from "../ui"
import { storedValues, useSite } from "./use-site"

export const AboutAdmin = () => {
  const [site, patch] = useSite()
  if (!site) return null
  const setValue = (
    i: number,
    next: { label?: string; body?: string; image?: Id<"_storage"> | null },
  ) =>
    patch({
      values: storedValues(site.values).map((value, j) => {
        if (j !== i) return value
        const { image, ...rest } = { ...value, ...next }
        return image ? { ...rest, image } : rest
      }),
    })

  return (
    <Page
      title="About"
      description="The three value cards. The wheel and timeline have their own pages."
    >
      {site.values.map((value, i) => (
        <Section key={i} title={`Value ${i + 1}`}>
          <TextField
            label="Label (chip text)"
            value={value.label}
            onCommit={(label) => setValue(i, { label })}
          />
          <TextField
            label="Body (revealed on click)"
            multiline
            value={value.body}
            onCommit={(body) => setValue(i, { body })}
          />
          <MediaField
            label="Image"
            hint="2:3 portrait"
            url={value.imageUrl}
            onChange={(image) => setValue(i, { image })}
          />
        </Section>
      ))}
    </Page>
  )
}
