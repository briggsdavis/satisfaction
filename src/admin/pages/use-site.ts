import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import type { SiteData } from "../../lib/types"

/** The site singleton plus a section-level patch. */
export const useSite = () => {
  const site = useQuery(api.site.get)
  const update = useMutation(api.site.update)
  const patch = (p: Parameters<typeof update>[0]["patch"]) => update({ patch: p })
  return [site, patch] as const
}

/** Values as stored (drops the resolved URLs). */
export const storedValues = (values: SiteData["values"]) =>
  values.map(({ label, body, image }) => (image ? { label, body, image } : { label, body }))
