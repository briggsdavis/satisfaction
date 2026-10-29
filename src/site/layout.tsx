import { ReactLenis, useLenis } from "lenis/react"
import { useEffect, useRef, useState } from "react"
import { Outlet, ScrollRestoration, useLocation } from "react-router"
import { api } from "../../convex/_generated/api"
import { preload } from "../lib/convex"
import { CustomCursor } from "./custom-cursor"
import { Footer } from "./footer"
import { Navbar } from "./navbar"
import { SiteLoader } from "./site-loader"

export const siteLoader = async () => {
  await preload(api.site.get)
  return null
}

/** Kill Lenis momentum on navigation so it can't drag the new page along. */
const LenisSync = () => {
  const lenis = useLenis()
  const { key } = useLocation()
  useEffect(() => {
    lenis?.scrollTo(window.scrollY, { immediate: true, force: true })
  }, [key, lenis])
  return null
}

export const SiteLayout = () => {
  const navLogoRef = useRef<HTMLImageElement>(null)
  // The intro only plays on a hard load of "/"; the layout persists across navigations.
  const [intro, setIntro] = useState(() => window.location.pathname === "/")
  const [navLogoVisible, setNavLogoVisible] = useState(!intro)

  return (
    <ReactLenis root>
      <LenisSync />
      <ScrollRestoration />
      {intro && (
        <SiteLoader
          navLogoRef={navLogoRef}
          onNavLogoReady={() => setNavLogoVisible(true)}
          onDone={() => setIntro(false)}
        />
      )}
      <CustomCursor />
      <Navbar logoRef={navLogoRef} logoVisible={navLogoVisible} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </ReactLenis>
  )
}
