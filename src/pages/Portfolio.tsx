import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { DeBlurText } from '../components/DeBlurText';
import { TextReveal } from '../components/TextReveal';
import { cn } from '../lib/utils';
import { useDynamicText } from '../components/DynamicBackground';

const categories = ['ALL', 'VIDEO', 'PHOTO', 'GRAPHIC'];

const generateProjects = () => {
  const baseProjects = [
    { title: 'Golden Hour', category: 'PHOTO', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Frame & Light', category: 'VIDEO', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Visual Identity', category: 'GRAPHIC', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Quiet Light', category: 'PHOTO', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Depth of Field', category: 'VIDEO', img: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Brand System', category: 'GRAPHIC', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1000' },
  ];

  const extended = [];
  for (let i = 0; i < 30; i++) {
    const base = baseProjects[i % baseProjects.length];
    extended.push({
      ...base,
      id: i + 1,
      title: `${base.title} ${Math.floor(i / baseProjects.length) + 1}`,
      img: `${base.img}&sig=${i}`,
      description: "A carefully composed work exploring the relationship between light, subject, and intention. Each frame is a deliberate choice—an authentic slice of the world as seen through Devon's lens."
    });
  }
  return extended;
};

const projects = generateProjects();

export const Portfolio = () => {
  const [filter, setFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const { textColor, textColorMuted } = useDynamicText();

  const filteredProjects = filter === 'ALL'
    ? projects
    : projects.filter(p => p.category === filter);

  const handleNext = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
  };

  return (
    <LayoutGroup>
      <div className="pt-40 px-8 pb-32 min-h-screen" style={{ color: textColor } as unknown as React.CSSProperties}>
        <div className="text-center mb-24">
          <DeBlurText className="text-[12vw] leading-none">Portfolio</DeBlurText>
        </div>

        <div className="flex justify-center gap-4 mb-24 border-b border-current/10 pb-8">
          {categories.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "btn-industrial",
                filter === f && "btn-industrial-active"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              // Row & column within a 3-col grid. Even rows pan from left, odd from right.
              const colCount = 3;
              const rowIndex = Math.floor(index / colCount);
              const colIndex = index % colCount;
              const panX = rowIndex % 2 === 0 ? -80 : 80;

              return (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, x: panX }}
                whileInView={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.7,
                  delay: colIndex * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative group aspect-[4/5] overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <motion.img
                  layoutId={`img-${project.id}`}
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  // Hide grid image while it's morphing into the modal position
                  style={{ opacity: selectedProject?.id === project.id ? 0 : 1 }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-neon-pink font-bold">{project.category}</span>
                  <h3 className="text-3xl massive-text mt-4 text-white">{project.title}</h3>
                  <div className="mt-6 w-12 h-[1px] bg-white/40" />
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Detail View Modal — rendered via portal so it sits above everything */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <>
              {/* Background overlay fades in independently — does NOT wrap the morphing image */}
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[5000] bg-black"
              />

              {/* Content container — no opacity animation so layoutId morph is visible */}
              <div className="fixed inset-0 z-[5001] flex items-center justify-center p-4 md:p-12 overflow-hidden">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-8 right-8 z-50 text-white/40 hover:text-white transition-colors"
                >
                  <span className="text-[10px] uppercase tracking-widest font-bold">Close [ESC]</span>
                </button>

                <div className="w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-center">
                  <div className="w-full md:w-1/2 flex items-center justify-center">
                    {/* No forced aspect ratio or background — image renders at its natural ratio */}
                    <motion.img
                      layoutId={`img-${selectedProject.id}`}
                      src={selectedProject.img}
                      alt={selectedProject.title}
                      className="w-full max-h-[80vh] object-cover block"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 pr-8">
                    <div>
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-neon-pink text-xs uppercase tracking-[0.3em] font-bold"
                      >
                        {selectedProject.category}
                      </motion.span>
                      <TextReveal
                        text={selectedProject.title}
                        className="text-6xl md:text-8xl massive-text mt-4 leading-none text-white"
                      />
                    </div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/60 text-lg leading-relaxed max-w-xl"
                    >
                      {selectedProject.description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="pt-12 flex gap-8 items-center"
                    >
                      <button
                        onClick={handleNext}
                        className="btn-industrial"
                      >
                        Next Project
                      </button>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors"
                      >
                        Back to Grid
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </LayoutGroup>
  );
};
