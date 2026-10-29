import { ScrollingTextHero } from "./scrolling-text-hero"
import type { HeroProps } from "./types"

export const SocialMediaHero = ({ service }: HeroProps) => (
  <section className="relative h-screen overflow-hidden bg-black">
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <img
        src="/heroes/social-media/back.png"
        alt=""
        className="h-[80%] w-auto max-w-none select-none"
        draggable={false}
      />
    </div>

    <div className="absolute inset-0 z-20">
      <ScrollingTextHero text={service.name} />
    </div>

    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
      <img
        src="/heroes/social-media/front.png"
        alt=""
        className="h-[80%] w-auto max-w-none select-none"
        draggable={false}
      />
    </div>
  </section>
)
