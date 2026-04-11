import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import type { Role } from "@/lib/generated/prisma/client"

export async function getSession() {
  return await auth()
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }
  return session
}

export async function requireRole(role: Role) {
  const session = await requireAuth()
  if (!session.user.roles.includes(role)) {
    redirect("/")
  }
  return session
}
