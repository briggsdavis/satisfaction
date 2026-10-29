import { useEffect, type ReactNode } from "react"
import { useTitleDelay } from "../lib/hooks"
import { FitTitle } from "./fit-title"
import { Link } from "./link"

const SITE = "Social Satisfaction"

/** Sets the document title and description for the current route. */
export const Meta = ({ title, description }: { title?: string; description?: string }) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : SITE
    if (description)
      document.querySelector('meta[name="description"]')?.setAttribute("content", description)
  }, [title, description])
  return null
}

export const Eyebrow = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => (
  <span className={`block text-xs font-bold tracking-[0.4em] text-white/30 uppercase ${className}`}>
    {children}
  </span>
)

/** Centered page header: optional eyebrow over a full-width fitted title. */
export const PageHeader = ({
  title,
  eyebrow,
  rule = "border-b border-white/10",
}: {
  title: string
  eyebrow?: string
  rule?: string
}) => (
  <section className={`${rule} px-8 pb-16 text-center md:px-16`}>
    <Meta title={title.charAt(0) + title.slice(1).toLowerCase()} />
    {eyebrow && <Eyebrow className="mb-6">{eyebrow}</Eyebrow>}
    <FitTitle text={title} slideFrom="left" delay={useTitleDelay()} />
  </section>
)

const cta =
  "btn-industrial max-md:flex max-md:justify-center max-md:px-3 max-md:text-[10px] max-md:whitespace-nowrap"

/** Bottom-of-page "back / start a project" row. */
export const CtaRow = ({ back }: { back: { to: string; label: string } }) => (
  <div className="flex flex-col items-stretch justify-between gap-4 border-t border-white/10 px-8 py-16 md:flex-row md:items-center md:px-16">
    <Link to={back.to} className={cta}>
      ← {back.label}
    </Link>
    <Link to="/contact" className={cta}>
      Start a Project →
    </Link>
  </div>
)

export const ColumnLines = ({ style }: { style?: React.CSSProperties }) =>
  Array.from({ length: 7 }, (_, i) => (
    <div
      key={i}
      aria-hidden
      className={`column-line${i % 2 ? " hidden md:block" : ""}`}
      style={{ left: `${(100 / 6) * i}%`, ["--sweep-delay" as string]: `${i * 0.75}s`, ...style }}
    />
  ))
