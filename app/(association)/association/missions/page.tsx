import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { requireRole, requireMyAssociation } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { formatDateTime } from "@/lib/utils"

export default async function MissionsPage() {
  const session = await requireRole("ASSOCIATION")
  const association = await requireMyAssociation(session.user.id)

  const missions = await prisma.mission.findMany({
    where: { associationId: association.id },
    include: {
      _count: {
        select: {
          slots: true,
        },
      },
      slots: {
        where: { startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
        take: 1,
        select: {
          startsAt: true,
          _count: {
            select: { bookings: { where: { status: "CONFIRMED" } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Missions</h1>
        <Button render={<Link href="/association/missions/new" />}>
          Creer une mission
        </Button>
      </div>

      {missions.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Aucune mission. Creez votre premiere mission !
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Creneaux</TableHead>
              <TableHead>Prochain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => {
              const nextSlot = mission.slots[0]
              return (
                <TableRow key={mission.id}>
                  <TableCell>
                    <Link
                      href={`/association/missions/${mission.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {mission.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={mission.status} />
                  </TableCell>
                  <TableCell>{mission._count.slots}</TableCell>
                  <TableCell>
                    {nextSlot ? (
                      <span className="text-sm">
                        {formatDateTime(nextSlot.startsAt)}
                        {" "}
                        <span className="text-muted-foreground">
                          ({nextSlot._count.bookings} inscrit
                          {nextSlot._count.bookings > 1 ? "s" : ""})
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
