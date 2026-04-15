import { Link } from "react-router"
import { useContent } from "../admin/context/content-context"

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/socialsatisfaction" },
  { label: "TikTok", href: "https://www.tiktok.com/@socialsatisfaction" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/social-satisfaction/posts/?feedView=all",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@SocialSatisfactionAgency",
  },
]

export const Footer = () => {
  const { content } = useContent()
  const logoSrc = content.logo || "/satisfactionlogo.png"

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black px-8 pt-32 pb-12 md:px-16">
      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16">
        <div className="space-y-8">
          <Link to="/">
            <img
              src={logoSrc}
              alt="Social Satisfaction"
              className="h-12 w-auto md:h-14"
            />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-white/40">
            Full-service marketing agency specialising in creative direction,
            brand identity, and commercial production.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
            Navigation
          </h4>
          <ul className="space-y-4">
            {["About", "Services", "Portfolio", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="text-sm font-light tracking-wide text-white/70 transition-colors hover:text-white"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
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
          <h4 className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
            Contact
          </h4>
          <p className="text-sm font-light tracking-wide text-white/70">
            info@socialsatisfaction.com
          </p>
          <Link to="/contact" className="btn-industrial-sm mt-4 inline-block">
            Start a Project
          </Link>
        </div>
      </div>

      <div className="mt-32 flex flex-col justify-between gap-4 pt-8 md:flex-row md:items-center">
        <p className="text-xs tracking-widest text-white/15 uppercase">
          © {new Date().getFullYear()} Social Satisfaction. All Rights Reserved
        </p>
        <p className="text-xs tracking-widest text-white/15 uppercase">
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

    </footer>
  )
}
