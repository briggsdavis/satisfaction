import { useQuery } from "convex/react"
import { motion, useMotionValue, useTransform } from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router"
import { api } from "../convex/_generated/api"
import { AdminRoot } from "./admin/admin-root"
import { ColumnWipe, useColumnWipeLocation, usePendingLocation } from "./components/column-wipe"
import { CustomCursor } from "./components/custom-cursor"
import { Footer } from "./components/footer"
import { SiteLoader } from "./components/site-loader"

// Prevents Three.js / WebGL / asset-load failures inside the 3D canvas from
// crashing the outer React tree and making the whole page disappear.
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
import { AboutModelScene } from "./components/about-model-scene"
import { Navbar } from "./components/navbar"
import {
  SmoothScroll,
  SmoothScrollProvider,
  useSmoothScroll,
} from "./components/smooth-scroll"
import { About } from "./pages/about"
import { CategoryPage } from "./pages/category"
import { Contact } from "./pages/contact"
import { Credits } from "./pages/credits"
import { LogosCarousel } from "./pages/home/brands-carousel"
import { CampaignStatement } from "./pages/home/campaign-statement"
import { FaqCta } from "./pages/home/faq-cta"
import { FeaturedCascade } from "./pages/home/featured-cascade"
import { HeroCanvas, Hero } from "./pages/home/hero"
import { ServicesCarousel } from "./pages/home/services-carousel"
import { WhatWeDoSection } from "./pages/home/what-we-do"
import { NotFound } from "./pages/not-found"
import { Portfolio } from "./pages/portfolio"
import { ProjectPage } from "./pages/project-page"
import { Services } from "./pages/services"

const Home = () => (
  <>
    {/* Column lines — only on the landing page */}
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className={`column-line${i % 2 !== 0 ? " hidden md:block" : ""}`}
        style={
          {
            left: `${(100 / 6) * i}%`,
            ["--sweep-delay" as string]: `${i * 0.75}s`,
          } as React.CSSProperties
        }
      />
    ))}
    <Hero />
    <LogosCarousel
      carousel="collaboration"
      eyebrow="Collaborations"
      heading="Brands & creative teams we've worked with:"
    />
    <ServicesCarousel />
    <LogosCarousel carousel="work" />
    <WhatWeDoSection />
    <CampaignStatement />
    <FeaturedCascade />
    <FaqCta />
  </>
)

// Pre-renders the incoming page in a hidden div during wipe-in so Convex queries
// fire while the white columns are covering the screen. By the time the wipe-out
// reveals the new page the data is cached and the page renders immediately.
const PrefetchRoutes = () => {
  const pendingLocation = usePendingLocation()
  if (!pendingLocation) return null
  return (
    <div style={{ display: "none" }} aria-hidden="true">
      <Routes location={pendingLocation}>
        <Route path="/portfolio/:category" element={<CategoryPage />} />
        <Route path="/portfolio/:category/:project" element={<ProjectPage />} />
        <Route path="*" element={null} />
      </Routes>
    </div>
  )
}

// Inner component so it can read the controlled location from ColumnWipe context
const AppRoutes = () => {
  const displayedLocation = useColumnWipeLocation()
  return (
    <Routes location={displayedLocation ?? undefined}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/portfolio/:category" element={<CategoryPage />} />
      <Route path="/portfolio/:category/:project" element={<ProjectPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/credits" element={<Credits />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const ConditionalHeroCanvas = () => {
  const { pathname } = useLocation()
  if (pathname !== "/") return null
  return (
    <CanvasErrorBoundary>
      <HeroCanvas />
    </CanvasErrorBoundary>
  )
}

const AboutCanvasInner = () => {
  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const heroEnd = window.innerHeight * 0.5
  const scrollOpacity = useTransform(
    activeY,
    [heroEnd, heroEnd + window.innerHeight * 0.3],
    [0, 1],
  )

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ opacity: scrollOpacity }}
    >
      <AboutModelScene />
    </motion.div>
  )
}

const ConditionalAboutCanvas = () => {
  const { pathname } = useLocation()
  if (pathname !== "/about") return null
  return (
    <CanvasErrorBoundary>
      <AboutCanvasInner />
    </CanvasErrorBoundary>
  )
}

const SiteRoot = () => {
  const navLogoRef = useRef<HTMLImageElement>(null)
  // Show loader only when the browser hard-loads directly to "/".
  // SiteRoot stays mounted for the whole session, so client-side navigation
  // to "/" never re-initialises this state.
  const [loading, setLoading] = useState(() => window.location.pathname === "/")
  const [navLogoVisible, setNavLogoVisible] = useState(!loading)
  const [animationDone, setAnimationDone] = useState(false)

  // Critical chrome data — gate loader dismissal on these resolving.
  const homepage = useQuery(api.homepage.get)
  const footer = useQuery(api.footer.get)
  const contactInfo = useQuery(api.contact.getInfo)
  const dataReady =
    homepage !== undefined && footer !== undefined && contactInfo !== undefined

  useEffect(() => {
    if (loading && animationDone && dataReady) setLoading(false)
  }, [loading, animationDone, dataReady])

  return (
    <>
      {loading && (
        <SiteLoader
          navLogoRef={navLogoRef}
          onNavLogoReady={() => setNavLogoVisible(true)}
          onDone={() => setAnimationDone(true)}
        />
      )}
      <CustomCursor />
      <Navbar logoRef={navLogoRef} logoVisible={navLogoVisible} />
      <SmoothScrollProvider>
        <ConditionalHeroCanvas />
        <ConditionalAboutCanvas />
        <ColumnWipe>
          <SmoothScroll>
            <AppRoutes />
            <Footer />
          </SmoothScroll>
          <PrefetchRoutes />
        </ColumnWipe>
      </SmoothScrollProvider>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoot />} />
        <Route path="/*" element={<SiteRoot />} />
      </Routes>
    </Router>
  )
}
