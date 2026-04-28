import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Link, useParams } from "react-router"
import { TextReveal } from "../components/text-reveal"

// ─── Project Data ────────────────────────────────────────────────────────────
const PROJECT_DATA: Record<
  string,
  {
    title: string
    subtitle: string
    year: string
    tags: string[]
    brief: string
    heroImg: string
    gridImages: string[]
    galleryImages: string[]
  }
> = {
  "absolute-vodka": {
    title: "ABSOLUTE VODKA",
    subtitle: "Brand Campaign",
    year: "2023",
    tags: ["Brand Campaign", "Photography", "Art Direction"],
    brief:
      "A bold visual campaign for Absolut Vodka designed to capture the energy of Pittsburgh's nightlife culture. The project spanned photography, art direction, and social content creation, translating the brand's global identity into authentic local moments that resonated across digital platforms and in-venue activations.",
    heroImg:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000",
    gridImages: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1574006852726-31d021aeab32?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&q=80&w=800",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1574006852726-31d021aeab32?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&q=80&w=1200",
    ],
  },
  "red-bull": {
    title: "RED BULL",
    subtitle: "Event Coverage",
    year: "2022",
    tags: ["Event Coverage", "Videography", "Photography"],
    brief:
      "High-energy event coverage and content creation for Red Bull activations across the Pittsburgh region. From extreme sport showcases to music events, the project demanded fast turnaround, cinematic quality, and a fearless creative eye, capturing the raw adrenaline that defines the Red Bull brand.",
    heroImg:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=2000",
    gridImages: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1461896836934-bd45ba8fcab7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1504025468847-0e438279542c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?auto=format&fit=crop&q=80&w=800",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1461896836934-bd45ba8fcab7?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1504025468847-0e438279542c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1526676317768-d9b14f15a5f7?auto=format&fit=crop&q=80&w=1200",
    ],
  },
  montclair: {
    title: "MONTCLAIR",
    subtitle: "Brand Identity",
    year: "2024",
    tags: ["Brand Identity", "Graphic Design", "Creative Direction"],
    brief:
      "A complete brand identity system for Montclair, a luxury lifestyle brand launching in the Northeast. The project covered logo design, typographic systems, colour palettes, photography direction, and a full set of brand guidelines, built to scale from day one across digital, print, and physical retail spaces.",
    heroImg:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=2000",
    gridImages: [
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&q=80&w=1200",
    ],
  },
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = ({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) => {
  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 flex items-center gap-2 text-white/40 transition-colors hover:text-white"
      >
        <span className="font-mono text-xs font-bold tracking-widest uppercase">
          Close
        </span>
        <X size={20} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-none border border-white/20 p-3 text-white/50 transition-colors hover:bg-white hover:text-black md:left-8"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-none border border-white/20 p-3 text-white/50 transition-colors hover:bg-white hover:text-black md:right-8"
      >
        <ArrowRight size={20} />
      </button>

      {/* Image */}
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        src={images[index]}
        alt={`Gallery ${index + 1}`}
        className="max-h-[85vh] max-w-[90vw] object-contain"
        referrerPolicy="no-referrer"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs font-bold tracking-widest text-white/30 uppercase">
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(images.length).padStart(2, "0")}
      </div>
    </motion.div>
  )
}

