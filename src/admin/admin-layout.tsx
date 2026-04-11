import React from "react"
import { Outlet } from "react-router"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"

export const AdminLayout = () => (
  <div className="flex h-screen flex-col bg-black text-white overflow-hidden">
    <AdminTopbar />
    <div className="flex flex-1 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  </div>
)
