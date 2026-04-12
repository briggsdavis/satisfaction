import { ExternalLink, Save } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"

export const AdminTopbar = () => {
  const [savedFeedback, setSavedFeedback] = useState(false)

  const handleSave = () => {
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 2000)
  }

  return (
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
          onClick={handleSave}
          className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs font-bold tracking-[0.2em] uppercase transition-all ${
            savedFeedback
              ? "border-white/30 bg-white/10 text-white"
              : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
          }`}
        >
          <Save size={12} />
          {savedFeedback ? "Saved" : "Save"}
        </button>
      </div>
    </header>
  )
}
