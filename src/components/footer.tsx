import { Link } from "react-router"

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/socialsatisfaction" },
  { label: "Facebook", href: "https://www.facebook.com/socialsatisfaction" },
  { label: "Twitter", href: "https://twitter.com/socialsatisfaction" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/socialsatisfaction" },
  { label: "YouTube", href: "https://www.youtube.com/@socialsatisfaction" },
]

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black px-8 pt-32 pb-12">
      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16">
        <div className="space-y-8">
          <h2 className="massive-text text-4xl leading-none md:text-6xl">
            Social
            <br />
            Satisfaction
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-white/40">
            Full-service marketing agency specialising in creative direction,
            brand identity, and commercial production.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">
            Navigation
          </h4>
          <ul className="space-y-4">
            {["Home", "About", "Services", "Portfolio", "Contact"].map(
              (item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm font-light tracking-wide text-white/70 transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">
            Social
          </h4>
          <ul className="space-y-4">
            {SOCIAL_LINKS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light tracking-wide text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">
            Contact
          </h4>
          <p className="text-sm font-light tracking-wide text-white/70">info@socialsatisfaction.com</p>
          <p className="text-sm text-white/40">Marketing Agency</p>
          <Link to="/contact" className="btn-industrial-sm mt-4 inline-block">
            Start a Project
          </Link>
        </div>
      </div>

      <div className="mt-32 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
        <p className="text-[10px] tracking-widest text-white/20 uppercase">
          © {new Date().getFullYear()} Social Satisfaction. All Rights Reserved
        </p>
        <div className="flex gap-8">
          <span className="text-[10px] tracking-widest text-white/20 uppercase">
            Privacy Policy
          </span>
          <span className="text-[10px] tracking-widest text-white/20 uppercase">
            Terms of Service
          </span>
        </div>
        <p className="text-[10px] tracking-widest text-white/20 uppercase">
          Made by{" "}
          <a
            href="https://www.briggsdavis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white/60"
          >
            BriggsDavis
          </a>
        </p>
      </div>

      {/* Large background text */}
      <div className="massive-text pointer-events-none absolute -right-20 -bottom-20 text-[20vw] font-black text-white/[0.02] select-none">
        SATISFACTION
      </div>
    </footer>
  )
}
