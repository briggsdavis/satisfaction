import { useCallback, useEffect, useState } from "react"
import { Outlet } from "react-router"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"

type AdminTheme = "dark" | "light"

const getInitialTheme = (): AdminTheme => {
  const saved = window.localStorage.getItem("admin-theme")
  return saved === "light" ? "light" : "dark"
}

export const AdminLayout = () => {
  const [theme, setTheme] = useState<AdminTheme>(getInitialTheme)

  useEffect(() => {
    window.localStorage.setItem("admin-theme", theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"))
  }, [])

  return (
    <div
      className="admin-shell flex h-screen flex-col overflow-hidden bg-black text-white"
      data-admin-theme={theme}
    >
      <AdminTopbar theme={theme} onToggleTheme={toggleTheme} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
