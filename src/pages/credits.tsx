import { Link } from "react-router"

export const Credits = () => (
  <main className="min-h-screen bg-black px-8 pt-40 pb-24 md:px-16">
    <div className="max-w-2xl">
      <h1 className="mb-12 text-xs font-bold tracking-[0.35em] text-white/40 uppercase">Credits</h1>

      <section className="space-y-4">
        <h2 className="text-xs font-bold tracking-[0.3em] text-white/25 uppercase">3D Assets</h2>
        <p className="text-sm leading-relaxed text-white/60">
          <a
            href="https://skfb.ly/6WOHR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 underline underline-offset-4 transition-colors hover:text-white"
          >
            2009 – 2011 iMac, 27 inch
          </a>{" "}
          by Ne0nGenisis is licensed under{" "}
          <a
            href="http://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 underline underline-offset-4 transition-colors hover:text-white"
          >
            Creative Commons Attribution 4.0 International
          </a>
          .
        </p>
      </section>

      <div className="mt-16">
        <Link
          to="/"
          className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase transition-colors hover:text-white/60"
        >
          ← Back
        </Link>
      </div>
    </div>
  </main>
)
