import { BackButton, SectionHeader } from "../../components/misc"
import { useContent } from "../../context/content-context"

export const FeaturedAdmin = () => {
  const { content, update } = useContent()
  const slugs = content.featuredSlugs

  // Flatten all projects from all categories
  const allProjects = content.categories.flatMap((cat) =>
    cat.projects.map((p) => ({ ...p, categoryName: cat.name, categorySlug: cat.slug })),
  )

  const toggle = (slug: string) => {
    const selected = [...slugs]
    const idx = selected.indexOf(slug)
    if (idx >= 0) {
      selected.splice(idx, 1)
    } else {
      if (selected.length >= 3) return // max 3
      selected.push(slug)
    }
    update("featuredSlugs", selected as typeof slugs)
  }

  const featuredProjects = slugs.map((s) => allProjects.find((p) => p.slug === s)).filter(Boolean)

  return (
    <div className="max-w-3xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="Featured Projects"
        description="Choose exactly 3 projects to appear in the homepage cascade. Select up to 3."
      />

      {/* Preview */}
      <div className="mb-8 border border-white/10 p-4">
        <p className="mb-3 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Currently Featured ({featuredProjects.length}/3)
        </p>
        <div className="flex gap-3">
          {featuredProjects.map((p) =>
            p ? (
              <div key={p.slug} className="flex-1 border border-white/10">
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-28 w-full object-cover opacity-80"
                />
                <div className="p-2">
                  <p className="text-xs font-bold truncate">{p.title}</p>
                  <p className="text-[10px] text-white/40">{p.descriptor}</p>
                </div>
              </div>
            ) : null,
          )}
          {Array.from({ length: 3 - featuredProjects.length }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border border-dashed border-white/10 h-36 flex items-center justify-center text-xs text-white/20"
            >
              Empty slot
            </div>
          ))}
        </div>
      </div>

      {/* All projects with toggles */}
      <div className="space-y-0">
        {content.categories.map((cat) => (
          <div key={cat.slug} className="mb-4">
            <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">
              {cat.name}
            </p>
            {cat.projects.map((project) => {
              const isSelected = slugs.includes(project.slug)
              const isDisabled = !isSelected && slugs.length >= 3

              return (
                <button
                  key={project.slug}
                  onClick={() => toggle(project.slug)}
                  disabled={isDisabled}
                  className={`flex w-full items-center gap-4 border-b border-white/10 py-3 text-left transition-colors ${
                    isDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`h-4 w-4 shrink-0 border transition-colors ${
                      isSelected ? "border-white bg-white" : "border-white/30"
                    }`}
                  />
                  <img
                    src={project.img}
                    alt={project.title}
                    className="h-10 w-16 shrink-0 object-cover opacity-70"
                  />
                  <div>
                    <p className="text-sm font-bold">{project.title}</p>
                    <p className="text-xs text-white/40">{project.descriptor} · {project.tags.join(", ")}</p>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
