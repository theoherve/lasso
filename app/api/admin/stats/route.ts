import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }
    if (!session.user.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    // TODO: replace with real aggregation queries
    const [usersCount, associationsCount, missionsCount, bookingsCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.association.count(),
        prisma.mission.count(),
        prisma.booking.count(),
      ])

    return NextResponse.json({
      users: usersCount,
      associations: associationsCount,
      missions: missionsCount,
      bookings: bookingsCount,
      // TODO: add more stats (active missions, bookings this week, no-show rate, etc.)
    })
  } catch (error) {
    console.error("[ADMIN_STATS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des statistiques" },
      { status: 500 },
    )
  }
}
