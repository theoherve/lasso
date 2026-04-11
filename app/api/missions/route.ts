import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createMissionSchema } from "@/lib/validations/mission"

export async function GET() {
  try {
    // TODO: replace mock with real query — prisma.mission.findMany({ include: { association: true, slots: true } })
    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(missions)
  } catch (error) {
    console.error("[MISSIONS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des missions" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }
    if (!session.user.roles.includes("ASSOCIATION")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = createMissionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // TODO: look up the association linked to session.user.id and pass associationId
    const mission = await prisma.mission.create({
      data: {
        ...parsed.data,
        associationId: "", // TODO: resolve from session user
      },
    })

    return NextResponse.json(mission, { status: 201 })
  } catch (error) {
    console.error("[MISSIONS_POST]", error)
    return NextResponse.json(
      { error: "Erreur lors de la creation de la mission" },
      { status: 500 },
    )
  }
}
