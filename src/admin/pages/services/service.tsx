import { useQuery } from "convex/react"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { api } from "../../../../convex/_generated/api"

export const ServiceAdmin = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>()
  const navigate = useNavigate()
  const service = useQuery(
    api.portfolio.getCategoryBySlug,
    serviceSlug ? { slug: serviceSlug } : "skip",
  )

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === "service-slug" && typeof event.data.slug === "string") {
        navigate(`/admin/services/${event.data.slug}`, { replace: true })
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [navigate])

  if (service === undefined) return null
  if (!service) return <p className="text-white/50">Service not found.</p>

  return (
    <div className="-m-8 h-[calc(100vh-4rem)] overflow-hidden bg-black">
      <iframe
        src={`/portfolio/${service.slug}?edit=1`}
        title="Service page editor"
        sandbox="allow-same-origin allow-scripts"
        className="h-full w-full border-0"
      />
    </div>
  )
}
