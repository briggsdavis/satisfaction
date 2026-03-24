import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { useState } from "react"
import { createPortal } from "react-dom"
import { DeBlurText } from "../components/de-blur-text"
import { TextReveal } from "../components/text-reveal"
import { cn } from "../lib/utils"

const categories = ["ALL", "VIDEO", "PHOTO", "GRAPHIC"]

const generateProjects = () => {
  const baseProjects = [
    {
      title: "Golden Hour",
      category: "PHOTO",
      img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "Frame & Light",
      category: "VIDEO",
      img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "Visual Identity",
      category: "GRAPHIC",
      img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "Quiet Light",
      category: "PHOTO",
      img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "Depth of Field",
      category: "VIDEO",
      img: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "Brand System",
      category: "GRAPHIC",
      img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1000",
    },
  ]

  const extended = []
  for (let i = 0; i < 30; i++) {
    const base = baseProjects[i % baseProjects.length]
    extended.push({
      ...base,
      id: i + 1,
      title: `${base.title} ${Math.floor(i / baseProjects.length) + 1}`,
      img: `${base.img}&sig=${i}`,
      description:
        "A carefully composed work exploring the relationship between light, subject, and intention. Each frame is a deliberate choice, an authentic slice of the world as seen through Devon's lens.",
    })
  }
  return extended
}

const projects = generateProjects()

export const Portfolio = () => {
  const [filter, setFilter] = useState("ALL")
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null)
  const filteredProjects =
    filter === "ALL" ? projects : projects.filter((p) => p.category === filter)

  const handleNext = () => {
    if (!selectedProject) return
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id)
    const nextIndex = (currentIndex + 1) % projects.length
    setSelectedProject(projects[nextIndex])
  }

  return (
    <LayoutGroup>
      <div className="min-h-screen px-8 pt-40 pb-32">
        <div className="mb-24 text-center">
          <DeBlurText className="text-[12vw] leading-none">
            Portfolio
          </DeBlurText>
        </div>

        <div className="mb-24 grid grid-cols-2 justify-items-center gap-3 border-b border-current/10 pb-8 md:flex md:justify-center md:gap-4">
          {categories.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "btn-industrial w-full md:w-auto",
                filter === f && "btn-industrial-active",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              // Row & column within a 3-col grid. Even rows pan from left, odd from right.
              const colCount = 3
              const rowIndex = Math.floor(index / colCount)
              const colIndex = index % colCount
              const panX = rowIndex % 2 === 0 ? -80 : 80

              return (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, x: panX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.7,
                    delay: colIndex * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative aspect-[4/5] cursor-pointer overflow-hidden"
                  onClick={() => setSelectedProject(project)}
                >
                  <motion.img
                    layoutId={`img-${project.id}`}
                    src={project.img}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    // Hide grid image while it's morphing into the modal position
                    style={{
                      opacity: selectedProject?.id === project.id ? 0 : 1,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-8 text-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">
                      {project.category}
                    </span>
                    <h3 className="massive-text mt-4 text-3xl text-white">
                      {project.title}
                    </h3>
                    <div className="mt-6 h-[1px] w-12 bg-white/40" />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Detail View Modal — rendered via portal so it sits above everything */}
      {typeof document !== "undefined" &&
        createPortal(
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

                {/* Content container */}
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[5001] flex items-center justify-center overflow-hidden p-4 md:p-12"
                >
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-8 right-8 z-50 text-white/40 transition-colors hover:text-white"
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase">
                      Close [ESC]
                    </span>
                  </button>

                  <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-12 md:flex-row">
                    <div className="flex w-full items-center justify-center md:w-1/2">
                      {/* No forced aspect ratio or background — image renders at its natural ratio */}
                      <motion.img
                        layoutId={`img-${selectedProject.id}`}
                        src={selectedProject.img}
                        alt={selectedProject.title}
                        className="block max-h-[80vh] w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex w-full flex-col justify-center space-y-8 pr-8 md:w-1/2">
                      <div>
                        <motion.span
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase"
                        >
                          {selectedProject.category}
                        </motion.span>
                        <TextReveal
                          text={selectedProject.title}
                          className="massive-text mt-4 text-6xl leading-none text-white md:text-8xl"
                        />
                      </div>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-xl text-lg leading-relaxed text-white/60"
                      >
                        {selectedProject.description}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-8 pt-12"
                      >
                        <button onClick={handleNext} className="btn-industrial">
                          Next Project
                        </button>
                        <button
                          onClick={() => setSelectedProject(null)}
                          className="text-[10px] font-bold tracking-widest text-white/40 uppercase transition-colors hover:text-white"
                        >
                          Back to Grid
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </LayoutGroup>
  )
}
