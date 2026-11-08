import * as React from "react"
import { Heart, Home, Settings2 } from "lucide-react"
import { useLocation } from "react-router"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const isDashboard = location.pathname === "/app" || location.pathname === "/app/dashboard"
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3 text-lg font-semibold"><Heart className="size-5" /> OpenWishlist</div>
        <NavMain items={[{ title: "My wishlists", url: "/app/dashboard", icon: <Home />, isActive: isDashboard }]} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={[{ title: "Settings", url: "/app/settings", icon: <Settings2 /> }]} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
