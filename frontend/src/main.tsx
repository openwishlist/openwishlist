import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import "./index.css"
import "./i18n.ts"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SessionGuard } from "@/components/auth/session-guard"
import AppLayout from "@/layouts/AppLayout"
import Dashboard from "@/routes/Dashboard"
import Start from "@/routes/Start"
import ErrorPage from "@/routes/Error"
import LoginPage from "@/routes/auth/Login"
import SignupPage from "@/routes/auth/Signup"
import ResetCredentialsPage from "@/routes/auth/ResetCredentials"
import SettingsPage from "@/routes/Settings"

function ThemeSync() {
  useEffect(() => {
    const updateTheme = () => document.documentElement.classList.toggle("dark", localStorage.theme === "dark")
    updateTheme()
    window.addEventListener("storage", updateTheme)
    return () => window.removeEventListener("storage", updateTheme)
  }, [])
  return null
}

const router = createBrowserRouter([
  { path: "/", element: <SessionGuard mode="guest" redirectUnauthenticated />, errorElement: <ErrorPage /> },
  {
    path: "/app",
    element: <SessionGuard mode="protected" />,
    children: [{ element: <AppLayout />, children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Start /> },
      { path: "wishlists", element: <Dashboard /> },
      { path: "settings", element: <SettingsPage /> },
    ] }],
  },
  { path: "/auth/reset", element: <SessionGuard mode="protected" />, children: [{ index: true, element: <ResetCredentialsPage /> }] },
  { path: "/auth", element: <SessionGuard mode="guest" />, children: [
    { path: "login", element: <LoginPage /> },
    { path: "signup", element: <SignupPage /> },
  ] },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <ThemeSync />
      <RouterProvider router={router} />
    </TooltipProvider>
  </StrictMode>,
)
