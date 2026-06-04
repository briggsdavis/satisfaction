// Cloudflare Worker: CDN cache in front of the Convex /hero-video endpoint.
//
// Flow:  browser ──► this Worker (Cloudflare edge) ──► Convex .convex.site
//                         │ caches the response at the edge
//                         ▼
//        cache HIT ──► served from Cloudflare (free bandwidth, no Convex hit)
//
// The URL is content-addressed (?id=<storageId> never changes for a given
// file), so we can cache immutably and forever. Replacing the video in the
// admin produces a new id → new URL → no stale-cache problem.
export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("method not allowed", { status: 405 })
    }

    const url = new URL(request.url)
    if (url.pathname !== "/hero-video") {
      return new Response("not found", { status: 404 })
    }

    const cache = caches.default
    const cacheKey = new Request(url.toString(), request)

    // Serve from the edge cache when we can (honors Range requests for seeking).
    const cached = await cache.match(cacheKey)
    if (cached) return cached

    // Miss → fetch the bytes from Convex (the only time we pay Convex egress).
    const origin = env.CONVEX_SITE_URL.replace(/\/$/, "") + url.pathname + url.search
    const upstream = await fetch(origin, { headers: { Range: request.headers.get("Range") ?? "" } })
    if (!upstream.ok && upstream.status !== 206) {
      return new Response("upstream error", { status: upstream.status })
    }

    const response = new Response(upstream.body, upstream)
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
    response.headers.set("Access-Control-Allow-Origin", "*") // WebGL VideoTexture needs this
    response.headers.delete("set-cookie")

    // Store a full copy in the edge cache (200s only; don't cache partials).
    if (upstream.status === 200) ctx.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  },
}
