import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole, requireMyAssociation } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export default async function StatsPage() {
  const session = await requireRole("ASSOCIATION")
  const association = await requireMyAssociation(session.user.id)

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [completedBookings, uniqueVolunteers, noShows, totalBookings] =
    await Promise.all([
      prisma.booking.findMany({
        where: {
          slot: { mission: { associationId: association.id } },
          status: "COMPLETED",
        },
        select: {
          slot: { select: { mission: { select: { durationMin: true } } } },
        },
      }),
      prisma.booking.findMany({
        where: {
          slot: { mission: { associationId: association.id } },
          status: { in: ["CONFIRMED", "COMPLETED"] },
          createdAt: { gte: monthStart },
        },
        select: { userId: true },
      }),
      prisma.booking.count({
        where: {
          slot: { mission: { associationId: association.id } },
          status: "NO_SHOW",
        },
      }),
      prisma.booking.count({
        where: {
          slot: { mission: { associationId: association.id } },
          status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW"] },
        },
      }),
    ])

  const totalHours = Math.round(
    completedBookings.reduce(
      (acc, b) => acc + b.slot.mission.durationMin,
      0,
    ) / 60,
  )

  const uniqueCount = new Set(uniqueVolunteers.map((b) => b.userId)).size

  const completionRate =
    totalBookings > 0
      ? Math.round(
          ((totalBookings - noShows) / totalBookings) * 100,
        )
      : 100

  const stats = [
    { label: "Heures ce mois", value: `${totalHours} h` },
    { label: "Participants uniques", value: uniqueCount },
    { label: "Taux de completion", value: `${completionRate} %` },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Statistiques</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">
            Graphiques disponibles prochainement
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
