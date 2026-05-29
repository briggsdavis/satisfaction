import { ConvexAuthProvider } from "@convex-dev/auth/react"
import { ConvexReactClient } from "convex/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

if (typeof window !== "undefined") {
  history.scrollRestoration = "manual"
}
import App from "./app.tsx"
// eslint-disable-next-line import/no-unassigned-import
import "./index.css"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <App />
    </ConvexAuthProvider>
  </StrictMode>,
)
