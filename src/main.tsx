import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

// Prevent the browser from restoring a saved scroll position after page load or
// back/forward navigation. The smooth-scroll spring initialises at 0 on every
// render; if the browser later fires a scroll-restoration jump, the spring
// catches up over several frames — causing a visible "content appears then slides
// off-screen" glitch. Setting this to "manual" ensures scrollY is always 0 on
// entry, so the spring and the actual position are always in sync.
if (typeof window !== "undefined") {
  history.scrollRestoration = "manual"
}
import "@fontsource-variable/inter"
import App from "./app.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
