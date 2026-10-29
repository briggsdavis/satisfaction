import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

type Ctx = Pick<QueryCtx, "storage">

export const url = async (ctx: Ctx, id: Id<"_storage"> | null | undefined) =>
  id ? await ctx.storage.getUrl(id) : null

export const urls = (ctx: Ctx, ids: readonly (Id<"_storage"> | null | undefined)[]) =>
  Promise.all(ids.map((id) => url(ctx, id)))

/** Every storage id referenced anywhere inside `value`. */
const fileIds = (ctx: MutationCtx, value: unknown, out = new Set<Id<"_storage">>()) => {
  if (typeof value === "string") {
    const id = ctx.db.system.normalizeId("_storage", value)
    if (id) out.add(id)
  } else if (Array.isArray(value)) for (const item of value) fileIds(ctx, item, out)
  else if (value && typeof value === "object")
    for (const [key, item] of Object.entries(value))
      if (!key.startsWith("_")) fileIds(ctx, item, out)
  return out
}

/**
 * Deletes files referenced by `before` that `after` no longer references.
 * Call after any write that can replace or drop media, so storage never orphans.
 */
export const prune = async (ctx: MutationCtx, before: unknown, after: unknown) => {
  const kept = fileIds(ctx, after)
  for (const id of fileIds(ctx, before))
    if (!kept.has(id) && (await ctx.db.system.get("_storage", id))) await ctx.storage.delete(id)
}
