import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { type RefObject, useState } from "react"
import { useScrollLock } from "../lib/hooks"
import { ease } from "../lib/motion"
import { Link } from "../ui/link"

export const LOGO_SRC = "/brand/logo-small.webp"

const LINKS = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
]
const MENU = [{ to: "/", label: "Home" }, ...LINKS, { to: "/contact", label: "Contact" }]

export const Navbar = ({
  logoRef,
  logoVisible = true,
}: {
  logoRef?: RefObject<HTMLImageElement | null>
  logoVisible?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  useScrollLock(open)

  return (
    <>
      <nav className="fixed top-0 left-0 z-1000 grid w-full grid-cols-2 items-center px-8 py-6 md:grid-cols-[1fr_auto_1fr] md:px-16">
        <Link to="/" className="block w-fit" onClick={close}>
          <img
            ref={logoRef}
            src={LOGO_SRC}
            alt="Social Satisfaction"
            width={168}
            height={168}
            decoding="async"
            className="h-10 w-auto md:h-12"
            style={{ opacity: logoVisible ? 1 : 0 }}
          />
        </Link>

        <div className="hidden items-center justify-center gap-6 md:flex">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="w-24 text-center text-xs font-medium tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>

        <Link to="/contact" className="btn-industrial-sm hidden justify-self-end md:inline-flex">
          Contact
        </Link>

        <button
          onClick={() => setOpen((o) => !o)}
          className="justify-self-end text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-black"
          >
            <nav className="flex flex-col items-center gap-6">
              {MENU.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease, delay: 0.05 + i * 0.06 }}
                >
                  <Link
                    to={to}
                    onClick={close}
                    className="massive-text text-5xl text-white transition-opacity hover:opacity-60"
                  >
                    {label}
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
