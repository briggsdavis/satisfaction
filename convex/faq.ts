import { v } from "convex/values"
import { query } from "./_generated/server"
import { adminMutation } from "./lib/auth"
import { crud, nextOrder } from "./lib/crud"
import { faqItem, faqSection } from "./model"

/** Every section with its items, ordered. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db.query("faqSections").withIndex("by_order").take(50)
    return await Promise.all(
      sections.map(async (section) => ({
        ...section,
        items: await ctx.db
          .query("faqItems")
          .withIndex("by_sectionId_and_order", (q) => q.eq("sectionId", section._id))
          .take(100),
      })),
    )
  },
})

export const createSection = adminMutation({
  args: {},
  returns: v.id("faqSections"),
  handler: async (ctx) => {
    const last = await ctx.db.query("faqSections").withIndex("by_order").order("desc").first()
    return await ctx.db.insert("faqSections", { name: "New Section", order: nextOrder(last) })
  },
})

const sections = crud("faqSections", faqSection.omit("order"))
export const updateSection = sections.update
export const reorderSections = sections.reorder

export const removeSection = adminMutation({
  args: { id: v.id("faqSections") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const items = await ctx.db
      .query("faqItems")
      .withIndex("by_sectionId_and_order", (q) => q.eq("sectionId", id))
      .take(500)
    for (const item of items) await ctx.db.delete("faqItems", item._id)
    await ctx.db.delete("faqSections", id)
    return null
  },
})

export const createItem = adminMutation({
  args: { sectionId: v.id("faqSections") },
  returns: v.id("faqItems"),
  handler: async (ctx, { sectionId }) => {
    const last = await ctx.db
      .query("faqItems")
      .withIndex("by_sectionId_and_order", (q) => q.eq("sectionId", sectionId))
      .order("desc")
      .first()
    return await ctx.db.insert("faqItems", {
      sectionId,
      question: "New question",
      answer: "",
      order: nextOrder(last),
    })
  },
})

const items = crud("faqItems", faqItem.pick("question", "answer"))
export const updateItem = items.update
export const removeItem = items.remove
export const reorderItems = items.reorder
