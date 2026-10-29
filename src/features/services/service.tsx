import { useMutation, useQuery } from "convex/react"
import { motion } from "motion/react"
import { useParams, type LoaderFunctionArgs } from "react-router"
import { api } from "../../../convex/_generated/api"
import { useEditing } from "../../edit/edit-mode"
import { EditableText, UploadTarget } from "../../edit/editable"
import { preload } from "../../lib/convex"
import { ease } from "../../lib/motion"
import type { ProjectCard, Service } from "../../lib/types"
import { useFilePicker, useUpload } from "../../lib/upload"
import { Link } from "../../ui/link"
import { MasonryGrid } from "../../ui/masonry-grid"
import { notFound } from "../../ui/not-found"
import { CtaRow, Meta } from "../../ui/page"
import { BrandingProcess } from "./branding-process"
import { heroes } from "./heroes"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const service = await preload(api.services.bySlug, { slug: params.slug! })
  if (!service) throw notFound()
  await Promise.all([
    preload(api.projects.byService, { serviceId: service._id }),
    service.hero === "web-development" && preload(api.showcases.list, { serviceId: service._id }),
  ])
  return null
}

export const Component = () => {
  const service = useQuery(api.services.bySlug, { slug: useParams().slug! })
  return service ? <ServicePage service={service} /> : null
}

const Card = ({ project, index }: { project: ProjectCard; index: number }) => (
  <Link to={`/work/${project.slug}`} className="block h-full w-full min-w-0">
    <motion.div
      className="group relative h-full w-full overflow-hidden rounded-[16px]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease }}
    >
      {project.coverUrl && (
        <motion.img
          src={project.coverUrl}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.7, ease }}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/95 via-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />
      <span className="absolute bottom-6 left-6 flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm md:bottom-8 md:left-8">
        <span className="h-1.5 w-1.5 shrink-0 bg-white/80" />
        {project.title}
      </span>
    </motion.div>
  </Link>
)

/** The service page. Shared verbatim by the admin editor inside <EditMode>. */
export const ServicePage = ({ service }: { service: Service }) => {
  const editing = useEditing()
  const projects = useQuery(api.projects.byService, { serviceId: service._id }) ?? []
  const update = useMutation(api.services.update)
  const upload = useUpload()
  const patch = (p: Parameters<typeof update>[0]["patch"]) => update({ id: service._id, patch: p })
  const picker = useFilePicker(async ([file]) => patch({ image: await upload(file) }))
  const Hero = heroes[service.hero]

  return (
    <>
      <Meta title={service.name} description={service.description} />
      <Hero service={service} onName={editing ? (name) => patch({ name }) : undefined} />

      {editing && (
        <section className="px-8 pt-8 md:px-16">
          <UploadTarget
            onClick={() => picker.pick()}
            label={service.imageUrl ? "Change listing image" : "Add listing image"}
            preview={
              service.imageUrl && (
                <img src={service.imageUrl} alt="" className="h-full w-full object-cover" />
              )
            }
            className="aspect-video w-full rounded-[16px]"
          />
          {picker.input}
        </section>
      )}

      <section
        className={`border-b border-white/10 px-8 py-20 md:px-16 ${service.hero === "branding" ? "pt-32 md:pt-40" : ""}`}
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <EditableText
            as="h2"
            value={service.headline}
            onCommit={(headline) => patch({ headline })}
            placeholder="Headline"
            className="text-3xl leading-[1.15] font-bold tracking-tight md:col-span-2 md:text-4xl"
          />
          <EditableText
            value={service.description}
            onCommit={(description) => patch({ description })}
            placeholder="Description"
            multiline
            className="text-base leading-relaxed whitespace-pre-line text-white/60 md:col-span-2 md:text-lg"
          />
        </div>
      </section>

      {service.hero === "branding" && <BrandingProcess />}

      <div className="px-8 py-8 md:px-16">
        <MasonryGrid key={service._id}>
          {projects.map((project, index) => (
            <Card key={project._id} project={project} index={index} />
          ))}
        </MasonryGrid>
      </div>

      <CtaRow back={{ to: "/portfolio", label: "All Categories" }} />
    </>
  )
}
