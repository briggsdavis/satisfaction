import React, { useRef, useState, useEffect } from 'react';
import { motion, useTransform, useMotionValue } from 'motion/react';
import { DeBlurText } from '../components/DeBlurText';
import { TextReveal } from '../components/TextReveal';
import { AsymmetricalSection } from '../components/AsymmetricalSection';
import { useSmoothScroll } from '../components/SmoothScroll';
import { useDynamicText } from '../components/DynamicBackground';

export const About = () => {
  const timeline = [
    { year: '2018', event: 'Opened Colebank Studio in Berlin.', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000' },
    { year: '2019', event: 'First major editorial campaign for VOGUE Deutschland.', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000' },
    { year: '2020', event: 'Documentary series "Faces of Europe" premiered online.', img: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=1000' },
    { year: '2021', event: 'Commercial work for global fashion and technology brands.', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000' },
    { year: '2022', event: 'Awarded "Photographer of the Year" at Berlin Photo Week.', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000' },
    { year: '2023', event: 'Exhibited at Paris Photo and Berlin Gallery Weekend.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1000' },
    { year: '2024', event: 'Expanded into motion: short-form and documentary film.', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=1000' },
  ];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  const smoothY = useSmoothScroll();
  const fallbackY = useMotionValue(0);
  const activeY = smoothY ?? fallbackY;

  const wrapperTopRef = useRef(0);
  const scrollDistanceRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0);
      }
      if (horizontalRef.current) {
        const dist = Math.max(0, horizontalRef.current.scrollWidth - window.innerWidth);
        scrollDistanceRef.current = dist;
        setScrollDistance(dist);
      }
    };

    requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [smoothY]);

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current;
    const D = scrollDistanceRef.current;
    if (D === 0) return 0;
    if (y <= T) return 0;
    if (y >= T + D) return D;
    return y - T;
  });

  const x = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current;
    const D = scrollDistanceRef.current;
    if (D === 0) return 0;
    if (y <= T) return 0;
    if (y >= T + D) return -D;
    return -(y - T);
  });

  const { textColor, textColorMuted } = useDynamicText();

  return (
    <motion.div className="pt-40" style={{ color: textColor }}>
      <div className="px-8 mb-32">
        <DeBlurText className="text-[12vw] mb-8 leading-none">
          Devon<br /><span className="text-neon-pink">Colebank</span>
        </DeBlurText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24">
          <div className="space-y-8">
            {/* stagger={0.003} makes the character animation significantly faster */}
            <TextReveal
              as="p"
              text="Devon Colebank is a Berlin-based photographer and visual storyteller with a decade of capturing light, motion, and human expression. His work spans editorial portrait sessions and sweeping landscape panoramas to high-end commercial campaigns and intimate documentary films—always guided by an instinct for the decisive moment and a commitment to authenticity."
              className="text-2xl font-light leading-relaxed"
              stagger={0.003}
            />
          </div>
          <div className="space-y-8 leading-relaxed">
            <motion.p style={{ color: textColorMuted }}>
              Rooted in Berlin's vibrant creative scene, Devon brings a rare combination of technical precision and artistic intuition to every frame. Whether shooting for major editorial outlets or crafting bespoke visual identities, his aesthetic is defined by honesty, texture, and the quiet power of a well-composed image.
            </motion.p>
            <motion.p style={{ color: textColorMuted }}>
              Beyond still photography, Devon's motion work—spanning short documentary films, brand films, and experimental video—has earned international recognition and cemented his reputation as a versatile, boundary-pushing visual artist.
            </motion.p>
            <div className="pt-8 flex gap-12">
              <div>
                <h4 className="text-neon-pink text-[10px] uppercase tracking-widest font-bold mb-2">Location</h4>
                <p>Berlin, Germany</p>
              </div>
              <div>
                <h4 className="text-neon-pink text-[10px] uppercase tracking-widest font-bold mb-2">Focus</h4>
                <p>Photography & Film</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline Section */}
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `calc(${scrollDistance}px + 100vh)` }}
      >
        <motion.div style={{ y: pinY }} className="h-screen flex items-center overflow-hidden">
          <motion.div ref={horizontalRef} style={{ x }} className="flex gap-24 px-8">
            {timeline.map((item) => (
              <div key={item.year} className="w-[85vw] md:w-[45vw] flex-shrink-0">
                <div className="relative aspect-[16/10] overflow-hidden group">
                  <img
                    src={item.img}
                    alt={item.year}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <span className="text-8xl font-black massive-text text-neon-pink drop-shadow-2xl">{item.year}</span>
                  </div>
                </div>
                <div className="mt-12 pr-12">
                  <TextReveal text={item.event} className="text-4xl font-bold uppercase tracking-tight" />
                  <motion.p style={{ color: textColorMuted }} className="mt-6 text-lg leading-relaxed max-w-md">
                    Each milestone represents a new chapter in the ongoing pursuit of authentic visual storytelling—pushing craft, expanding vision.
                  </motion.p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200"
        title="Portrait Mastery"
        subtitle="Editorial Photography"
        align="right"
      />

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200"
        title="Cinematic Vision"
        subtitle="Documentary Film"
        align="left"
      />
    </motion.div>
  );
};
