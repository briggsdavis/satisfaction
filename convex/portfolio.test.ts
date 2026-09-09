/// <reference types="vite/client" />
import { convexTest } from "convex-test"
import { expect, test } from "vitest"
import { api } from "./_generated/api"
import { aspectRatios } from "./lib/gallery"
import schema from "./schema"

const modules = import.meta.glob("./**/*.ts")

async function setup(imageCount = 0) {
  const t = convexTest(schema, modules)
  const { id, userId, gallery } = await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {})
    const gallery = await Promise.all(
      Array.from({ length: imageCount }, () =>
        ctx.storage.store(new Blob(["image"], { type: "image/png" })),
      ),
    )
    const id = await ctx.db.insert("projects", {
      slug: "test",
      title: "Test",
      description: "",
      approach: "",
      execution: "",
      results: "",
      gallery,
      featured: false,
      categoryIds: [],
    })
    return { id, userId, gallery }
  })
  const admin = t.withIdentity({ subject: `${userId}|session` })
  return { t, admin, id, gallery }
}

test("legacy images retain their order and files when columns are first edited", async () => {
  const { t, admin, id, gallery } = await setup(2)
  const before = await t.query(api.portfolio.getProjectGallery, { id })
  expect(before).toHaveLength(1)
  expect(before[0].map((slot) => slot.image)).toEqual(gallery)
  await admin.mutation(api.portfolio.editProjectGallery, { id, edit: { type: "addColumn" } })
  const after = await t.query(api.portfolio.getProjectGallery, { id })
  expect(after).toEqual([before[0], []])
  expect((await t.run((ctx) => ctx.db.get("projects", id)))?.gallery).toEqual(gallery)
})

test("ratios and empty placeholders persist, uploads target their slot after a move", async () => {
  const { t, admin, id } = await setup()
  const edit = (
    edit: Parameters<typeof admin.mutation<typeof api.portfolio.editProjectGallery>>[1]["edit"],
  ) => admin.mutation(api.portfolio.editProjectGallery, { id, edit })
  for (const ratio of aspectRatios) await edit({ type: "addSlot", column: 0, id: ratio, ratio })
  const placeholders = await t.query(api.portfolio.getProjectGallery, { id })
  expect(placeholders[0].map((slot) => slot.ratio)).toEqual(aspectRatios)
  expect(placeholders[0].every((slot) => slot.url === null)).toBe(true)
  await edit({ type: "addColumn" })
  await edit({ type: "moveSlot", id: "9:16", column: 1, index: 0 })
  const image = await t.run((ctx) => ctx.storage.store(new Blob(["upload"], { type: "image/png" })))
  await edit({ type: "setImage", id: "9:16", image })
  const saved = await t.query(api.portfolio.getProjectGallery, { id })
  expect(saved[1][0]).toMatchObject({ id: "9:16", image, ratio: "9:16", url: expect.any(String) })
  expect(saved[0].map((slot) => slot.id)).toEqual(["16:9", "4:5", "5:4", "1:1"])
  await edit({ type: "moveSlot", id: "1:1", column: 0, index: 0 })
  await edit({ type: "setRatio", id: "1:1", ratio: "5:4" })
  expect((await t.query(api.portfolio.getProjectGallery, { id }))[0][0]).toMatchObject({
    id: "1:1",
    ratio: "5:4",
  })
})

test("layout edits require authentication and reject destructive column removal", async () => {
  const { t, admin, id } = await setup(1)
  await expect(
    t.mutation(api.portfolio.editProjectGallery, { id, edit: { type: "addColumn" } }),
  ).rejects.toThrow("Not authenticated")
  await admin.mutation(api.portfolio.editProjectGallery, { id, edit: { type: "addColumn" } })
  await expect(
    admin.mutation(api.portfolio.editProjectGallery, {
      id,
      edit: { type: "removeColumn", column: 0 },
    }),
  ).rejects.toThrow("Only empty")
  await admin.mutation(api.portfolio.editProjectGallery, { id, edit: { type: "addColumn" } })
  await expect(
    admin.mutation(api.portfolio.editProjectGallery, { id, edit: { type: "addColumn" } }),
  ).rejects.toThrow("three columns")
  await admin.mutation(api.portfolio.editProjectGallery, {
    id,
    edit: { type: "removeColumn", column: 1 },
  })
  expect(await t.query(api.portfolio.getProjectGallery, { id })).toHaveLength(2)
})

test("removing slots keeps files and a late upload cannot resurrect a deleted slot", async () => {
  const { t, admin, id, gallery } = await setup(1)
  await admin.mutation(api.portfolio.editProjectGallery, {
    id,
    edit: { type: "removeSlot", id: "legacy-0" },
  })
  await expect(
    admin.mutation(api.portfolio.editProjectGallery, {
      id,
      edit: { type: "setImage", id: "legacy-0", image: gallery[0] },
    }),
  ).rejects.toThrow("no longer exists")
  expect(await t.query(api.portfolio.getProjectGallery, { id })).toEqual([[]])
  expect(await t.run((ctx) => ctx.storage.getUrl(gallery[0]))).not.toBeNull()
})

test("lightbox data includes galleries longer than the old 24-image limit", async () => {
  const { t, id } = await setup(25)
  const columns = await t.query(api.portfolio.getProjectGallery, { id })
  expect(columns.flat().filter((slot) => slot.url)).toHaveLength(25)
})
