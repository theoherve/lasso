import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getMyAssociation } from "@/lib/auth-helpers"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const association = await getMyAssociation(session.user.id)
    if (!association) {
      return NextResponse.json(
        { error: "Aucune association liee" },
        { status: 403 },
      )
    }

    const bookings = await prisma.booking.findMany({
      where: {
        slot: {
          mission: { associationId: association.id },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            name: true,
            avatarUrl: true,
            reliabilityScore: true,
          },
        },
        slot: {
          select: {
            startsAt: true,
            mission: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[ASSOCIATION_ME_BOOKINGS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des reservations" },
      { status: 500 },
    )
  }
}
