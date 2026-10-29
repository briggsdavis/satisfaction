import type { Site } from "../../../convex/model"
import { Page, Section, TextField } from "../ui"
import { useSite } from "./use-site"

const handle = (v: string) => v.trim().replace(/^@/, "")
const FIELDS: [keyof Site["contact"], string, ((v: string) => string)?][] = [
  ["email", "Email"],
  ["phone", "Phone"],
  ["location", "Location"],
  ["instagram", "Instagram handle", handle],
  ["tiktok", "TikTok handle", handle],
  ["linkedin", "LinkedIn URL"],
  ["youtube", "YouTube handle", handle],
]

export const ContactAdmin = () => {
  const [site, patch] = useSite()
  if (!site) return null
  return (
    <Page
      title="Contact & Footer"
      description="One source of truth for the contact page sidebar and the footer."
    >
      <Section title="Contact" hint="Handles only; profile URLs are built in code.">
        {FIELDS.map(([key, label, normalize]) => (
          <TextField
            key={key}
            label={label}
            value={site.contact[key]}
            normalize={normalize}
            onCommit={(value) => patch({ contact: { ...site.contact, [key]: value } })}
          />
        ))}
      </Section>
      <Section title="Footer">
        <TextField
          label="Description"
          multiline
          value={site.footer}
          onCommit={(footer) => patch({ footer })}
        />
      </Section>
    </Page>
  )
}
