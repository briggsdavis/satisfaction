import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import type { ReactNode } from "react"
import { AdminLogin } from "./login"

/**
 * Gates the entire admin tree behind Convex Auth. Shows a loader while auth
 * state resolves, the login form when signed out, and the children once
 * authenticated.
 */
export const RequireAuth = ({ children }: { children: ReactNode }) => (
  <>
    <AuthLoading>
      <div className="flex min-h-screen items-center justify-center bg-black text-xs tracking-[0.2em] text-white/40 uppercase">
        Loading…
      </div>
    </AuthLoading>
    <Unauthenticated>
      <AdminLogin />
    </Unauthenticated>
    <Authenticated>{children}</Authenticated>
  </>
)
