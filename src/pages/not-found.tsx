import { Link } from "react-router"
import { TextReveal } from "../components/text-reveal"

export const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8">
      <TextReveal
        text="404"
        className="massive-text text-white text-[25vw] leading-none"
        immediate
      />
      <TextReveal
        text="Page Not Found"
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
}
