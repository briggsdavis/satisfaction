import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, MotionValue } from 'motion/react';
import { TextReveal } from '../components/TextReveal';
import { useDynamicText } from '../components/DynamicBackground';
import { useSmoothScroll } from '../components/SmoothScroll';

// ─── Hero ─────────────────────────────────────────────────────────────────────
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

// ─── Word-by-word scroll reveal ───────────────────────────────────────────────
// whileInView lives on the parent <motion.p> so IntersectionObserver targets
// the full paragraph (which IS in the layout flow and never clipped).
// Child variants animate from within their overflow-hidden mask once the
// parent enters the viewport.
const wordVariant = {
  hidden: { y: '115%' },
  visible: { y: '0%', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const WordReveal = ({
  text,
  motionStyle,
  className,
  startDelay = 0,
}: {
  text: string;
  motionStyle?: any;
  className?: string;
  startDelay?: number;
}) => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.028, delayChildren: startDelay } },
  };

  return (
    <motion.p
      className={className}
      style={motionStyle}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ marginRight: '0.3em' }}>
          <motion.span className="inline-block" variants={wordVariant}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
};

// ─── Intro Text ───────────────────────────────────────────────────────────────
export const IntroText = () => {
  const { textColor, textColorMuted } = useDynamicText();

  const para1 =
    "Design isn't something I do — it's how I see the world. From the golden light that hits a subject at dusk, to the precise geometry of a well-crafted brand mark, I've spent my career chasing the moments where craft becomes meaning.";
  const para2 =
    "Based in Pittsburgh, Pennsylvania, I work at the intersection of videography, photography, and graphic design — telling stories that don't just look good, but feel undeniably true. Every project begins with a single question: what do you want people to feel?";

  return (
    <section className="py-48 px-8 md:px-24 border-t border-current/10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Label — single line clip reveal */}
        <div className="overflow-hidden">
          <motion.span
            className="text-neon-pink text-xs uppercase tracking-[0.4em] font-bold block"
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            The Philosophy
          </motion.span>
        </div>

        {/* Large paragraph — word by word */}
        <WordReveal
          text={para1}
          motionStyle={{ color: textColor }}
          className="text-3xl md:text-4xl lg:text-[2.6rem] font-light leading-[1.35]"
          startDelay={0.05}
        />

        {/* Smaller paragraph — word by word, slightly offset start */}
        <WordReveal
          text={para2}
          motionStyle={{ color: textColorMuted }}
          className="text-lg font-light leading-relaxed max-w-3xl"
          startDelay={0.12}
        />
      </div>
    </section>
  );
};

// ─── Featured Projects ────────────────────────────────────────────────────────
const FEATURED = [
  {
    title: 'Kinetic Light',
    tags: ['Photography', 'Landscape'],
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200',
    align: 'left' as const,
    widthClass: 'md:w-3/5',
  },
  {
    title: 'Frame Study',
    tags: ['Videography', 'Commercial'],
    img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200',
    align: 'right' as const,
    widthClass: 'md:w-[58%]',
  },
  {
    title: 'Signal & Form',
    tags: ['Graphic Design', 'Branding'],
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
    align: 'left' as const,
    widthClass: 'md:w-1/2',
  },
];

