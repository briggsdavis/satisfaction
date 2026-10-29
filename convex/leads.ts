import { ConvexError, v } from "convex/values"
import { mutation } from "./_generated/server"
import { adminMutation, adminQuery } from "./lib/auth"
import { leadKind } from "./model"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELDS = 20
const MAX_LENGTH = 5000

/** Public form endpoint. `fields.website` is a honeypot: filled means bot. */
export const submit = mutation({
  args: {
    kind: leadKind,
    name: v.string(),
    email: v.string(),
    fields: v.record(v.string(), v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { kind, name, email, fields }) => {
    const { website, ...rest } = fields
    if (website) return null
    name = name.trim()
    email = email.trim().toLowerCase()
    const entries = Object.entries(rest)
      .map(([key, value]) => [key, value.trim()] as const)
      .filter(([, value]) => value)
    if (!name || name.length > 200) throw new ConvexError("Please enter your name.")
    if (!EMAIL.test(email) || email.length > 320)
      throw new ConvexError("Please enter a valid email.")
    if (
      entries.length > MAX_FIELDS ||
      entries.some(([k, val]) => k.length > 64 || val.length > MAX_LENGTH)
    )
      throw new ConvexError("That message is too long.")
    await ctx.db.insert("leads", {
      kind,
      name,
      email,
      fields: Object.fromEntries(entries),
      read: false,
    })
    return null
  },
})

export const list = adminQuery({
  args: {},
  handler: async (ctx) => await ctx.db.query("leads").order("desc").take(200),
})

export const unread = adminQuery({
  args: {},
  returns: v.number(),
  handler: async (ctx) =>
    (
      await ctx.db
        .query("leads")
        .withIndex("by_read", (q) => q.eq("read", false))
        .take(100)
    ).length,
})

export const setRead = adminMutation({
  args: { id: v.id("leads"), read: v.boolean() },
  returns: v.null(),
  handler: async (ctx, { id, read }) => {
    await ctx.db.patch("leads", id, { read })
    return null
  },
})

export const remove = adminMutation({
  args: { id: v.id("leads") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await ctx.db.delete("leads", id)
    return null
  },
})
