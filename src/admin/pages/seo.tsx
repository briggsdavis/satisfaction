import { AdminTextareaField, AdminTextField } from "../components/fields"
import { SectionHeader } from "../components/misc"
import { useContent } from "../context/content-context"

export const SeoAdmin = () => {
  const { content, update } = useContent()
  const seo = content.seo

  const set = (key: keyof typeof seo, value: string) =>
    update("seo", { ...seo, [key]: value })

  return (
    <div className="max-w-2xl">
      <SectionHeader title="SEO & Meta Tags" description="Edit meta tag values. These are currently hardcoded in index.html — edits here are locally previewed only." />

      <div className="mb-6 border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 text-xs text-yellow-400/60">
        These values are currently hardcoded in <code>index.html</code>. In this phase, edits are stored locally only. To apply changes, update <code>index.html</code> directly.
      </div>

      <AdminTextField label="Page Title" value={seo.title} onChange={(v) => set("title", v)} />
      <AdminTextareaField label="Description" value={seo.description} onChange={(v) => set("description", v)} rows={3} />
      <AdminTextareaField label="Keywords" value={seo.keywords} onChange={(v) => set("keywords", v)} rows={2} />
      <AdminTextField label="Author" value={seo.author} onChange={(v) => set("author", v)} />

      <div className="mt-6 mb-2">
        <p className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase">Open Graph</p>
      </div>
      <AdminTextField label="OG Title" value={seo.ogTitle} onChange={(v) => set("ogTitle", v)} />
      <AdminTextareaField label="OG Description" value={seo.ogDescription} onChange={(v) => set("ogDescription", v)} rows={2} />
      <AdminTextField label="OG URL" value={seo.ogUrl} onChange={(v) => set("ogUrl", v)} />
      <AdminTextField label="OG Site Name" value={seo.ogSiteName} onChange={(v) => set("ogSiteName", v)} />

      <div className="mt-6 mb-2">
        <p className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase">Twitter / X Card</p>
      </div>
      <AdminTextField label="Twitter Title" value={seo.twitterTitle} onChange={(v) => set("twitterTitle", v)} />
      <AdminTextareaField label="Twitter Description" value={seo.twitterDescription} onChange={(v) => set("twitterDescription", v)} rows={2} />
      <AdminTextField label="Twitter Creator" value={seo.twitterCreator} onChange={(v) => set("twitterCreator", v)} />
      <AdminTextField label="Canonical URL" value={seo.canonical} onChange={(v) => set("canonical", v)} />
    </div>
  )
}
