import { v, type PropertyValidators, type VObject } from "convex/values"
import type { DataModel, Id, TableNames } from "../_generated/dataModel"
import type { MutationCtx } from "../_generated/server"
import { adminMutation } from "./auth"
import { prune } from "./files"

type Patch<T extends TableNames> = Partial<Omit<DataModel[T]["document"], "_id" | "_creationTime">>

/** Patches a document, then deletes any media the patch dropped. */
export const patchDoc = async <T extends TableNames>(
  ctx: MutationCtx,
  table: T,
  id: Id<T>,
  patch: Patch<T>,
) => {
  const before = await ctx.db.get(table, id)
  if (!before) throw new Error(`${table} not found`)
  await ctx.db.patch(table, id, patch as never)
  await prune(ctx, before, await ctx.db.get(table, id))
}

/** Deletes a document and the media it owned. */
export const removeDoc = async <T extends TableNames>(ctx: MutationCtx, table: T, id: Id<T>) => {
  const before = await ctx.db.get(table, id)
  if (!before) return
  await ctx.db.delete(table, id)
  await prune(ctx, before, null)
}

/** Writes `order = index` for each id, in one transaction. */
export const reorderDocs = async <T extends TableNames>(
  ctx: MutationCtx,
  table: T,
  ids: Id<T>[],
) => {
  for (const [order, id] of ids.entries()) await ctx.db.patch(table, id, { order } as never)
}

/** The next free `order` given the current last document (if any). */
export const nextOrder = (last: { order: number } | null) => (last?.order ?? -1) + 1

/** Admin `update`, `remove`, and `reorder` mutations; `editable` = patchable fields. */
export const crud = <T extends TableNames, Shape, F extends PropertyValidators>(
  table: T,
  editable: VObject<Shape, F>,
) => ({
  update: adminMutation({
    args: { id: v.id(table), patch: editable.partial() },
    returns: v.null(),
    handler: async (ctx, { id, patch }) => {
      await patchDoc(ctx, table, id as Id<T>, patch as Patch<T>)
      return null
    },
  }),
  remove: adminMutation({
    args: { id: v.id(table) },
    returns: v.null(),
    handler: async (ctx, { id }) => {
      await removeDoc(ctx, table, id as Id<T>)
      return null
    },
  }),
  reorder: adminMutation({
    args: { ids: v.array(v.id(table)) },
    returns: v.null(),
    handler: async (ctx, { ids }) => {
      await reorderDocs(ctx, table, ids as Id<T>[])
      return null
    },
  }),
})
