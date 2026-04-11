import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createSlotSchema } from "@/lib/validations/mission"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    // TODO: add filtering (upcoming only, available spots, etc.)
    const slots = await prisma.slot.findMany({
      where: { missionId: id },
      orderBy: { startsAt: "asc" },
    })

    return NextResponse.json(slots)
  } catch (error) {
    console.error("[SLOTS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des creneaux" },
      { status: 500 },
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }
    if (!session.user.roles.includes("ASSOCIATION")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const { id } = await params
    const body: unknown = await request.json()
    const parsed = createSlotSchema.safeParse({ ...body as Record<string, unknown>, missionId: id })
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // TODO: verify mission belongs to the user's association
    const slot = await prisma.slot.create({
      data: {
        ...parsed.data,
        spotsRemaining: parsed.data.spotsTotal,
      },
    })

    return NextResponse.json(slot, { status: 201 })
  } catch (error) {
    console.error("[SLOTS_POST]", error)
    return NextResponse.json(
      { error: "Erreur lors de la creation du creneau" },
      { status: 500 },
    )
  }
}
