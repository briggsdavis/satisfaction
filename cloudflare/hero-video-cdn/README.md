# hero-video-cdn

A tiny Cloudflare Worker that caches the hero iMac-screen video in front of
Convex, so we don't pay Convex egress on every homepage load. It serves cache
hits from Cloudflare's edge (free bandwidth).

It is **fully isolated** from the rest of the stack — it does not touch the
domain DNS (Squarespace), the app host (Vercel), or any Convex code. It lives on
a free `*.workers.dev` URL that is only ever used as a `<video src>`.

## One-time setup

1. **Point it at your production Convex deployment.**
   Edit `wrangler.toml` → set `CONVEX_SITE_URL` to your **prod** deployment's
   HTTP Actions URL (the `*.convex.site` one). Convex dashboard → Settings →
   "HTTP Actions URL". (Your local `.env.local` has the *dev* one — don't use that.)

2. **Log in and deploy.** From this folder:
   ```sh
   npx wrangler login      # opens the browser; authorizes your Cloudflare account
   npx wrangler deploy
   ```
   Deploy prints the public URL, e.g. `https://hero-video-cdn.<you>.workers.dev`.

3. **Tell the app to use it.** In the **Vercel** project → Settings → Environment
   Variables, add (Production + Preview):
   ```
   VITE_VIDEO_CDN_URL = https://hero-video-cdn.<you>.workers.dev
   ```
   Redeploy. The frontend's `heroVideoSrc()` already prefers this var and falls
   back to the Convex site URL when it's unset, so nothing breaks before/after.

## Verify

```sh
# First call: MISS (pulled from Convex). Second call: HIT (from Cloudflare edge).
curl -sI "https://hero-video-cdn.<you>.workers.dev/hero-video?id=<aStorageId>" | grep -i 'cf-cache-status\|cache-control'
```

## Notes / limits

- **Free Workers**: 100k requests/day. Thanks to the immutable `Cache-Control`,
  a returning visitor's browser re-serves the video from its own cache and never
  hits the Worker — so this is per *new* viewer, plenty for a marketing site.
  If you outgrow it, Workers Paid ($5/mo) raises it to 10M/mo.
- Only `/hero-video` is proxied; everything else returns 404 by design.
- Replacing the video in admin yields a new storageId → new URL, so caches never
  go stale.
