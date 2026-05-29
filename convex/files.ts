import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx)
    return await ctx.storage.generateUploadUrl()
  },
})

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId)
  },
})

export const remove = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    await ctx.storage.delete(args.storageId)
  },
})
