import { data, isRouteErrorResponse, useRouteError } from "react-router"
import { Link } from "./link"
import { Meta } from "./page"
import { TextReveal } from "./text-reveal"

export const NotFound = ({ title = "Page Not Found" }: { title?: string }) => (
  <div className="flex min-h-screen flex-col items-center justify-center px-8 md:px-16">
    <Meta title={title} />
    <TextReveal
      text="404"
      className="massive-text text-8xl leading-none text-white md:text-10xl lg:text-12xl"
      immediate
    />
    <TextReveal
      text={title}
      className="massive-text mt-4 text-4xl md:text-6xl"
      delay={0.3}
      immediate
    />
    <p className="mt-8 max-w-md text-center text-lg leading-relaxed text-white/60">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn-industrial mt-12">
      Back to Home
    </Link>
  </div>
)

/** Route errorElement: 404s from loaders render NotFound; anything else rethrows to the console. */
export const RouteError = () => {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />
  console.error(error)
  return <NotFound title="Something Broke" />
}

/** Throw from a loader to render the 404 page. */
export const notFound = () => data(null, { status: 404 })
