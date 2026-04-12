import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { computeEarnedBadges } from "@/lib/badges"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { reliabilityScore: true },
    })

    const completedBookings = await prisma.booking.findMany({
      where: { userId: session.user.id, status: "COMPLETED" },
      select: {
        slot: {
          select: {
            mission: {
              select: {
                durationMin: true,
                associationId: true,
              },
            },
          },
        },
      },
    })

    // Calculate streak (consecutive non-no-show bookings from most recent)
    const recentBookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        status: { in: ["COMPLETED", "NO_SHOW"] },
      },
      orderBy: { createdAt: "desc" },
      select: { status: true },
    })

    let streak = 0
    for (const b of recentBookings) {
      if (b.status === "COMPLETED") streak++
      else break
    }

    const totalHours = completedBookings.reduce(
      (acc, b) => acc + b.slot.mission.durationMin,
      0,
    ) / 60

    const uniqueAssociations = new Set(
      completedBookings.map((b) => b.slot.mission.associationId),
    ).size

    const badges = computeEarnedBadges({
      missionsCompleted: completedBookings.length,
      totalHours: Math.round(totalHours),
      uniqueAssociations,
      reliabilityScore: user?.reliabilityScore ?? 5,
      streak,
    })

    return NextResponse.json({
      badges: badges.map(({ id, name, description, icon }) => ({
        id,
        name,
        description,
        icon,
      })),
      stats: {
        missionsCompleted: completedBookings.length,
        totalHours: Math.round(totalHours),
        uniqueAssociations,
        streak,
      },
    })
  } catch (error) {
    console.error("[USER_BADGES_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des badges" },
      { status: 500 },
    )
  }
}