const FeaturedProjectCard = ({
  project,
  index,
}: {
  project: (typeof FEATURED)[0];
  index: number;
}) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const wrapY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imgY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const { textColor, textColorMuted } = useDynamicText();
  const isRight = project.align === 'right';

  return (
    <section ref={ref} className="py-32 px-8 md:px-16 border-t border-current/10">
      <motion.div
        style={{ y: wrapY }}
        className={`flex flex-col gap-12 items-center max-w-7xl mx-auto ${
          isRight ? 'md:flex-row-reverse' : 'md:flex-row'
        }`}
      >
        {/* Image with parallax */}
        <div className={`relative aspect-[4/3] overflow-hidden w-full ${project.widthClass}`}>
          <motion.img
            style={{ y: imgY, height: 'calc(100% + 160px)', top: '-80px' }}
            src={project.img}
            alt={project.title}
            className="absolute w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Text */}
        <motion.div style={{ color: textColor }} className="flex-1 space-y-6">
          <div className="flex gap-3 flex-wrap">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-[0.35em] font-bold border border-neon-pink/50 text-neon-pink px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <TextReveal text={project.title} className="text-5xl md:text-7xl massive-text" />
          <motion.p style={{ color: textColorMuted }} className="text-base leading-relaxed max-w-xs">
            A deep exploration of form, light, and intention — crafted with precision and purpose.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export const FeaturedProjects = () => {
  const { textColor } = useDynamicText();

  return (
    <motion.section style={{ color: textColor }}>
      <div className="px-8 md:px-16 pt-32 pb-12 border-t border-current/10">
        <TextReveal text="Featured" className="text-[9vw] massive-text" />
        <TextReveal text="Projects" className="text-[9vw] massive-text text-neon-pink" delay={0.15} />
      </div>

      {FEATURED.map((project, i) => (
        <FeaturedProjectCard key={project.title} project={project} index={i} />
      ))}

      <div className="flex justify-center py-24 border-t border-current/10">
        <Link to="/portfolio" className="btn-industrial">
          See Portfolio
        </Link>
      </div>
    </motion.section>
  );
};

// ─── Value Propositions (Pinned Scroll) ───────────────────────────────────────
const UVP_DATA = [
  {
    title: 'Storytelling Through Light',
    text: "Every frame is a deliberate act. Devon's mastery of natural and artificial light transforms ordinary moments into cinematic statements that stay with you long after the shutter closes.",
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Brand, Built to Last',
    text: 'Great design outlives trends. Devon builds visual identities rooted in strategy, executed with craft, and designed to grow alongside the brands that wear them.',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Motion That Moves People',
    text: "Video isn't just content — it's connection. From concept to colour grade, Devon directs and produces film that carries the full weight of a story worth telling.",
    img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200',
  },
];

const UVPPanel = ({
  uvp,
  index,
  total,
  progress,
}: {
  uvp: (typeof UVP_DATA)[0];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const crossWidth = 0.13;

  // Build keyframe arrays without conditionals so hook call order is always stable
  const fadeInStart  = index === 0 ? 0 : (index / total) - crossWidth + 0.01;
  const fadeInEnd    = index === 0 ? 0.01 : index / total;
  const fadeOutStart = index === total - 1 ? 0.99 : ((index + 1) / total) - crossWidth;
  const fadeOutEnd   = index === total - 1 ? 1 : (index + 1) / total;

  const opProgress = [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd];
  const opValues   = index === 0
    ? [1, 1, 1, 0]
    : index === total - 1
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0];

  const opacity = useTransform(progress, opProgress, opValues);

  const imgStartX = index === 0 ? '0%' : index % 2 === 0 ? '-5%' : '5%';
  const imgX = useTransform(progress, [fadeInStart, fadeInEnd], [imgStartX, '0%']);
  const textStartY = index === 0 ? '0px' : '28px';
  const textY = useTransform(progress, [fadeInStart, fadeInEnd], [textStartY, '0px']);

  const { textColor, textColorMuted } = useDynamicText();

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex h-full">
      {/* Image — left half */}
      <div className="w-1/2 h-full overflow-hidden relative">
        <motion.img
          style={{ x: imgX }}
          src={uvp.img}
          alt={uvp.title}
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Text — right half */}
      <motion.div
        style={{ y: textY, color: textColor }}
        className="w-1/2 h-full flex flex-col justify-center px-12 md:px-16 space-y-6"
      >
        <span className="text-neon-pink text-xs uppercase tracking-[0.4em] font-bold">
          0{index + 1} / 0{total}
        </span>
        <TextReveal text={uvp.title} className="text-4xl md:text-5xl lg:text-6xl massive-text" />
        <motion.p style={{ color: textColorMuted }} className="text-lg leading-relaxed max-w-md">
          {uvp.text}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export const ValuePropositions = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pinDistance, setPinDistance] = useState(0);

  const smoothY = useSmoothScroll();
  const fallbackY = useMotionValue(0);
  const activeY = smoothY ?? fallbackY;

  const wrapperTopRef = useRef(0);
  const pinDistanceRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0);
      const dist = (UVP_DATA.length - 1) * window.innerHeight;
      pinDistanceRef.current = dist;
      setPinDistance(dist);
    };
    requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [smoothY]);

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current;
    const D = pinDistanceRef.current;
    if (D === 0) return 0;
    if (y <= T) return 0;
    if (y >= T + D) return D;
    return y - T;
  });

  const progress = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current;
    const D = pinDistanceRef.current;
    if (D === 0) return 0;
    if (y <= T) return 0;
    if (y >= T + D) return 1;
    return (y - T) / D;
  });

  return (
    <div
      ref={wrapperRef}
      style={{ height: `calc(${pinDistance}px + 100vh)` }}
      className="relative border-t border-current/10"
    >
      <motion.div style={{ y: pinY }} className="h-screen relative overflow-hidden">
        {UVP_DATA.map((uvp, i) => (
          <UVPPanel
            key={uvp.title}
            uvp={uvp}
            index={i}
            total={UVP_DATA.length}
            progress={progress}
          />
        ))}
      </motion.div>
    </div>
  );
};

// ─── Service Trinity (Redesigned) ─────────────────────────────────────────────
const SERVICE_CARDS = [
  {
    title: 'Videography',
    description: 'Cinematic stories captured with intention and craft.',
    img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800',
    offsetClass: '',
  },
  {
    title: 'Photography',
    description: 'Moments preserved with clarity, feeling, and precision.',
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    offsetClass: 'md:mt-32',
  },
  {
    title: 'Graphic Design',
    description: 'Identities and visuals built to outlast the moment.',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
    offsetClass: 'md:mt-64',
  },
];

const ServiceCard = ({
  service,
  index,
}: {
  service: (typeof SERVICE_CARDS)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const { textColor, textColorMuted } = useDynamicText();

  return (
    <motion.div
      ref={ref}
      style={{ color: textColor }}
      className={`flex-1 min-w-0 group ${service.offsetClass}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-8">
        <motion.img
          style={{ y: imgY, height: 'calc(100% + 60px)', top: '-30px' }}
          src={service.img}
          alt={service.title}
          className="absolute w-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
      </div>
      <TextReveal text={service.title} className="text-4xl md:text-5xl massive-text mb-3" />
      <motion.p style={{ color: textColorMuted }} className="text-sm leading-relaxed">
        {service.description}
      </motion.p>
    </motion.div>
  );
};

export const ServiceTrinity = () => {
  const { textColor } = useDynamicText();

  return (
    <motion.section style={{ color: textColor }} className="py-32 px-8 md:px-16 border-t border-current/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <TextReveal text="Services" className="text-[13vw] massive-text" />
        </div>

        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start">
          {SERVICE_CARDS.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        <div className="flex justify-center mt-32 md:mt-56">
          <Link to="/services" className="btn-industrial">
            Discover More
          </Link>
        </div>
      </div>
    </motion.section>
  );
};
