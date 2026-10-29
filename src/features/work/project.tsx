import { useMutation, useQuery } from "convex/react"
import { Plus, X } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { useParams, type LoaderFunctionArgs } from "react-router"
import { api } from "../../../convex/_generated/api"
import { useEditing } from "../../edit/edit-mode"
import { EditableRich, UploadTarget } from "../../edit/editable"
import { preload } from "../../lib/convex"
import { useTitleDelay } from "../../lib/hooks"
import { reveal } from "../../lib/motion"
import type { Project } from "../../lib/types"
import { useFilePicker, useUpload } from "../../lib/upload"
import { FitTitle } from "../../ui/fit-title"
import { Link } from "../../ui/link"
import { notFound } from "../../ui/not-found"
import { CtaRow, Meta } from "../../ui/page"
import { ProjectGallery } from "./project-gallery"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [project] = await Promise.all([
    preload(api.projects.bySlug, { slug: params.slug! }),
    preload(api.services.list),
  ])
  if (!project) throw notFound()
  return null
}

export const Component = () => {
  const project = useQuery(api.projects.bySlug, { slug: useParams().slug! })
  return project ? <ProjectPage project={project} /> : null
}

const label = "block text-xs font-bold tracking-[0.4em] text-white/40 uppercase"

/** Service chips; in edit mode they can be added and removed (never below one). */
const ServiceChips = ({ project }: { project: Project }) => {
  const editing = useEditing()
  const services = useQuery(api.services.list) ?? []
  const update = useMutation(api.projects.update)
  const [adding, setAdding] = useState(false)
  const setServices = (serviceIds: Project["serviceIds"]) =>
    update({ id: project._id, patch: { serviceIds } })
  const chips = services.filter((s) => project.serviceIds.includes(s._id))

  return (
    <div className="relative flex flex-wrap gap-3">
      {chips.map((s) => (
        <div key={s._id} className="group relative">
          <Link
            to={`/portfolio/${s.slug}`}
            className="flex items-center gap-2 border border-white/20 px-3 py-1 text-xs font-bold tracking-[0.3em] text-white/70 uppercase transition-all duration-300 hover:border-white/50 hover:bg-white/5 hover:text-white"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 bg-current transition-transform duration-300 group-hover:scale-150"
              style={{ color: s.color }}
            />
            <span className="translate-y-0.25">{s.name}</span>
          </Link>
          {editing && chips.length > 1 && (
            <button
              type="button"
              aria-label={`Remove ${s.name}`}
              onClick={() => setServices(project.serviceIds.filter((id) => id !== s._id))}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center bg-white text-black opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={11} />
            </button>
          )}
        </div>
      ))}
      {editing && (
        <button
          type="button"
          aria-label="Add service"
          aria-expanded={adding}
          onClick={() => setAdding((a) => !a)}
          className="flex h-7 w-7 items-center justify-center border border-dashed border-white/30 text-white/50 hover:border-white hover:text-white"
        >
          <Plus size={14} />
        </button>
      )}
      {editing && adding && (
        <div className="absolute top-full left-0 z-20 mt-2 min-w-48 border border-white/20 bg-black p-1 shadow-xl">
          {services
            .filter((s) => !project.serviceIds.includes(s._id))
            .map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => {
                  void setServices([...project.serviceIds, s._id])
                  setAdding(false)
                }}
                className="block w-full px-3 py-2 text-left text-xs font-bold tracking-wider text-white/60 uppercase hover:bg-white hover:text-black"
              >
                {s.name}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

/** The project page. Shared verbatim by the admin editor inside <EditMode>. */
export const ProjectPage = ({ project }: { project: Project }) => {
  const editing = useEditing()
  const delay = useTitleDelay()
  const services = useQuery(api.services.list) ?? []
  const update = useMutation(api.projects.update)
  const upload = useUpload()
  const patch = (p: Parameters<typeof update>[0]["patch"]) => update({ id: project._id, patch: p })
  const cover = useFilePicker(async ([file]) => patch({ cover: await upload(file) }))
  const primary = services.find((s) => s._id === project.serviceIds[0])
  const back = primary
    ? { to: `/portfolio/${primary.slug}`, label: primary.name }
    : { to: "/portfolio", label: "Portfolio" }

  return (
    <div className="pt-32">
      <Meta title={project.title} />
      <section className="border-b border-white/10 px-8 pb-16 md:px-16">
        <Link
          to={back.to}
          className="mb-6 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase transition-colors hover:text-white"
        >
          ← {back.label}
        </Link>
        <FitTitle
          text={project.title.toUpperCase()}
          slideFrom="left"
          delay={delay}
          onCommit={editing ? (title) => patch({ title }) : undefined}
        />
        {editing && (
          <>
            <UploadTarget
              onClick={() => cover.pick()}
              label={project.coverUrl ? "Change cover" : "Add cover"}
              preview={
                project.coverUrl && (
                  <img src={project.coverUrl} alt="" className="h-full w-full object-cover" />
                )
              }
              className="mt-8 aspect-video w-full"
            />
            {cover.input}
          </>
        )}
      </section>

      <section className="border-b border-white/10 px-8 py-20 md:px-16">
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <span className={`mb-3 ${label}`}>Tags</span>
            <ServiceChips project={project} />
          </div>
          <div className="md:col-span-2">
            <span className={`mb-4 ${label}`}>Project Overview</span>
            <motion.div
              {...reveal(0, 16, 0.8)}
              className="text-base leading-relaxed text-white/60 md:text-lg"
            >
              <EditableRich
                value={project.description}
                onCommit={(description) => patch({ description })}
              />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {(["approach", "execution", "results"] as const).map((key) => (
            <div key={key}>
              <span className={`mb-5 ${label}`}>{key}</span>
              <EditableRich
                value={project[key]}
                onCommit={(value) => patch({ [key]: value })}
                className="text-sm leading-relaxed text-white/60"
              />
            </div>
          ))}
        </div>
      </section>

      <ProjectGallery project={project} />
      <CtaRow back={back} />
    </div>
  )
}
