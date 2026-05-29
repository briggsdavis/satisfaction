import { useAuthActions } from "@convex-dev/auth/react"
import { ConvexError } from "convex/values"
import { useState } from "react"

type Flow = "signIn" | "signUp"

export const AdminLogin = () => {
  const { signIn } = useAuthActions()
  const [flow, setFlow] = useState<Flow>("signIn")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    formData.set("flow", flow)
    try {
      await signIn("password", formData)
    } catch (err) {
      // ConvexError (e.g. email not allowlisted) carries a readable message in
      // `.data`; anything else falls back to a generic credentials message.
      const message =
        err instanceof ConvexError
          ? String(err.data)
          : flow === "signUp"
            ? "Could not sign up. Check your details and try again."
            : "Invalid email or password."
      setError(message)
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <img src="/logo/satisfaction.png" alt="Social Satisfaction" className="h-9 w-auto" />
        </div>

        <h1 className="mb-1 text-center text-lg font-bold tracking-[0.2em] uppercase">
          {flow === "signIn" ? "Admin Sign In" : "Admin Sign Up"}
        </h1>
        <p className="mb-8 text-center text-xs tracking-[0.15em] text-white/40 uppercase">
          {flow === "signIn" ? "Log in to manage content" : "Create an authorized account"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-label="Email"
            placeholder="Email"
            className="rounded border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/40"
          />
          <input
            name="password"
            type="password"
            required
            autoComplete={flow === "signIn" ? "current-password" : "new-password"}
            aria-label="Password"
            placeholder="Password"
            className="rounded border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/40"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-white px-4 py-3 text-xs font-bold tracking-[0.2em] text-black uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {submitting ? "..." : flow === "signIn" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError(null)
            setFlow(flow === "signIn" ? "signUp" : "signIn")
          }}
          className="mt-6 w-full text-center text-xs tracking-[0.15em] text-white/40 uppercase transition-colors hover:text-white"
        >
          {flow === "signIn" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  )
}
