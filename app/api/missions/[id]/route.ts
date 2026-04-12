import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateMissionSchema } from "@/lib/validations/mission"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        association: {
          select: {
            name: true,
            slug: true,
            logoUrl: true,
            arrondissement: true,
            humanValidated: true,
            avgRating: true,
            _count: {
              select: {
                missions: true,
              },
            },
          },
        },
        slots: {
          where: {
            startsAt: { gte: new Date() },
          },
          orderBy: { startsAt: "asc" },
          include: {
            _count: {
              select: {
                bookings: { where: { status: "CONFIRMED" } },
              },
            },
          },
        },
      },
    })

    if (!mission) {
      return NextResponse.json(
        { error: "Mission introuvable" },
        { status: 404 },
      )
    }

    const result = {
      ...mission,
      slots: mission.slots.map((slot) => ({
        id: slot.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        spotsTotal: slot.spotsTotal,
        spotsRemaining: slot.spotsTotal - slot._count.bookings,
        status: slot.spotsTotal - slot._count.bookings <= 0 ? "FULL" : slot.status,
      })),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[MISSION_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de la mission" },
      { status: 500 },
    )
  }
}

export async function PATCH(
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
    const parsed = updateMissionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // TODO: verify mission belongs to the user's association before updating
    const mission = await prisma.mission.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(mission)
  } catch (error) {
    console.error("[MISSION_PATCH]", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de la mission" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: Request,
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

    // TODO: verify mission belongs to the user's association before deleting
    await prisma.mission.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[MISSION_DELETE]", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la mission" },
      { status: 500 },
    )
  }
}
