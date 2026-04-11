import { ExternalLink, RotateCcw } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { ConfirmDialog } from "./components/misc"
import { useContent } from "./context/content-context"

export const AdminTopbar = () => {
  const { reset } = useContent()
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-black px-6">
        <div className="flex items-center gap-4">
          <img src="/satisfactionlogo.png" alt="Social Satisfaction" className="h-7 w-auto" />
          <span className="border-l border-white/10 pl-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
            Content Manager
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* LOCAL ONLY badge */}
          <span className="hidden border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.25em] text-yellow-400/70 uppercase md:block">
            Local Preview Only
          </span>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-white/40 uppercase transition-colors hover:text-white"
          >
            <ExternalLink size={12} />
            View Site
          </Link>

          <button
            onClick={() => setConfirming(true)}
            className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-white/30 uppercase transition-colors hover:text-white"
            title="Reset all content to defaults"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      </header>

      {confirming && (
        <ConfirmDialog
          message="Reset all content to defaults? This will clear all local edits."
          onConfirm={() => { reset(); setConfirming(false) }}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  )
}
