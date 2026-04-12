import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { requireRole } from "@/lib/auth-helpers"
import { requireMyAssociation } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { formatDateTime } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await requireRole("ASSOCIATION")
  const association = await requireMyAssociation(session.user.id)

  const [activeMissions, monthBookings, recentBookings, nextSlot] =
    await Promise.all([
      prisma.mission.count({
        where: { associationId: association.id, status: "ACTIVE" },
      }),
      prisma.booking.count({
        where: {
          slot: { mission: { associationId: association.id } },
          status: "CONFIRMED",
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.booking.findMany({
        where: {
          slot: { mission: { associationId: association.id } },
        },
        include: {
          user: { select: { firstName: true, name: true } },
          slot: {
            select: {
              startsAt: true,
              mission: { select: { title: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.slot.findFirst({
        where: {
          mission: { associationId: association.id },
          startsAt: { gte: new Date() },
          status: "OPEN",
        },
        orderBy: { startsAt: "asc" },
        select: { startsAt: true },
      }),
    ])

  const completedHours = await prisma.booking.findMany({
    where: {
      slot: { mission: { associationId: association.id } },
      status: "COMPLETED",
    },
    select: {
      slot: { select: { mission: { select: { durationMin: true } } } },
    },
  })

  const totalHours = Math.round(
    completedHours.reduce(
      (acc, b) => acc + b.slot.mission.durationMin,
      0,
    ) / 60,
  )

  const kpis = [
    { label: "Missions actives", value: activeMissions },
    { label: "Inscrits ce mois", value: monthBookings },
    { label: "Heures completees", value: `${totalHours} h` },
    {
      label: "Prochain creneau",
      value: nextSlot
        ? formatDateTime(nextSlot.startsAt)
        : "Aucun",
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Vue d&apos;ensemble</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservations recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune reservation pour le moment.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Benevole</TableHead>
                  <TableHead>Mission</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.user.firstName ?? booking.user.name ?? "—"}
                    </TableCell>
                    <TableCell>{booking.slot.mission.title}</TableCell>
                    <TableCell>
                      {formatDateTime(booking.slot.startsAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
