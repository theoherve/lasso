"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { User, Building2, Shield, LogOut } from "lucide-react"
import type { Role } from "@/lib/generated/prisma/client"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface ProfileDropdownProps {
  initials: string
  name: string
  email: string
  roles: Role[]
}

export function ProfileDropdown({ initials, name, email, roles }: ProfileDropdownProps) {
  const router = useRouter()
  const isAssociation = roles.includes("ASSOCIATION")
  const isAdmin = roles.includes("ADMIN")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-opacity duration-200 hover:opacity-90 outline-none">
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="size-4" />
            Mon profil
          </DropdownMenuItem>
          {isAssociation && (
            <DropdownMenuItem onClick={() => router.push("/association/dashboard")}>
              <Building2 className="size-4" />
              Espace association
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <Shield className="size-4" />
              Console admin
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="size-4" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
