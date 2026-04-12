import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboardPage() {
  await requireRole("ADMIN")

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

  const stats = [
    { label: "Utilisateurs", value: users },
    { label: "Associations", value: associations },
    { label: "Missions actives", value: activeMissions },
    { label: "Reservations ce mois", value: bookingsThisMonth },
    { label: "Signalements no-show", value: noShows },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Tableau de bord admin</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {stat.value.toLocaleString("fr-FR")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
