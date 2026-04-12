"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReliabilityScore } from "@/components/lasso/ReliabilityScore"
import { formatDateTime } from "@/lib/utils"

interface AdminUser {
  id: string
  email: string
  name: string | null
  firstName: string | null
  roles: string[]
  reliabilityScore: number
  noShowCount: number
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  async function toggleRole(userId: string, currentRoles: string[], role: string) {
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role]

    if (newRoles.length === 0) return

    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, roles: newRoles }),
    })

    if (res.ok) {
      const updated = await res.json()
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? { ...u, roles: updated.roles } : u)),
      )
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des utilisateurs ({users.length})</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Fiabilite</TableHead>
            <TableHead>Inscription</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName ?? user.name ?? "—"}
              </TableCell>
              <TableCell className="text-sm">{user.email}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <ReliabilityScore score={user.reliabilityScore} size="sm" />
                {user.noShowCount > 0 && (
                  <span className="ml-1 text-xs text-destructive">
                    ({user.noShowCount} abs.)
                  </span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {formatDateTime(new Date(user.createdAt))}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {!user.roles.includes("ASSOCIATION") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => toggleRole(user.id, user.roles, "ASSOCIATION")}
                    >
                      + Asso
                    </Button>
                  )}
                  {!user.roles.includes("ADMIN") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => toggleRole(user.id, user.roles, "ADMIN")}
                    >
                      + Admin
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
