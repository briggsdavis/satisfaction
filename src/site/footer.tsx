import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Link } from "../ui/link"
import { LOGO_SRC } from "./navbar"
import { socials } from "./socials"

const NAV = ["About", "Services", "Portfolio", "Contact"]
const YEAR = new Date().getFullYear()

const heading = "text-xs font-bold tracking-[0.3em] text-white/60 uppercase"
const item = "text-sm font-light tracking-wide text-white/85 transition-colors hover:text-white"
const fine = "text-xs tracking-widest text-white/50 uppercase"

export const Footer = () => {
  const site = useQuery(api.site.get)

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black px-8 pt-32 pb-12 md:px-16">
      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16">
        <div className="space-y-8">
          <Link to="/">
            <img
              src={LOGO_SRC}
              alt="Social Satisfaction"
              width={168}
              height={168}
              decoding="async"
              className="h-12 w-auto md:h-14"
            />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed whitespace-pre-line text-white/60">
            {site?.footer}
          </p>
        </div>

        <div className="space-y-6">
          <h4 className={heading}>Navigation</h4>
          <ul className="space-y-4">
            {NAV.map((label) => (
              <li key={label}>
                <Link to={`/${label.toLowerCase()}`} className={item}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className={heading}>Social</h4>
          <ul className="space-y-4">
            {site &&
              socials(site.contact).map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={item}>
                    {label}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className={heading}>Contact</h4>
          {site?.contact.email && (
            <p className="text-sm font-light tracking-wide text-white/85">{site.contact.email}</p>
          )}
          <Link to="/contact" className="btn-industrial-sm mt-4 inline-block">
            Start a Project
          </Link>
        </div>
      </div>

      <div className="mt-32 flex flex-col justify-between gap-4 pt-8 md:flex-row md:items-center">
        <p className={fine}>© {YEAR} Social Satisfaction. All Rights Reserved</p>
        <div className="flex items-center gap-6">
          <Link to="/credits" className={`${fine} transition-colors hover:text-white`}>
            Credits
          </Link>
          <p className={fine}>
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
      </div>
    </footer>
  )
}
