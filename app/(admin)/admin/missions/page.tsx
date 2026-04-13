"use client"

import { useAdminMissions, useUpdateMissionStatus } from "@/lib/api/queries/admin"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime } from "@/lib/utils"

export default function AdminMissionsPage() {
  const { data: missions = [], isLoading: loading } = useAdminMissions()
  const updateStatus = useUpdateMissionStatus()

  function handleCancel(id: string) {
    updateStatus.mutate({ id, status: "CANCELLED" })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Moderation des missions ({missions.length})</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Association</TableHead>
            <TableHead>Categorie</TableHead>
            <TableHead>Creneaux</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Creee le</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missions.map((mission) => (
            <TableRow key={mission.id}>
              <TableCell className="font-medium">{mission.title}</TableCell>
              <TableCell>{mission.association.name}</TableCell>
              <TableCell className="text-sm">{mission.category}</TableCell>
              <TableCell>{mission._count.slots}</TableCell>
              <TableCell>
                <StatusBadge status={mission.status} />
              </TableCell>
              <TableCell className="text-sm">
                {formatDateTime(new Date(mission.createdAt))}
              </TableCell>
              <TableCell>
                {mission.status === "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancel(mission.id)}
                    disabled={updateStatus.isPending}
                  >
                    Annuler
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
