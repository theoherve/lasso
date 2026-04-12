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

    const [users, associations, activeMissions, noShows, bookingsThisMonth] =
      await Promise.all([
        prisma.user.count(),
        prisma.association.count(),
        prisma.mission.count({ where: { status: "ACTIVE" } }),
        prisma.noShowReport.count(),
        prisma.booking.count({
          where: {
            createdAt: {
              gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1,
              ),
            },
          },
        }),
      ])

    return NextResponse.json({
      users,
      associations,
      activeMissions,
      noShows,
      bookingsThisMonth,
    })
  } catch (error) {
    console.error("[ADMIN_STATS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des statistiques" },
      { status: 500 },
    )
  }
}
