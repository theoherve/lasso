import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
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

    // TODO: verify the association belongs to the current user
    // TODO: add pagination and date filtering
    const bookings = await prisma.booking.findMany({
      where: {
        slot: {
          mission: {
            associationId: id,
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        slot: { select: { id: true, startsAt: true, endsAt: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[ASSOCIATION_BOOKINGS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des reservations" },
      { status: 500 },
    )
  }
}
