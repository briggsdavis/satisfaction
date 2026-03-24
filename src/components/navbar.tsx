import { ChevronDown, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link } from "react-router"

const PROJECTS = [
  { label: "Absolute Vodka", slug: "absolute-vodka" },
  { label: "Red Bull", slug: "red-bull" },
  { label: "Montclair", slug: "montclair" },
]

const NAV_ITEMS = ["About", "Services", "Portfolio", "Contact"]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false)

  const handleLinkClick = () => {
    setOpen(false)
    setProjectsOpen(false)
    setMobileProjectsOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 z-1000 grid w-full grid-cols-2 items-center px-4 py-6 md:grid-cols-[1fr_auto_1fr] md:px-8">
        {/* Logo */}
        <Link to="/" className="block w-fit" onClick={handleLinkClick}>
          <img
            src="/logo.png"
            alt="Devon Colebank"
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center justify-center gap-6 md:flex">
          {["About", "Services"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="w-24 text-center text-xs font-medium tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white"
            >
              {item}
            </Link>
          ))}

          {/* Projects dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProjectsOpen(true)}
            onMouseLeave={() => setProjectsOpen(false)}
          >
            <button className="flex w-24 items-center justify-center gap-1.5 text-center text-xs font-medium tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white">
              Projects
              <motion.span
                animate={{ rotate: projectsOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={12} />
              </motion.span>
            </button>

            <AnimatePresence>
              {projectsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, ease }}
                  className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                >
                  <div className="min-w-[200px] border border-white/10 bg-black/95 backdrop-blur-md">
                    {/* Decorative top line */}
                    <div className="h-px w-full bg-white/20" />
                    <div className="px-2 pt-3 pb-1">
                      <span className="font-mono text-[7px] font-bold tracking-widest text-white/30 uppercase px-3">
                        Case Studies
                      </span>
                    </div>
                    {PROJECTS.map((project, i) => (
                      <Link
                        key={project.slug}
                        to={`/projects/${project.slug}`}
                        onClick={handleLinkClick}
                        className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/5"
                      >
                        <span className="font-mono text-[8px] font-bold text-white/25 transition-colors group-hover:text-white/50">
                          0{i + 1}
                        </span>
                        <span className="text-xs font-bold tracking-[0.15em] text-white/70 uppercase transition-colors group-hover:text-white">
                          {project.label}
                        </span>
                        <span className="ml-auto text-white/20 transition-colors group-hover:text-white/60">→</span>
                      </Link>
                    ))}
                    {/* Bottom decorative */}
                    <div className="flex items-center justify-between px-5 py-2 border-t border-white/5">
                      <span className="font-mono text-[7px] font-bold tracking-widest text-white/20 uppercase">
                        ← →
                      </span>
                      <span className="font-mono text-[7px] font-bold tracking-widest text-white/20 uppercase">
                        Devon Colebank
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/portfolio"
            className="w-24 text-center text-xs font-medium tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white"
          >
            Portfolio
          </Link>
        </div>

        {/* Desktop CTA */}
        <Link
          to="/contact"
          className="btn-industrial hidden justify-self-end md:inline-flex"
        >
          Contact
        </Link>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="justify-self-end text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="bg-bg fixed inset-0 z-[999] flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease, delay: 0.05 + i * 0.06 }}
                >
                  <Link
                    to={`/${item.toLowerCase()}`}
                    onClick={handleLinkClick}
                    className="massive-text text-5xl text-white transition-opacity hover:opacity-60"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile projects accordion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease, delay: 0.05 + NAV_ITEMS.length * 0.06 }}
                className="flex flex-col items-center"
              >
                <button
                  onClick={() => setMobileProjectsOpen((o) => !o)}
                  className="massive-text flex items-center gap-3 text-5xl text-white transition-opacity hover:opacity-60"
                >
                  Projects
                  <motion.span
                    animate={{ rotate: mobileProjectsOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl"
                  >
                    <ChevronDown size={28} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {mobileProjectsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col items-center gap-4 pt-4">
                        {PROJECTS.map((project) => (
                          <Link
                            key={project.slug}
                            to={`/projects/${project.slug}`}
                            onClick={handleLinkClick}
                            className="text-xl font-bold tracking-[0.15em] text-white/60 uppercase transition-colors hover:text-white"
                          >
                            {project.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </nav>

            {/* Mobile menu decorative elements */}
            <div className="absolute bottom-8 left-8 font-mono text-[8px] font-bold tracking-widest text-white/15 uppercase">
              ← → Creative Direction
            </div>
            <div className="absolute bottom-8 right-8 font-mono text-[8px] font-bold tracking-widest text-white/15 uppercase">
              Devon Colebank
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
