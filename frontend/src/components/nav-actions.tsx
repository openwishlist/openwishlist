import { useEffect, useState } from "react"
import { BellDotIcon, BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { dismissNotification, getNotificationsOnce, type Notification } from "@/utils/api/notifications"

export function NavActions() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    void getNotificationsOnce().then(setNotifications).catch(() => setNotifications([]))
  }, [])

  async function dismiss(item: Notification) {
    await dismissNotification(item.uuid)
    setNotifications((current) => current.filter((notification) => notification.uuid !== item.uuid))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label="Notifications" />}>
        {notifications.length ? <BellDotIcon /> : <BellIcon />}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="mb-3 text-sm font-medium">Notifications</p>
        {notifications.length === 0 ? <p className="text-sm text-muted-foreground">You are all caught up.</p> : <ul className="space-y-2">{notifications.map((item) => <li key={item.uuid} className="rounded-md bg-muted p-2 text-sm"><p className="font-medium">{item.title}</p>{item.message && <p className="text-muted-foreground">{item.message}</p>}<button type="button" className="mt-1 text-xs underline" onClick={() => void dismiss(item)}>Dismiss</button></li>)}</ul>}
      </PopoverContent>
    </Popover>
  )
}
