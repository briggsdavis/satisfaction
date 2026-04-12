import { AdminTextField } from "../../components/fields"
import { BackButton, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

export const CampaignAdmin = () => {
  const { content, update } = useContent()
  const words = content.campaignWords

  const setWord = (i: number, v: string) => {
    const next = [...words] as typeof words
    next[i] = v
    update("campaignWords", next)
  }

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="Campaign Statement"
        description="The large animated 4-word tagline on the homepage. Each word appears on its own line, alternating left/right."
      />

      <div className="mb-6 border border-white/10 bg-black p-6">
        {words.map((word, i) => (
          <div
            key={i}
            className={`font-display text-4xl uppercase leading-[0.88] text-white/60 ${
              i % 2 === 1 ? "text-right" : "text-left"
            }`}
          >
            {word || `Word ${i + 1}`}
          </div>
        ))}
      </div>

      {words.map((word, i) => (
        <AdminTextField
          key={i}
          label={`Word ${i + 1} ${i % 2 === 1 ? "(right-aligned)" : "(left-aligned)"}`}
          value={word}
          onChange={(v) => setWord(i, v)}
        />
      ))}
    </div>
  )
}
