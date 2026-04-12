import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        roles: true,
        reliabilityScore: true,
        noShowCount: true,
        createdAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des utilisateurs" },
      { status: 500 },
    )
  }
}

const updateRolesSchema = z.object({
  userId: z.string().cuid(),
  roles: z.array(z.enum(["VOLUNTEER", "ASSOCIATION", "ADMIN"])).min(1),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = updateRolesSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const user = await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { roles: parsed.data.roles },
      select: { id: true, email: true, roles: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[ADMIN_USERS_PATCH]", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour" },
      { status: 500 },
    )
  }
}
