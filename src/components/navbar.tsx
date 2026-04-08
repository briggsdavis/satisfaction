import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link } from "react-router"

const NAV_LINKS = ["About", "Services", "Portfolio"]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export const Navbar = () => {
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => setOpen(false)

  return (
    <>
      <nav className="fixed top-0 left-0 z-1000 grid w-full grid-cols-2 items-center px-8 py-6 md:grid-cols-[1fr_auto_1fr] md:px-16">
        {/* Logo */}
        <Link to="/" className="block w-fit" onClick={handleLinkClick}>
          <img
            src="/satisfactionlogo.png"
            alt="Social Satisfaction"
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center justify-center gap-6 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="w-24 text-center text-xs font-medium tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          to="/contact"
          className="btn-industrial-sm hidden justify-self-end md:inline-flex"
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
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-bg"
          >
            <nav className="flex flex-col items-center gap-6">
              {[...NAV_LINKS, "Contact"].map((item, i) => (
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
            </nav>

            <div className="absolute bottom-8 left-8 font-mono text-xs font-bold tracking-widest text-white/15 uppercase">
              ← → Creative Direction
            </div>
            <div className="absolute right-8 bottom-8 font-mono text-xs font-bold tracking-widest text-white/15 uppercase">
              Social Satisfaction
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
