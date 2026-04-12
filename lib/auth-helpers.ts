import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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
    redirect("/feed")
  }
  return session
}

export async function getMyAssociation(userId: string) {
  const membership = await prisma.associationMember.findFirst({
    where: { userId },
    include: { association: true },
  })
  return membership?.association ?? null
}

export async function requireMyAssociation(userId: string) {
  const association = await getMyAssociation(userId)
  if (!association) {
    redirect("/feed")
  }
  return association
}
