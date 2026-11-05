import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { preload } from "../../lib/convex"
import { MasonryGrid } from "../../ui/masonry-grid"
import { CtaRow, Meta, PageHeader } from "../../ui/page"
import { ProjectCardLink } from "../services/service"

export const loader = async () => {
  await preload(api.projects.restaurants)
  return null
}

export const Component = () => {
  const projects = useQuery(api.projects.restaurants) ?? []

  return (
    <div className="pt-32">
      <Meta title="Restaurants" />
      <PageHeader title="RESTAURANTS" />
      <div className="px-8 py-8 md:px-16">
        <MasonryGrid>
          {projects.map((project, index) => (
            <ProjectCardLink key={project._id} project={project} index={index} />
          ))}
        </MasonryGrid>
      </div>
      <CtaRow back={{ to: "/portfolio", label: "Portfolio" }} />
    </div>
  )
}
