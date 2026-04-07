import React from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router"
import { ColumnWipe, useColumnWipeLocation } from "./components/column-wipe"
import { CustomCursor } from "./components/custom-cursor"
import { Footer } from "./components/footer"
import { Navbar } from "./components/navbar"
import { SmoothScroll } from "./components/smooth-scroll"
import { About } from "./pages/about"
import { CategoryPage } from "./pages/category"
import { Contact } from "./pages/contact"
import {
  BrandsCarousel,
  CampaignStatement,
  CircleStatement,
  FaqCta,
  FeaturedCascade,
  Hero,
  StatsGrid,
  WhatWeDoSection,
} from "./pages/home"
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
    <CircleStatement />
    <FaqCta />
  </>
)

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
      <Route
        path="/portfolio/:category/:project"
        element={<ProjectPage />}
      />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <CustomCursor />

      <Navbar />

      <ColumnWipe>
        <SmoothScroll>
          <AppRoutes />
          <Footer />
        </SmoothScroll>
      </ColumnWipe>
    </Router>
  )
}
