import { AdminTextareaField } from "../../components/fields"
import { BackButton, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

export const AboutBodyAdmin = () => {
  const { content, update } = useContent()
  const body = content.aboutBody

  const set = (i: number, v: string) => {
    const next = [...body] as typeof body
    next[i] = v
    update("aboutBody", next)
  }

  const alignments = ["Left-aligned", "Right-aligned", "Center-aligned"]

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/about" label="About" />
      <SectionHeader
        title="About — Body Copy"
        description="Three staggered paragraphs that blur in on scroll."
      />
      {body.map((text, i) => (
        <AdminTextareaField
          key={i}
          label={`Paragraph ${i + 1} (${alignments[i]})`}
          value={text}
          onChange={(v) => set(i, v)}
          rows={5}
        />
      ))}
    </div>
  )
}
