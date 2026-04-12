"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ListTodo, Users, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/association/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/association/missions", label: "Missions", icon: ListTodo },
  { href: "/association/volunteers", label: "Benevoles", icon: Users },
  { href: "/association/stats", label: "Statistiques", icon: BarChart3 },
]

export function AssociationSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <Link href="/feed" className="flex h-16 items-center gap-3 border-b border-border px-6 transition-opacity hover:opacity-80">
        <img src="/logo.svg" alt="Lasso" width={36} height={36} />
        <div>
          <p className="text-sm font-extrabold" style={{ letterSpacing: '-0.04em' }}>las<span className="text-primary">s</span>o</p>
          <p className="text-xs text-muted-foreground">Backoffice association</p>
        </div>
      </Link>

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
