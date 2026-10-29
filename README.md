# Satisfaction

Social Satisfaction's site and CMS. Vite + React 19 + React Router (data mode) + Convex + Tailwind v4.

```sh
bun install
bun run dev        # convex dev + vite
```

## Layout

```
convex/
  model.ts          every stored shape; tables, args, and client types derive from it
  schema.ts         tables + indexes (plus the temporary `legacy` block)
  lib/              auth (adminQuery/adminMutation), crud, files (url/prune), gallery templates, slug
  site.ts           singleton: hero, what-we-do, campaign, faq cta, footer, contact, values
  services.ts projects.ts showcases.ts logos.ts wheel.ts timeline.ts faq.ts leads.ts files.ts
src/
  router.tsx        route table; feature routes are lazy modules exporting `Component` + `loader`
  site/             persistent shell: Lenis, navbar, footer, cursor, intro loader
  features/         one folder per page; sections live with their page
  ui/               shared presentational pieces (Link, PageHeader, FitTitle, Lightbox, GalleryGrid...)
  edit/             <EditMode> + Editable* primitives
  lib/              convex client + preload, hooks, upload, motion presets, types
  admin/            lazy admin bundle (lists, forms, full-screen page editors)
public/
  brand/            logos, favicon
  fonts/            area-normal (body), arian-lt (display)
  models/           3D assets
  heroes/<variant>/ bespoke service-hero media, one folder per `hero` variant
  llms.txt, .well-known/   AI discovery files
```

## Conventions

- **Queries return URLs.** Every storage field comes back resolved (`imageUrl`, `coverUrl`, `galleryUrls`...). Never fetch a file URL from the client.
- **Media is never orphaned.** Writes go through `patchDoc`/`removeDoc`, which `prune` any file the document stopped referencing.
- **Loaders preload.** A route's `loader` calls `preload(query, args)`, which fetches the data and keeps the subscription warm, so the page is complete when the transition reveals it. Throw `notFound()` for 404s.
- **Scroll is native.** Lenis smooths the window. Pinned scenes use CSS `sticky` + `useScroll({ target })`. Don't transform page ancestors; it breaks `fixed` and `sticky`.
- **Transitions are CSS.** Site `Link` (from `ui/link`) sets `viewTransition`; the column wipe is in `index.css`.
- **One page, two modes.** Public pages render read-only. The admin renders the same component inside `<EditMode>`, where `EditableText`, `EditableRich`, and upload targets turn on. Admin editors are addressed by `_id`, so renames are safe. A service's bespoke hero comes from its `hero` field, not its slug.
- **Ordering** is a single `reorder({ ids })` mutation, atomic.
- **Admin theming** uses the `ink`/`paper` tokens (`text-ink/50`, `bg-paper`); light mode just swaps the two variables.

## v1 -> v2 data migration

Dev is migrated. For each other deployment (e.g. prod), once:

1. Set `schemaValidation = false` in `convex/schema.ts` and deploy.
2. Run `bun x convex run migrations:v2 --prod`.
3. Set `schemaValidation = true` and deploy again. If anything was missed, this deploy fails.

After that, delete `convex/migrations.ts` and the `legacy` block in the schema.
