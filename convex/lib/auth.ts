import { getAuthUserId } from "@convex-dev/auth/server"
import type { Auth } from "convex/server"
import { ConvexError } from "convex/values"

/**
 * Require an authenticated user. Call at the top of every admin mutation.
 * Returns the authenticated user's id, or throws if the request is anonymous.
 */
export async function requireAuth(ctx: { auth: Auth }) {
  const userId = await getAuthUserId(ctx)
  if (userId === null) {
    throw new ConvexError("Not authenticated")
  }
  return userId
}
