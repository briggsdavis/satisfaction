import React from 'react';
import { motion } from 'motion/react';
import { DeBlurText } from '../components/DeBlurText';
import { TextReveal } from '../components/TextReveal';
import { useDynamicText } from '../components/DynamicBackground';

export const Services = () => {
  const services = [
    { id: 'service-a', title: 'VIDEOGRAPHY', desc: 'Cinematic storytelling from documentary portraits to brand films — crafted with a director\'s eye and a photographer\'s instinct for light.' },
    { id: 'service-b', title: 'PHOTOGRAPHY', desc: 'Editorial, commercial, and fine-art photography that captures the decisive moment — authentic, precise, and deeply considered.' },
    { id: 'service-c', title: 'GRAPHIC DESIGN', desc: 'Visual identity systems, art direction, and typographic design that give brands a distinctive, lasting presence.' },
  ];

  const { textColor, textColorMuted } = useDynamicText();

  return (
    <motion.div className="pt-40" style={{ color: textColor }}>
      <div className="px-8 mb-32">
        <DeBlurText className="text-[12vw] leading-none">
          Our<br /><span className="text-neon-pink">Services</span>
        </DeBlurText>
      </div>

      <div className="space-y-0">
        {services.map((service, i) => (
          <section
            key={service.title}
            id={service.id}
            className="relative h-screen flex flex-col justify-center border-t border-white/10 group"
          >
            <div className="absolute inset-0 z-0 bg-neon-pink opacity-0 group-hover:opacity-5 transition-opacity duration-700" />

            <div className="px-8 relative z-10">
              <TextReveal
                text={service.title}
                className="text-[15vw] massive-text leading-none group-hover:tracking-widest transition-all duration-1000"
              />
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ color: textColorMuted }}
                className="max-w-xl text-xl mt-8"
              >
                {service.desc}
              </motion.p>
            </div>

            <div className="absolute right-8 bottom-8 text-[20vw] font-black massive-text opacity-5 pointer-events-none">
              0{i + 1}
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  );
};
