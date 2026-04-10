import React from "react"
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router"
import { ColumnWipe, useColumnWipeLocation } from "./components/column-wipe"
import { CustomCursor } from "./components/custom-cursor"
import { Footer } from "./components/footer"

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
import { Navbar } from "./components/navbar"
import { SmoothScroll, SmoothScrollProvider } from "./components/smooth-scroll"
import { About } from "./pages/about"
import { CategoryPage } from "./pages/category"
import { Contact } from "./pages/contact"
import { BrandsCarousel } from "./pages/home/brands-carousel"
import { CampaignStatement } from "./pages/home/campaign-statement"
import { FaqCta } from "./pages/home/faq-cta"
import { FeaturedCascade } from "./pages/home/featured-cascade"
import { HeroCanvas, Hero } from "./pages/home/hero"
import { StatsGrid } from "./pages/home/stats-grid"
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
        className="column-line"
        style={
          {
            left: `${(100 / 6) * i}%`,
            ["--sweep-delay" as string]: `${i * 0.75}s`,
          } as React.CSSProperties
        }
      />
    ))}
    <Hero />
    <StatsGrid />
    <BrandsCarousel />
    <WhatWeDoSection />
    <CampaignStatement />
    <FeaturedCascade />
    <FaqCta />
  </>
)

// Inner component so it can read the controlled location from ColumnWipe context
const AppRoutes = () => {
  const displayedLocation = useColumnWipeLocation()
  return (
    <Routes location={displayedLocation ?? undefined}>
      <Route path="/" element={<Home />} />
      <Route
        path="/about"
        element={
          <>
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="column-line"
                style={
                  {
                    left: `${(100 / 6) * i}%`,
                    ["--sweep-delay" as string]: `${i * 0.75}s`,
                  } as React.CSSProperties
                }
              />
            ))}
            <About />
          </>
        }
      />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/portfolio/:category" element={<CategoryPage />} />
      <Route path="/portfolio/:category/:project" element={<ProjectPage />} />
      <Route path="/contact" element={<Contact />} />
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

export default function App() {
  return (
    <Router>
      <CustomCursor />

      <Navbar />

      <SmoothScrollProvider>
        <ConditionalHeroCanvas />

        <ColumnWipe>
          <SmoothScroll>
            <AppRoutes />
            <Footer />
          </SmoothScroll>
        </ColumnWipe>
      </SmoothScrollProvider>
    </Router>
  )
}
