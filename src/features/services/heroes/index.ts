import type { ComponentType } from "react"
import type { HeroVariant } from "../../../../convex/model"
import { BrandingHero } from "./branding"
import { CreativeDirectionHero } from "./creative-direction"
import { DefaultHero } from "./default"
import { GraphicDesignHero } from "./graphic-design"
import { MotionGraphicsHero } from "./motion-graphics"
import { PhotographyHero, VideographyHero } from "./screen"
import { SocialMediaHero } from "./social-media"
import type { HeroProps } from "./types"
import { WebDevelopmentHero } from "./web-development"

export const heroes: Record<HeroVariant, ComponentType<HeroProps>> = {
  default: DefaultHero,
  "social-media": SocialMediaHero,
  branding: BrandingHero,
  "motion-graphics": MotionGraphicsHero,
  "creative-direction": CreativeDirectionHero,
  photography: PhotographyHero,
  videography: VideographyHero,
  "graphic-design": GraphicDesignHero,
  "web-development": WebDevelopmentHero,
}
