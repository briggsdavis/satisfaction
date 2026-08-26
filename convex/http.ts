import { httpRouter } from "convex/server"
import type { Id } from "./_generated/dataModel"
import { httpAction } from "./_generated/server"
import { auth } from "./auth"

const http = httpRouter()

auth.addHttpRoutes(http)

// ─── Hero video (CDN-cacheable) ─────────────────────────────────────────────
// Serves a stored video at a stable, content-addressed URL with an immutable
// long-lived Cache-Control so a CDN (Cloudflare) and the browser can cache it
// indefinitely. Because the storageId is unique per upload, the URL never
// needs to change for a given file — replacing the video produces a new id and
// therefore a new URL, so stale caches are never served.
http.route({
  path: "/hero-video",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const id = new URL(req.url).searchParams.get("id")
    if (!id) return new Response("missing id", { status: 400 })

    let blob: Blob | null = null
    try {
      blob = await ctx.storage.get(id as Id<"_storage">)
    } catch {
      return new Response("invalid id", { status: 400 })
    }
    if (!blob) return new Response("not found", { status: 404 })

    return new Response(blob, {
      headers: {
        "Content-Type": blob.type || "video/mp4",
        "Cache-Control": "public, max-age=31536000, immutable",
        // Allow the WebGL VideoTexture to read pixels cross-origin.
        "Access-Control-Allow-Origin": "*",
      },
    })
  }),
})

export default http
