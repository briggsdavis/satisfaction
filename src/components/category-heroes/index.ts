import type { ComponentType } from "react"
import type { Doc } from "../../../convex/_generated/dataModel"
import { BrandingHero } from "./branding"
import { CreativeDirectionHero } from "./creative-direction"
import { GraphicDesignHero } from "./graphic-design"
import { MotionGraphicsHero } from "./motion-graphics"
import { PhotographyHero } from "./photography"
import { SocialMediaHero } from "./social-media"
import { VideographyHero } from "./videography"

type Category = Doc<"categories">

type CategoryHeroProps = {
  category: Category
  editing?: boolean
  onNameCommit?: (name: string) => void
}

export const customCategoryHeroes: Record<string, ComponentType<CategoryHeroProps>> = {
  "social-media": SocialMediaHero,
  branding: BrandingHero,
  "motion-graphics": MotionGraphicsHero,
  "creative-direction": CreativeDirectionHero,
  photography: PhotographyHero,
  videography: VideographyHero,
  "graphic-design": GraphicDesignHero,
}
