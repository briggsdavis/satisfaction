import { useEffect } from "react"
import { Route, Routes } from "react-router"
import { AdminLayout } from "./admin-layout"
import { AdminContentProvider } from "./context/content-context"
import { AboutBodyAdmin } from "./pages/about/body"
import { AboutIndex } from "./pages/about/index"
import { TimelineAdmin } from "./pages/about/timeline"
import { ValuesAdmin } from "./pages/about/values"
import { ContactIndex } from "./pages/contact/index"
import { ContactInfoAdmin } from "./pages/contact/info"
import { FaqAdmin } from "./pages/contact/faq"
import { Dashboard } from "./pages/dashboard"
import { FooterAdmin } from "./pages/footer"
import { BrandsAdmin } from "./pages/homepage/brands"
import { CampaignAdmin } from "./pages/homepage/campaign"
import { FeaturedAdmin } from "./pages/homepage/featured"
import { HeroAdmin } from "./pages/homepage/hero"
import { HomepageIndex } from "./pages/homepage/index"
import { WhatWeDoAdmin } from "./pages/homepage/what-we-do"
import { CategoryAdmin } from "./pages/portfolio/category"
import { PortfolioIndex } from "./pages/portfolio/index"
import { ProjectAdmin } from "./pages/portfolio/project"
import { SeoAdmin } from "./pages/seo"
import { ServicesAdmin } from "./pages/services"

const AdminApp = () => {
  // Restore standard cursor for admin context
  useEffect(() => {
    document.body.classList.add("admin-mode")
    return () => document.body.classList.remove("admin-mode")
  }, [])

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="homepage" element={<HomepageIndex />} />
        <Route path="homepage/hero" element={<HeroAdmin />} />
        <Route path="homepage/brands" element={<BrandsAdmin />} />
        <Route path="homepage/what-we-do" element={<WhatWeDoAdmin />} />
        <Route path="homepage/campaign" element={<CampaignAdmin />} />
        <Route path="homepage/featured" element={<FeaturedAdmin />} />
        <Route path="about" element={<AboutIndex />} />
        <Route path="about/body" element={<AboutBodyAdmin />} />
        <Route path="about/timeline" element={<TimelineAdmin />} />
        <Route path="about/values" element={<ValuesAdmin />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="portfolio" element={<PortfolioIndex />} />
        <Route path="portfolio/:categorySlug" element={<CategoryAdmin />} />
        <Route path="portfolio/:categorySlug/:projectSlug" element={<ProjectAdmin />} />
        <Route path="contact" element={<ContactIndex />} />
        <Route path="contact/info" element={<ContactInfoAdmin />} />
        <Route path="contact/faq" element={<FaqAdmin />} />
        <Route path="footer" element={<FooterAdmin />} />
        <Route path="seo" element={<SeoAdmin />} />
      </Route>
    </Routes>
  )
}

export const AdminRoot = () => (
  <AdminContentProvider>
    <AdminApp />
  </AdminContentProvider>
)
