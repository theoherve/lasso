import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { VolunteerRow } from "@/components/lasso/VolunteerRow"
import { requireRole, requireMyAssociation } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { formatDuration } from "@/lib/utils"

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await requireRole("ASSOCIATION")
  const association = await requireMyAssociation(session.user.id)

  const mission = await prisma.mission.findUnique({
    where: { id, associationId: association.id },
    include: {
      slots: {
        orderBy: { startsAt: "asc" },
        include: {
          bookings: {
            where: { status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW"] } },
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
            },
          },
          _count: { select: { bookings: { where: { status: "CONFIRMED" } } } },
        },
      },
    },
  })

  if (!mission) {
    notFound()
  }

  const volunteers = mission.slots.flatMap((slot) =>
    slot.bookings.map((b) => ({
      user: b.user,
      booking: { status: b.status },
    })),
  )

  const uniqueVolunteers = Array.from(
    new Map(volunteers.map((v) => [v.user.id, v])).values(),
  )

  const totalSpots = mission.slots.reduce((acc, s) => acc + s.spotsTotal, 0)
  const totalBooked = mission.slots.reduce(
    (acc, s) => acc + s._count.bookings,
    0,
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{mission.title}</h1>
          <StatusBadge status={mission.status} />
        </div>
        <Button
          variant="outline"
          render={<Link href={`/association/missions/${id}/slots`} />}
        >
          Gerer les creneaux
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Categorie : </span>
              {mission.category}
            </div>
            <div>
              <span className="text-muted-foreground">Adresse : </span>
              {mission.address ?? "Non renseignee"}
            </div>
            <div>
              <span className="text-muted-foreground">Duree : </span>
              {formatDuration(mission.durationMin)}
            </div>
            <div>
              <span className="text-muted-foreground">Places : </span>
              {totalBooked} / {totalSpots}
            </div>
            <p className="pt-2 text-muted-foreground">{mission.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Benevoles inscrits ({uniqueVolunteers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uniqueVolunteers.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Aucun benevole inscrit.
              </p>
            ) : (
              uniqueVolunteers.map((v) => (
                <VolunteerRow
                  key={v.user.id}
                  user={v.user}
                  booking={v.booking}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
