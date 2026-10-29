import { v } from "convex/values"
import { adminMutation } from "./lib/auth"

export const generateUploadUrl = adminMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
})
