import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Link } from "../../ui/link"
import { Eyebrow } from "../../ui/page"
import { TextReveal } from "../../ui/text-reveal"

export const FaqCta = () => {
  const body = useQuery(api.site.get)?.faqCta
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
      <div className="border-b border-white/10 px-8 py-16 md:px-16 lg:border-r lg:border-b-0 lg:py-20">
        <Eyebrow className="mb-4">Got Questions</Eyebrow>
        <TextReveal
          text="FAQ"
          className="massive-text text-5xl leading-none md:text-7xl lg:text-8xl"
        />
      </div>

      <div className="flex flex-col justify-center gap-6 px-8 py-16 md:px-16 lg:py-20">
        <p className="max-w-lg text-base leading-relaxed whitespace-pre-line text-white/60">
          {body}
        </p>
        <div>
          <Link to="/about#faq" className="btn-industrial">
            View FAQ →
          </Link>
        </div>
      </div>
    </section>
  )
}
