import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { Route, Routes } from "react-router"
import { AdminLayout } from "./layout"
import { Login } from "./login"
import { AboutAdmin } from "./pages/about"
import { ContactAdmin } from "./pages/contact"
import { Dashboard } from "./pages/dashboard"
import { ProjectEditor, ServiceEditor } from "./pages/editors"
import { FaqAdmin } from "./pages/faq"
import { HomepageAdmin } from "./pages/homepage"
import { LeadsAdmin } from "./pages/leads"
import { LogosAdmin } from "./pages/logos"
import { ProjectsAdmin } from "./pages/projects"
import { ServicesAdmin } from "./pages/services"
import { TimelineAdmin } from "./pages/timeline"
import { WheelAdmin } from "./pages/wheel"

export const Admin = () => (
  <>
    <AuthLoading>
      <div className="flex min-h-screen items-center justify-center bg-black text-xs tracking-[0.2em] text-white/40 uppercase">
        Loading…
      </div>
    </AuthLoading>
    <Unauthenticated>
      <Login />
    </Unauthenticated>
    <Authenticated>
      <Routes>
        {/* Full-screen WYSIWYG editors: the real public page inside <EditMode>. */}
        <Route path="services/:id" element={<ServiceEditor />} />
        <Route path="projects/:id" element={<ProjectEditor />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<LeadsAdmin />} />
          <Route path="homepage" element={<HomepageAdmin />} />
          <Route path="logos" element={<LogosAdmin />} />
          <Route path="about" element={<AboutAdmin />} />
          <Route path="wheel" element={<WheelAdmin />} />
          <Route path="timeline" element={<TimelineAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="faq" element={<FaqAdmin />} />
          <Route path="contact" element={<ContactAdmin />} />
        </Route>
      </Routes>
    </Authenticated>
  </>
)
