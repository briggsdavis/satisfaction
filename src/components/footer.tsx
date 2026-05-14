import { useQuery } from "convex/react"
import { Link } from "react-router"
import { api } from "../../convex/_generated/api"

export const Footer = () => {
  const footer = useQuery(api.footer.get)
  const info = useQuery(api.contact.getInfo)

  const social: { label: string; href: string }[] = []
  if (info?.instagram)
    social.push({
      label: "Instagram",
      href: `https://www.instagram.com/${info.instagram}`,
    })
  if (info?.tiktok)
    social.push({
      label: "TikTok",
      href: `https://www.tiktok.com/@${info.tiktok}`,
    })
  if (info?.linkedin) social.push({ label: "LinkedIn", href: info.linkedin })
  if (info?.youtube)
    social.push({
      label: "YouTube",
      href: `https://www.youtube.com/@${info.youtube}`,
    })

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black px-8 pt-32 pb-12 md:px-16">
      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16">
        <div className="space-y-8">
          <Link to="/">
            <img
              src="/logo/satisfaction.png"
              alt="Social Satisfaction"
              className="h-12 w-auto md:h-14"
            />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed whitespace-pre-line text-white/40">
            {footer?.description}
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
            {social.map((item) => (
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
          {info?.email && (
            <p className="text-sm font-light tracking-wide text-white/70">
              {info.email}
            </p>
          )}
          <Link to="/contact" className="btn-industrial-sm mt-4 inline-block">
            Start a Project
          </Link>
        </div>
      </div>

      <div className="mt-32 flex flex-col justify-between gap-4 pt-8 md:flex-row md:items-center">
        <p className="text-xs tracking-widest text-white/15 uppercase">
          © {new Date().getFullYear()} Social Satisfaction. All Rights Reserved
        </p>
        <div className="flex items-center gap-6">
          <Link
            to="/credits"
            className="text-xs tracking-widest text-white/15 uppercase transition-colors hover:text-white/40"
          >
            Credits
          </Link>
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
      </div>
    </footer>
  )
}
