import type { FunctionReturnType } from "convex/server"
import type { api } from "../../convex/_generated/api"

export type SiteData = FunctionReturnType<typeof api.site.get>
export type Service = FunctionReturnType<typeof api.services.list>[number]
export type ProjectCard = FunctionReturnType<typeof api.projects.list>[number]
export type Project = NonNullable<FunctionReturnType<typeof api.projects.get>>
export type Showcase = FunctionReturnType<typeof api.showcases.list>[number]
export type FaqSection = FunctionReturnType<typeof api.faq.list>[number]
