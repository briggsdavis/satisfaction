import { api } from "../../../convex/_generated/api"
import { preload } from "../../lib/convex"
import { ColumnLines, Meta } from "../../ui/page"
import { CampaignStatement } from "./campaign-statement"
import { FaqCta } from "./faq-cta"
import { FeaturedCascade } from "./featured-cascade"
import { Hero } from "./hero"
import { LogosCarousel } from "./logos-carousel"
import { ServicesCarousel } from "./services-carousel"
import { WhatWeDoSection } from "./what-we-do"

export const loader = async () => {
  await Promise.all([
    preload(api.logos.list, { carousel: "collaboration" }),
    preload(api.logos.list, { carousel: "work" }),
    preload(api.services.list),
    preload(api.projects.featured),
  ])
  return null
}

export const Component = () => (
  <>
    <Meta />
    <ColumnLines />
    <Hero />
    <LogosCarousel
      carousel="collaboration"
      eyebrow="Collaborations"
      heading="Brands & creative teams we've worked with:"
    />
    <ServicesCarousel />
    <LogosCarousel carousel="work" />
    <WhatWeDoSection />
    <CampaignStatement />
    <FeaturedCascade />
    <FaqCta />
  </>
)
