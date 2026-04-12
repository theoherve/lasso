"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, Map, CalendarDays, User, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const allTabs = [
  { href: "/feed", label: "Feed", icon: Compass, requiresAuth: false },
  { href: "/missions", label: "Missions", icon: CalendarDays, requiresAuth: true },
  { href: "/map", label: "Carte", icon: Map, requiresAuth: false, isCenter: true },
  { href: "/about", label: "A propos", icon: Info, requiresAuth: false },
  { href: "/profile", label: "Profil", icon: User, requiresAuth: true },
]

export function BottomTabNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()

  const visibleTabs = allTabs.filter(
    (tab) => !tab.requiresAuth || isLoggedIn,
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        {visibleTabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/")
          const Icon = tab.icon

          if (tab.isCenter) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex cursor-pointer flex-col items-center gap-0.5"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 -mt-5 items-center justify-center rounded-full shadow-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground scale-105"
                      : "bg-primary text-primary-foreground hover:scale-105",
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-h-11 min-w-11 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
              {isActive && (
                <span className="h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
