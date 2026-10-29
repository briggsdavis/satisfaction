import { useAuthActions } from "@convex-dev/auth/react"
import { ConvexError } from "convex/values"
import { useState } from "react"

type Flow = "signIn" | "signUp"

const field =
  "rounded border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/40"

export const Login = () => {
  const { signIn } = useAuthActions()
  const [flow, setFlow] = useState<Flow>("signIn")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const signingIn = flow === "signIn"

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const data = new FormData(event.currentTarget)
    data.set("flow", flow)
    try {
      await signIn("password", data)
    } catch (err) {
      // ConvexError (e.g. email not allowlisted) carries a readable message.
      setError(
        err instanceof ConvexError
          ? String(err.data)
          : signingIn
            ? "Invalid email or password."
            : "Could not sign up. Check your details and try again.",
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-sm">
        <img
          src="/brand/logo.png"
          alt="Social Satisfaction"
          className="mx-auto mb-8 h-9 w-auto"
        />
        <h1 className="mb-1 text-center text-lg font-bold tracking-[0.2em] uppercase">
          {signingIn ? "Admin Sign In" : "Admin Sign Up"}
        </h1>
        <p className="mb-8 text-center text-xs tracking-[0.15em] text-white/40 uppercase">
          {signingIn ? "Log in to manage content" : "Create an authorized account"}
        </p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-label="Email"
            placeholder="Email"
            className={field}
          />
          <input
            name="password"
            type="password"
            required
            autoComplete={signingIn ? "current-password" : "new-password"}
            aria-label="Password"
            placeholder="Password"
            className={field}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-white px-4 py-3 text-xs font-bold tracking-[0.2em] text-black uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {submitting ? "…" : signingIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setError(null)
            setFlow(signingIn ? "signUp" : "signIn")
          }}
          className="mt-6 w-full text-center text-xs tracking-[0.15em] text-white/40 uppercase transition-colors hover:text-white"
        >
          {signingIn ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  )
}
