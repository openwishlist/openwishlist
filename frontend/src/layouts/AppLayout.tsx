import { LayoutDashboard, ListChecks, Settings2 } from "lucide-react"
import { NavLink, Outlet, useLocation } from "react-router"
import { NavActions } from "@/components/nav-actions"

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-svh bg-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <NavLink to="/app/dashboard" className="flex shrink-0 items-center gap-2.5 text-base font-semibold tracking-tight">
            <img src="/openwishlist-icon.svg" alt="" className="size-9" />
            <span className="hidden sm:inline">OpenWishlist</span>
          </NavLink>

          <nav aria-label="Primary navigation" className="flex min-w-0 flex-1 self-stretch items-center gap-1 overflow-x-auto px-1">
            <NavLink
              to="/app/dashboard"
              end
              className={({ isActive }) => `relative flex h-full shrink-0 items-center gap-2 px-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-opacity ${isActive ? "text-foreground after:opacity-100" : "text-muted-foreground hover:text-foreground after:opacity-0"}`}
            >
              <LayoutDashboard className="size-4" />
              <span>Start</span>
            </NavLink>
            <NavLink
              to="/app/wishlists"
              className={({ isActive }) => `relative flex h-full shrink-0 items-center gap-2 px-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-opacity ${isActive ? "text-foreground after:opacity-100" : "text-muted-foreground hover:text-foreground after:opacity-0"}`}
            >
              <ListChecks className="size-4" />
              <span>Wishlists</span>
            </NavLink>
            <NavLink
              to="/app/settings"
              className={({ isActive }) => `relative flex h-full shrink-0 items-center gap-2 px-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-opacity ${isActive ? "text-foreground after:opacity-100" : "text-muted-foreground hover:text-foreground after:opacity-0"}`}
            >
              <Settings2 className="size-4" />
              <span>Settings</span>
            </NavLink>
          </nav>

          <div className="shrink-0">
            <NavActions />
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 sm:p-6 lg:px-8">
        <Outlet key={location.pathname} />
      </main>
    </div>
  )
}
