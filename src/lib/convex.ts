import { ConvexReactClient } from "convex/react"
import type { FunctionArgs, FunctionReference, FunctionReturnType } from "convex/server"

export const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

/**
 * Loader helper: fetches a query and keeps its subscription warm so the
 * route's `useQuery` renders synchronously on mount, no pop-in.
 */
export const preload = <Q extends FunctionReference<"query">>(
  query: Q,
  ...[args]: FunctionArgs<Q> extends Record<string, never> ? [] : [FunctionArgs<Q>]
): Promise<FunctionReturnType<Q>> => {
  const a = (args ?? {}) as FunctionArgs<Q>
  convex.prewarmQuery({ query, args: a, extendSubscriptionFor: 15_000 })
  return convex.query(query, a)
}
