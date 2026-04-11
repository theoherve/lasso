"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, Map, CalendarDays, User } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/feed", label: "Feed", icon: Compass },
  { href: "/map", label: "Carte", icon: Map },
  { href: "/missions", label: "Missions", icon: CalendarDays },
  { href: "/profile", label: "Profil", icon: User },
]

export function BottomTabNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
              {isActive && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
