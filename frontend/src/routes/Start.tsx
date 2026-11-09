import { ArrowRight, ListChecks, Settings2 } from "lucide-react"
import { Link } from "react-router"
import BaseScreen from "@/layouts/BaseScreen"

const destinations = [
  {
    title: "Wishlists",
    description: "Collect ideas, add details, and keep track of what you want next.",
    href: "/app/wishlists",
    icon: ListChecks,
  },
  {
    title: "Settings",
    description: "Manage your account, preferences, and instance administration.",
    href: "/app/settings",
    icon: Settings2,
  },
]

export default function Start() {
  return (
    <BaseScreen
      eyebrow="Your space"
      title="Start"
      description="A calm place to begin planning what comes next."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {destinations.map((destination) => {
          const Icon = destination.icon
          return (
            <Link
              key={destination.href}
              to={destination.href}
              className="group flex min-h-44 flex-col justify-between rounded-2xl border bg-background p-5 transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="flex items-center justify-between gap-4 text-lg font-semibold">
                  {destination.title}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{destination.description}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </BaseScreen>
  )
}