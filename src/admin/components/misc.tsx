import { CheckCircle2, ChevronLeft } from "lucide-react"
import React from "react"
import { Link } from "react-router"

// Back navigation button for sub-pages
export const BackButton = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="mb-6 flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-white/40 uppercase transition-colors hover:text-white"
  >
    <ChevronLeft size={13} />
    {label}
  </Link>
)

// Section wrapper with title + optional description
export const SectionHeader = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => (
  <div className="mb-8 border-b border-white/10 pb-6">
    <h2 className="text-2xl font-bold tracking-tight uppercase">{title}</h2>
    {description && (
      <p className="mt-2 text-sm text-white/50">{description}</p>
    )}
  </div>
)

// "Appears on: [badge] [badge]" indicator for services
export const RouteBadge = ({ routes }: { routes: string[] }) => (
  <div className="mt-4 flex flex-wrap items-center gap-2">
    <span className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
      Appears on:
    </span>
    {routes.map((r) => (
      <span
        key={r}
        className="flex items-center gap-1.5 border border-white/20 px-2.5 py-1 text-xs font-bold tracking-[0.2em] text-white/60 uppercase"
      >
        <CheckCircle2 size={10} className="text-green-400" />
        {r}
      </span>
    ))}
  </div>
)

// Read-only frame with label overlay
export const ReadOnlyFrame = ({ children, label = "READ ONLY" }: { children: React.ReactNode; label?: string }) => (
  <div className="relative mb-8 border border-white/10">
    <div className="pointer-events-none absolute inset-0 z-10 bg-black/40" />
    <div className="absolute top-3 right-3 z-20 bg-black px-2 py-1 text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase border border-white/10">
      {label}
    </div>
    <div className="pointer-events-none overflow-hidden">{children}</div>
  </div>
)

// Confirm dialog
export const ConfirmDialog = ({
  message,
  onConfirm,
  onCancel,
}: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
    <div className="border border-white/20 bg-black p-8 max-w-sm w-full mx-4">
      <p className="mb-6 text-sm text-white/70">{message}</p>
      <div className="flex gap-3">
        <button onClick={onConfirm} className="btn-industrial-sm flex-1">
          Confirm
        </button>
        <button onClick={onCancel} className="btn-industrial-sm flex-1">
          Cancel
        </button>
      </div>
    </div>
  </div>
)
