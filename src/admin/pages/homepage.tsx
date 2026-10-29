import { Link } from "react-router"
import { MediaField, Page, Section, TextField } from "../ui"
import { useSite } from "./use-site"

// Mirrors SLOTS in features/home/scattered-images.tsx. Every slot crops to fit.
const HERO_SLOTS = [
  ["top-left (laptop)", "28:19, about 3:2 landscape"],
  ["upper-left (workspace)", "22:15, about 3:2 landscape"],
  ["top-centre (icon)", "1:1 square"],
  ["top-right (UI screenshot)", "9:4 wide landscape"],
  ["left (studio)", "18:11 landscape"],
  ["centre-left (graphic)", "11:10 near-square"],
  ["right (logo card)", "6:7 near-square"],
  ["far-right (camera lens)", "1:1 square"],
  ["bottom-left (phone mockup)", "7:10 portrait"],
  ["bottom-right (lifestyle)", "7:4 landscape"],
]

export const HomepageAdmin = () => {
  const [site, patch] = useSite()
  if (!site) return null
  const { whatWeDo } = site

  return (
    <Page title="Homepage" description="Featured projects are toggled in the Projects list.">
      <Section
        title="Hero: scattered images"
        hint="Positions and timing are fixed; only images change."
      >
        {HERO_SLOTS.map(([place, ratio], i) => (
          <MediaField
            key={i}
            label={`Slot ${i + 1}: ${place}`}
            hint={`Aspect ${ratio}`}
            url={site.heroImageUrls[i]}
            onChange={(id) =>
              patch({ heroImages: site.heroImages.map((old, j) => (j === i ? id : old)) })
            }
          />
        ))}
      </Section>

      <Section
        title="Hero: iMac screen video"
        hint="Muted, looping H.264 MP4, ~1920×1080, a few MB. Empty keeps the model's built-in screen."
      >
        <MediaField
          label="Screen video"
          kind="video"
          url={
            site.heroVideo &&
            `${import.meta.env.VITE_CONVEX_SITE_URL}/hero-video?id=${site.heroVideo}`
          }
          onChange={(heroVideo) => patch({ heroVideo })}
        />
      </Section>

      <Section title="What we do / Why we're different">
        <TextField
          label="What we do: body"
          multiline
          value={whatWeDo.body}
          onCommit={(body) => patch({ whatWeDo: { ...whatWeDo, body } })}
        />
        {(["left", "right"] as const).map((side) => (
          <div key={side}>
            <TextField
              label={`Why different: ${side} label`}
              value={whatWeDo[side].label}
              onCommit={(label) =>
                patch({ whatWeDo: { ...whatWeDo, [side]: { ...whatWeDo[side], label } } })
              }
            />
            <TextField
              label={`Why different: ${side} body`}
              multiline
              value={whatWeDo[side].body}
              onCommit={(body) =>
                patch({ whatWeDo: { ...whatWeDo, [side]: { ...whatWeDo[side], body } } })
              }
            />
          </div>
        ))}
      </Section>

      <Section
        title="Campaign statement"
        hint="Image behind the 'CAMPAIGNS BUILT TO PERFORM.' headline."
      >
        <MediaField
          label="Centered image"
          hint="1:1 square"
          url={site.campaignImageUrl}
          onChange={(campaignImage) => patch({ campaignImage })}
        />
      </Section>

      <Section title="FAQ call to action">
        <TextField
          label="Body"
          multiline
          value={site.faqCta}
          onCommit={(faqCta) => patch({ faqCta })}
        />
        <p className="mt-4 text-xs text-ink/50">
          Questions live under{" "}
          <Link to="/admin/faq" className="underline">
            FAQ
          </Link>
          .
        </p>
      </Section>
    </Page>
  )
}
