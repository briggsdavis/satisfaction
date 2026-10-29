import { createBrowserRouter, redirect } from "react-router"
import { SiteLayout, siteLoader } from "./site/layout"
import { NotFound, RouteError } from "./ui/not-found"

// Data-mode router. Feature routes are lazy modules exporting `Component` and
// (optionally) `loader`; loaders warm Convex subscriptions so pages render
// complete the moment the column wipe reveals them.
export const router = createBrowserRouter([
  {
    path: "/admin/*",
    lazy: async () => ({ Component: (await import("./admin/admin")).Admin }),
    HydrateFallback: () => <div className="min-h-screen bg-black" />,
  },
  {
    Component: SiteLayout,
    loader: siteLoader,
    HydrateFallback: () => <div className="min-h-screen bg-black" />,
    errorElement: <RouteError />,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { index: true, lazy: () => import("./features/home/home") },
          { path: "about", lazy: () => import("./features/about/about") },
          { path: "services", lazy: () => import("./features/services/services") },
          { path: "portfolio", lazy: () => import("./features/portfolio/portfolio") },
          { path: "portfolio/:slug", lazy: () => import("./features/services/service") },
          { path: "work/:slug", lazy: () => import("./features/work/project") },
          // v1 project URLs nested a (non-canonical) category.
          {
            path: "portfolio/:service/:project",
            loader: ({ params }) => redirect(`/work/${params.project}`),
          },
          { path: "contact", lazy: () => import("./features/contact/contact") },
          { path: "credits", lazy: () => import("./features/credits") },
          { path: "*", Component: () => <NotFound /> },
        ],
      },
    ],
  },
])
