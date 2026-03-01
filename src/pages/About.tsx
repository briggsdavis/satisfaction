import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { DeBlurText } from '../components/DeBlurText';
import { TextReveal } from '../components/TextReveal';
import { AsymmetricalSection } from '../components/AsymmetricalSection';

export const About = () => {
  const timeline = [
    { year: '2018', event: 'Founded Colebank Studio in Berlin.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000' },
    { year: '2019', event: 'First major industrial project in Hamburg.', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000' },
    { year: '2020', event: 'Shifted focus to Industrial Brutalism.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000' },
    { year: '2021', event: 'Collaborated with global tech giants.', img: 'https://images.unsplash.com/photo-1518005020250-675f0f0fd13b?auto=format&fit=crop&q=80&w=1000' },
    { year: '2022', event: 'Awarded "Design of the Year" for Iron Pulse.', img: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1000' },
    { year: '2023', event: 'Exhibited at the Berlin Design Week.', img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&q=80&w=1000' },
    { year: '2024', event: 'Global expansion of visual engineering.', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000' },
  ];

  // targetRef wraps the tall outer div that creates vertical scroll space.
  // trackRef is on the motion div whose natural scrollWidth we measure to
  // determine exactly how far horizontally the content needs to travel.
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setScrollDistance(trackRef.current.scrollWidth - window.innerWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // offset: ["start start", "end end"] means progress goes from 0 (top of
  // outer div at viewport top) to 1 (bottom of outer div at viewport bottom).
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Translate the track by exactly the horizontal overflow so the last item
  // lands flush with the right edge of the viewport.
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <div className="pt-40">
      <div className="px-8 mb-32">
        <DeBlurText className="text-[12vw] mb-8 leading-none mix-blend-difference">
          Devon<br /><span className="text-neon-pink">Colebank</span>
        </DeBlurText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24">
          <div className="space-y-8">
            <TextReveal 
              as="p"
              text="Devon Colebank is a visionary visual engineer whose work exists at the intersection of industrial architecture and digital precision. With over a decade of experience in Berlin's creative scene, he has pioneered a style known as 'Industrial Brutalism'—a design philosophy that celebrates raw materials, structural honesty, and high-impact spatial logic."
              className="text-2xl font-light leading-relaxed text-white/80 mix-blend-difference"
            />
          </div>
          <div className="space-y-8 text-white/40 leading-relaxed mix-blend-difference">
            <p className="text-white/60">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p className="text-white/60">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
            </p>
            <div className="pt-8 flex gap-12">
              <div>
                <h4 className="text-neon-pink text-[10px] uppercase tracking-widest font-bold mb-2">Location</h4>
                <p className="text-white">Berlin, Germany</p>
              </div>
              <div>
                <h4 className="text-neon-pink text-[10px] uppercase tracking-widest font-bold mb-2">Focus</h4>
                <p className="text-white">Visual Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline Section */}
      {/* Height = 100vh (to keep the sticky panel on screen) + however many
          pixels the track needs to scroll horizontally. This gives the user
          exactly the right amount of vertical scroll to traverse the whole
          timeline before the page continues downward. */}
      <div
        ref={targetRef}
        style={{ height: scrollDistance ? `calc(100vh + ${scrollDistance}px)` : '600vh' }}
        className="relative"
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div ref={trackRef} style={{ x }} className="flex gap-24 px-8">
            {timeline.map((item, i) => (
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
                <div className="mt-12 pr-12 mix-blend-difference">
                  <TextReveal text={item.event} className="text-4xl font-bold uppercase tracking-tight" />
                  <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-md">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <AsymmetricalSection 
        img="https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&q=80&w=1200"
        title="Structural Integrity"
        subtitle="Past Projects"
        align="right"
      />

      <AsymmetricalSection 
        img="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200"
        title="Digital Blueprint"
        subtitle="Visual Engineering"
        align="left"
      />
    </div>
  );
};