// ─── Project Page ────────────────────────────────────────────────────────────
export const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? PROJECT_DATA[slug] : null
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroImgY = useTransform(scrollYProgress, [0, 1], [0, 200])

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => {
    if (lightboxIndex === null || !project) return
    setLightboxIndex(
      (lightboxIndex - 1 + project.galleryImages.length) %
        project.galleryImages.length,
    )
  }, [lightboxIndex, project])
  const nextImage = useCallback(() => {
    if (lightboxIndex === null || !project) return
    setLightboxIndex((lightboxIndex + 1) % project.galleryImages.length)
  }, [lightboxIndex, project])

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <TextReveal
            text="PROJECT NOT FOUND"
            className="massive-text text-3xl md:text-6xl lg:text-8xl"
            immediate
          />
          <Link to="/" className="btn-industrial mt-8 inline-block">
            Back Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* ── Hero Banner ── */}
      <div
        ref={heroRef}
        className="relative h-[70vh] overflow-hidden md:h-[80vh]"
      >
        <motion.img
          style={{ y: heroImgY }}
          src={project.heroImg}
          alt={project.title}
          className="absolute inset-0 h-[120%] w-full object-cover will-change-transform [backface-visibility:hidden]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />
        {/* Bottom border line — matches portfolio/category images */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />

        {/* Hero decorative elements */}
        <div className="pointer-events-none absolute top-28 right-8 text-right font-mono text-xs font-bold tracking-widest text-white/30 uppercase">
          Social Satisfaction
          <br />
          Case Study
        </div>
        <div className="pointer-events-none absolute bottom-8 left-8 flex gap-3">
          <span className="font-mono text-xl text-white/30">←</span>
          <span className="font-mono text-xl text-white/30">←</span>
        </div>
        <div className="pointer-events-none absolute right-8 bottom-8 font-mono text-xs font-bold tracking-widest text-white/30 uppercase">
          {project.year}
        </div>
      </div>

      {/* ── Title + Brief ── */}
      <div className="border-t border-white/20 px-8 md:px-16">
        {/* Title row */}
        <div className="border-b border-white/20 py-4">
          <TextReveal
            text={project.title}
            className="massive-text text-5xl leading-[0.88] md:text-7xl lg:text-9xl"
            slideFrom="left"
          />
        </div>

        {/* Subtitle + tags row */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold tracking-widest text-white/40 uppercase">
              {project.subtitle} · {project.year}
            </span>
            <span className="font-mono text-white/15">↓</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border border-white/20 px-3 py-1 text-xs font-bold tracking-[0.3em] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Brief */}
        <div className="grid grid-cols-1 gap-8 py-16 md:grid-cols-[1fr_2fr] md:gap-16">
          <div>
            <span className="font-mono text-xs font-bold tracking-widest text-white/40 uppercase">
              Project Brief
            </span>
            {/* Decorative */}
            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono text-sm text-white/30">←</span>
              <span className="font-mono text-sm text-white/30">←</span>
              <span className="font-mono text-xs font-bold tracking-widest text-white/15 uppercase">
                No shortcuts.
              </span>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl leading-relaxed font-light text-white/70 md:text-2xl"
          >
            {project.brief}
          </motion.p>
        </div>
      </div>

      {/* ── Image Grid ── */}
      <div className="border-t border-white/10 px-8 py-16 md:px-16">
        {/* Section label with decorative elements */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold tracking-widest text-white/40 uppercase">
              Selected Work
            </span>
            <span className="text-white/15">+</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-widest text-white/15 uppercase">
              0{project.gridImages.length} Images
            </span>
            <span className="font-mono text-white/15">☺</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {project.gridImages.map((img, i) => (
            <motion.div
              key={i}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden [backface-visibility:hidden]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{
                duration: 0.7,
                delay: (i % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => openLightbox(i)}
            >
              <motion.img
                src={img}
                alt={`${project.title} ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/10" />
              {/* Bottom border line */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                <span className="border border-white/40 bg-black/60 px-4 py-2 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-sm">
                  View
                </span>
              </div>

              {/* Image number */}
              <span className="absolute right-3 bottom-3 font-mono text-xs font-bold text-white/30">
                0{i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Decorative divider ── */}
      <div className="relative border-t border-white/10 px-8 py-6 md:px-16">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <span className="font-mono text-lg text-white/30">←</span>
            <span className="font-mono text-lg text-white/30">←</span>
          </div>
          <span className="font-mono text-xs font-bold tracking-widest text-white/15 uppercase">
            No risk. No story.
          </span>
          <div className="flex gap-3">
            <span className="font-mono text-lg text-white/30">→</span>
            <span className="font-mono text-lg text-white/30">→</span>
          </div>
        </div>
      </div>

      {/* ── Gallery Section ── */}
      <div className="border-t border-white/10 px-8 py-16 md:px-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <TextReveal
              text="FULL GALLERY"
              className="massive-text text-3xl leading-[0.88] md:text-4xl lg:text-6xl"
            />
            <p className="mt-3 text-sm text-white/40">
              Scroll horizontally to browse. Click any image to open.
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() =>
                galleryRef.current?.scrollBy({ left: -400, behavior: "smooth" })
              }
              className="border border-white/20 p-2 text-white/50 transition-colors hover:bg-white hover:text-black"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() =>
                galleryRef.current?.scrollBy({ left: 400, behavior: "smooth" })
              }
              className="border border-white/20 p-2 text-white/50 transition-colors hover:bg-white hover:text-black"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal scroll gallery */}
        <div
          ref={galleryRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {project.galleryImages.map((img, i) => (
            <motion.div
              key={i}
              className="group relative h-[50vh] w-[70vw] flex-shrink-0 cursor-pointer overflow-hidden [backface-visibility:hidden] md:h-[60vh] md:w-[40vw]"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => openLightbox(i)}
            >
              <motion.img
                src={img}
                alt={`${project.title} gallery ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-transparent" />
              {/* Bottom border line */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                <span className="border border-white/40 bg-black/60 px-5 py-2 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-sm">
                  Open
                </span>
              </div>

              {/* Number label */}
              <span className="absolute bottom-4 left-4 font-mono text-xs font-bold tracking-widest text-white/40">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div className="border-t border-white/10 px-8 py-16 md:px-16">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <Link to="/portfolio" className="btn-industrial">
            ← Back to Portfolio
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-widest text-white/15 uppercase">
              Social Satisfaction · {project.year}
            </span>
            <span className="text-white/15">☺</span>
          </div>
          <Link to="/contact" className="btn-industrial">
            Start a Project →
          </Link>
        </div>
      </div>

      {/* ── Lightbox — portaled to body to escape SmoothScroll transform context ── */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {lightboxIndex !== null && (
              <Lightbox
                images={project.galleryImages}
                index={lightboxIndex}
                onClose={closeLightbox}
                onPrev={prevImage}
                onNext={nextImage}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
}
