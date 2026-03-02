import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { TextReveal } from './TextReveal';
import { useDynamicText } from './DynamicBackground';

interface AsymmetricalSectionProps {
  img: string;
  title: string;
  subtitle: string;
  align?: 'left' | 'right';
  className?: string;
  key?: string | number;
  imageWidth?: string;
}

export const AsymmetricalSection = ({
  img,
  title,
  subtitle,
  align = 'left',
  className,
  imageWidth = "md:w-3/5"
}: AsymmetricalSectionProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.1, 1.2]);

  const textWidth = imageWidth === "md:w-3/5" ? "md:w-2/5" :
                    imageWidth === "md:w-4/5" ? "md:w-1/5" :
                    imageWidth === "md:w-2/5" ? "md:w-3/5" : "md:w-2/5";

  const { textColor, textColorMuted } = useDynamicText();

  return (
    <section ref={ref} className={cn("py-48 px-8", className)}>
      <div className={cn(
        "flex flex-col gap-12 items-center max-w-7xl mx-auto",
        align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
      )}>
        {/* Image — overflow-hidden on the image container only (prevents parallax gray reveal).
            Section itself has no overflow-hidden so titles are never clipped. */}
        <div className={cn("w-full relative aspect-[16/10] overflow-hidden bg-black", imageWidth)}>
          <motion.img
            style={{ y, scale }}
            src={img}
            alt={title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Text — use scroll-driven color so it's always readable against the DynamicBackground */}
        <motion.div
          className={cn("w-full space-y-6", textWidth)}
          style={{ color: textColor }}
        >
          <motion.span
            initial={{ opacity: 0, x: align === 'left' ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-neon-pink text-xs uppercase tracking-[0.4em] font-bold block"
          >
            {subtitle}
          </motion.span>
          <TextReveal
            text={title}
            className="text-6xl md:text-8xl massive-text leading-none"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ color: textColorMuted }}
            className="text-lg leading-relaxed max-w-md"
          >
            Exploring the intersection of industrial form and digital function. This project represents a milestone in structural visual engineering.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
