"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Bell, Check, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch {
      // silent fail
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  async function markAllRead() {
    setLoading(true)
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  async function markOneRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }

  return (
    <Popover>
      <PopoverTrigger className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground outline-none">
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-80 p-0">
        <PopoverHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3">
          <PopoverTitle className="text-sm font-semibold">Notifications</PopoverTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={markAllRead}
              disabled={loading}
              className="cursor-pointer text-xs text-muted-foreground"
            >
              <CheckCheck className="mr-1 size-3.5" />
              Tout lire
            </Button>
          )}
        </PopoverHeader>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notif) => {
              const content = (
                <div
                  className={`flex items-start gap-3 border-b border-border px-4 py-3 transition-colors last:border-0 ${
                    notif.read
                      ? "opacity-60"
                      : "bg-primary/5"
                  } ${notif.link ? "cursor-pointer hover:bg-accent" : ""}`}
                  onClick={() => {
                    if (!notif.read) markOneRead(notif.id)
                  }}
                >
                  <div className="mt-0.5">
                    {notif.read ? (
                      <Check className="size-3.5 text-muted-foreground" />
                    ) : (
                      <span className="flex h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">{notif.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      {formatDistanceToNow(new Date(notif.createdAt))}
                    </p>
                  </div>
                </div>
              )

              if (notif.link) {
                return (
                  <Link
                    key={notif.id}
                    href={notif.link}
                    onClick={() => {
                      if (!notif.read) markOneRead(notif.id)
                    }}
                  >
                    {content}
                  </Link>
                )
              }

              return <div key={notif.id}>{content}</div>
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
