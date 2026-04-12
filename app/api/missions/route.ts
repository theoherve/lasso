import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createMissionSchema } from "@/lib/validations/mission"
import { MissionStatus, SlotStatus, BookingStatus } from "@/lib/generated/prisma/enums"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get("category")
    const arrondissement = searchParams.get("arrondissement")

    const categories = category ? category.split(",").filter(Boolean) : []
    const arrondissements = arrondissement
      ? arrondissement.split(",").map(Number).filter((n) => !isNaN(n))
      : []

    const missions = await prisma.mission.findMany({
      where: {
        status: MissionStatus.ACTIVE,
        ...(categories.length > 0 && { category: { in: categories } }),
        ...(arrondissements.length > 0 && {
          association: { arrondissement: { in: arrondissements } },
        }),
      },
      include: {
        association: {
          select: {
            name: true,
            slug: true,
            logoUrl: true,
            arrondissement: true,
          },
        },
        slots: {
          where: {
            status: SlotStatus.OPEN,
            startsAt: { gte: new Date() },
          },
          orderBy: { startsAt: "asc" },
          take: 1,
          include: {
            _count: {
              select: {
                bookings: { where: { status: BookingStatus.CONFIRMED } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const result = missions.map((m) => {
      const nextSlot = m.slots[0] ?? null
      return {
        id: m.id,
        title: m.title,
        category: m.category,
        durationMin: m.durationMin,
        address: m.address,
        association: m.association,
        nextSlot: nextSlot
          ? {
              startsAt: nextSlot.startsAt,
              spotsRemaining: nextSlot.spotsTotal - nextSlot._count.bookings,
            }
          : null,
      }
    })

    return NextResponse.json(result)
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

    const membership = await prisma.associationMember.findFirst({
      where: { userId: session.user.id },
      select: { associationId: true },
    })

    if (!membership) {
      return NextResponse.json(
        { error: "Aucune association liee a votre compte" },
        { status: 403 },
      )
    }

    const mission = await prisma.mission.create({
      data: {
        ...parsed.data,
        associationId: membership.associationId,
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
