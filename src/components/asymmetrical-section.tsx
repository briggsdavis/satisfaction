import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { cn } from "../lib/utils"
import { TextReveal } from "./text-reveal"

interface AsymmetricalSectionProps {
  img: string
  title: string
  subtitle: string
  align?: "left" | "right"
  className?: string
  key?: string | number
  imageWidth?: string
}

export const AsymmetricalSection = ({
  img,
  title,
  subtitle,
  align = "left",
  className,
  imageWidth = "md:w-3/5",
}: AsymmetricalSectionProps) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.1, 1.2])

  const textWidth =
    imageWidth === "md:w-3/5"
      ? "md:w-2/5"
      : imageWidth === "md:w-4/5"
        ? "md:w-1/5"
        : imageWidth === "md:w-2/5"
          ? "md:w-3/5"
          : "md:w-2/5"

  return (
    <section ref={ref} className={cn("py-24 md:py-48 px-8", className)}>
      <div
        className={cn(
          "flex flex-col gap-12 items-center max-w-7xl mx-auto",
          align === "right" ? "md:flex-row-reverse" : "md:flex-row",
        )}
      >
        {/* Image — overflow-hidden on the image container only (prevents parallax gray reveal).
            Section itself has no overflow-hidden so titles are never clipped. */}
        <div
          className={cn(
            "w-full relative aspect-[16/10] overflow-hidden",
            imageWidth,
          )}
        >
          <motion.img
            style={{ y, scale, height: "calc(100% + 200px)", top: "-100px" }}
            src={img}
            alt={title}
            loading="lazy"
            className="absolute w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className={cn("w-full space-y-6", textWidth)}>
          <motion.span
            initial={{ opacity: 0, x: align === "left" ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-white/40 block text-xs font-bold tracking-[0.4em] uppercase"
          >
            {subtitle}
          </motion.span>
          <TextReveal
            text={title}
            className="massive-text text-4xl leading-none md:text-6xl lg:text-8xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md text-lg leading-relaxed text-white/60"
          >
            Exploring the intersection of brand strategy and visual craft. Every
            project represents a new chapter in building something that lasts.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
