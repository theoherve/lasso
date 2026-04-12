"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Building2, ListTodo, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/associations", label: "Associations", icon: Building2 },
  { href: "/admin/missions", label: "Missions", icon: ListTodo },
  { href: "/admin/no-shows", label: "Signalements", icon: AlertTriangle },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-shrink-0 bg-foreground text-background lg:flex lg:flex-col">
      <Link href="/feed" className="flex h-16 items-center gap-3 border-b border-background/10 px-6 transition-opacity hover:opacity-80">
        <img src="/logo.svg" alt="Lasso" width={36} height={36} />
        <div>
          <p className="text-sm font-extrabold" style={{ letterSpacing: '-0.04em' }}>las<span className="text-primary">s</span>o <span className="font-semibold">Admin</span></p>
          <p className="text-xs text-background/50">Console d&apos;administration</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-background/10 font-medium text-primary"
                  : "text-background/60 hover:bg-background/5 hover:text-background",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-background/10 p-4">
        <p className="text-xs text-background/50">
          Equipe Lasso
        </p>
      </div>
    </aside>
  )
}
