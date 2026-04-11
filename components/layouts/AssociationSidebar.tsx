"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ListTodo, Users, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/missions", label: "Missions", icon: ListTodo },
  { href: "/volunteers", label: "Benevoles", icon: Users },
  { href: "/stats", label: "Statistiques", icon: BarChart3 },
]

export function AssociationSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-sm font-bold">L</span>
        </div>
        <div>
          <p className="text-sm font-semibold">Lasso</p>
          <p className="text-xs text-muted-foreground">Backoffice association</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          Connecte en tant que responsable
        </p>
      </div>
    </aside>
  )
}
