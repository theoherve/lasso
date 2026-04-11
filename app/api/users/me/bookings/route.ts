import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const period = searchParams.get("period") // "upcoming" | "past"

    const now = new Date()
    const slotFilter =
      period === "upcoming"
        ? { startsAt: { gte: now } }
        : period === "past"
          ? { startsAt: { lt: now } }
          : {}

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        slot: slotFilter,
      },
      include: {
        slot: {
          include: {
            mission: {
              include: {
                association: {
                  select: {
                    name: true,
                    slug: true,
                    arrondissement: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { slot: { startsAt: period === "past" ? "desc" : "asc" } },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[USER_BOOKINGS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des reservations" },
      { status: 500 },
    )
  }
}
