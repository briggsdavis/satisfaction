import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { TextReveal } from '../components/TextReveal';
import { AsymmetricalSection } from '../components/AsymmetricalSection';
import { useDynamicText } from '../components/DynamicBackground';

export const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 250]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          style={{ y: useTransform(scrollY, [0, 1000], [0, 200]) }}
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
      </div>

      {/* Hero is always at scroll=0 (dark background) — keep explicit white */}
      <div className="relative z-10 text-center px-4 text-white">
        <motion.div style={{ y }}>
          <h1 className="text-[15vw] md:text-[12vw] massive-text leading-none flex flex-col items-center">
            <TextReveal text="DEVON" className="text-white" />
            <TextReveal text="COLEBANK" className="text-neon-pink" delay={0.5} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 text-xs uppercase tracking-[0.5em] font-medium text-white/60"
          >
            Photography & Visual Storytelling
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        <span className="text-[10px] uppercase tracking-widest text-white opacity-40">Scroll</span>
      </div>
    </section>
  );
};

export const ProjectShowcase = () => {
  const projects = [
    { title: 'Golden Hour', subtitle: 'Landscape Photography', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200', align: 'left' as const, width: 'md:w-2/5' },
    { title: 'Frame & Light', subtitle: 'Commercial Videography', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200', align: 'right' as const, width: 'md:w-4/5' },
    { title: 'Visual Identity', subtitle: 'Brand Design', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200', align: 'left' as const, width: 'md:w-3/5' },
  ];

  return (
    <div className="space-y-0">
      {projects.map((project) => (
        <AsymmetricalSection
          key={project.title}
          img={project.img}
          title={project.title}
          subtitle={project.subtitle}
          align={project.align}
          imageWidth={project.width}
        />
      ))}
    </div>
  );
};

export const BrandMarquee = () => {
  const logos = ['NIKE', 'APPLE', 'TESLA', 'SONY', 'ADIDAS', 'BMW', 'AUDI', 'NASA'];
  const { textColor } = useDynamicText();

  return (
    <div className="py-24 border-y border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-24 whitespace-nowrap"
      >
        {[...logos, ...logos].map((logo, i) => (
          <motion.span
            key={i}
            style={{ color: textColor }}
            className="text-6xl font-black massive-text opacity-10 hover:opacity-100 transition-opacity"
          >
            {logo}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export const ServiceTrinity = () => {
  const services = [
    { title: 'Videography', video: 'https://assets.mixkit.co/videos/preview/mixkit-industrial-facility-at-night-4043-large.mp4' },
    { title: 'Photography', video: 'https://assets.mixkit.co/videos/preview/mixkit-welding-worker-in-a-factory-4039-large.mp4' },
    { title: 'Graphic Design', video: 'https://assets.mixkit.co/videos/preview/mixkit-mechanical-parts-of-a-clock-4041-large.mp4' },
  ];

  const [activeService, setActiveService] = useState<string | null>(null);
  const { textColor } = useDynamicText();

  return (
    <section className="flex flex-col md:flex-row h-[150vh] md:h-screen border-t border-white/10">
      {services.map((service) => (
        <motion.div
          key={service.title}
          className="relative flex-1 group overflow-hidden border-r border-white/10 last:border-r-0 cursor-pointer"
          onClick={() => setActiveService(activeService === service.title ? null : service.title)}
        >
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src={service.video}
            />
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 gap-6">
            {/* nowrap + clamp font-size ensures "Graphic Design" stays on one line */}
            <motion.div style={{ color: textColor }} className="group-hover:scale-110 transition-transform duration-700">
              <TextReveal
                text={service.title}
                nowrap
                className="text-[clamp(2rem,_4vw,_4.5rem)] massive-text text-center"
              />
            </motion.div>
            <AnimatePresence>
              {activeService === service.title && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/services" className="btn-industrial inline-block">
                    Explore Services
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </section>
  );
};
