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

    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        association: { select: { name: true } },
        _count: {
          select: {
            slots: true,
          },
        },
      },
    })

    return NextResponse.json(missions)
  } catch (error) {
    console.error("[ADMIN_MISSIONS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des missions" },
      { status: 500 },
    )
  }
}

const updateStatusSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(["ACTIVE", "CANCELLED"]),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = updateStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const mission = await prisma.mission.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    })

    return NextResponse.json(mission)
  } catch (error) {
    console.error("[ADMIN_MISSIONS_PATCH]", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour" },
      { status: 500 },
    )
  }
}
