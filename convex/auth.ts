import { Password } from "@convex-dev/auth/providers/Password"
import { convexAuth } from "@convex-dev/auth/server"
import { ConvexError } from "convex/values"
import type { DataModel } from "./_generated/dataModel"

// Emails permitted to create an account, set on the Convex deployment as a
// comma-separated env var, e.g.
//   npx convex env set ADMIN_EMAILS "you@example.com,other@example.com"
// Existing accounts can always log in; this only gates account creation.
function allowedSignupEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? ""
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0),
  )
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    // `profile` runs on account creation (sign-up) but not on sign-in, so
    // throwing here blocks unauthorized sign-ups while leaving login open.
    Password<DataModel>({
      profile(params) {
        const email = String(params.email ?? "")
          .trim()
          .toLowerCase()
        if (!email) {
          throw new ConvexError("An email address is required.")
        }
        if (!allowedSignupEmails().has(email)) {
          throw new ConvexError("This email is not authorized to sign up.")
        }
        return { email }
      },
    }),
  ],
})
