import { getAuthUserId } from "@convex-dev/auth/server"
import { customCtx, customMutation, customQuery } from "convex-helpers/server/customFunctions"
import type { Auth } from "convex/server"
import { ConvexError } from "convex/values"
import { mutation, query } from "../_generated/server"

/** Throws unless the caller is signed in. Sign-up is allowlisted in `auth.ts`. */
export const requireAdmin = async (ctx: { auth: Auth }) => {
  const userId = await getAuthUserId(ctx)
  if (userId === null) throw new ConvexError("Not authenticated")
  return userId
}

const admin = customCtx(async (ctx: { auth: Auth }) => ({ userId: await requireAdmin(ctx) }))

export const adminQuery = customQuery(query, admin)
export const adminMutation = customMutation(mutation, admin)
