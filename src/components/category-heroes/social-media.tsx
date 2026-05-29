import type { Doc } from "../../../convex/_generated/dataModel"
import { ScrollingTextHero } from "./scrolling-text-hero"

type Category = Doc<"categories">

export const SocialMediaHero = ({ category }: { category: Category }) => (
  <section className="relative h-screen overflow-hidden bg-black">
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <img
        src="/mock/social/two-padded.png"
        alt=""
        className="h-[80%] w-auto max-w-none select-none"
        draggable={false}
      />
    </div>

    <div className="absolute inset-0 z-20">
      <ScrollingTextHero text={category.name} />
    </div>

    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
      <img
        src="/mock/social/one-padded.png"
        alt=""
        className="h-[80%] w-auto max-w-none select-none"
        draggable={false}
      />
    </div>
  </section>
)
