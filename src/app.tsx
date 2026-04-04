import { Route, BrowserRouter as Router, Routes } from "react-router"
import { ColumnWipe } from "./components/column-wipe"
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
  FeaturedCascade,
  Hero,
  StatsGrid,
  WhatWeDoSection,
  WordStatement,
} from "./pages/home"
import { NotFound } from "./pages/not-found"
import { Portfolio } from "./pages/portfolio"
import { ProjectPage } from "./pages/project-page"
import { Services } from "./pages/services"

const Home = () => (
  <>
    <Hero />
    <StatsGrid />
    <BrandsCarousel />
    <WordStatement />
    <WhatWeDoSection />
    <CampaignStatement />
    <FeaturedCascade />
    <CircleStatement />
  </>
)

export default function App() {
  return (
    <Router>
      <CustomCursor />
      {/* Column Lines — z-[1] keeps them above the background but below page content (z-[2]) */}
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="column-line"
          style={{ left: `${(100 / 6) * i}%` }}
        />
      ))}

      <Navbar />

      <ColumnWipe>
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:category" element={<CategoryPage />} />
            <Route path="/portfolio/:category/:project" element={<ProjectPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </SmoothScroll>
      </ColumnWipe>
    </Router>
  )
}
