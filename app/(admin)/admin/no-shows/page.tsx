"use client"

import { useAdminNoShows } from "@/lib/api/queries/admin"
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

export default function AdminNoShowsPage() {
  const { data: reports = [], isLoading: loading } = useAdminNoShows()

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Signalements no-show ({reports.length})</h1>

      {reports.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Aucun signalement pour le moment.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Benevole</TableHead>
              <TableHead>Mission</TableHead>
              <TableHead>Date du creneau</TableHead>
              <TableHead>Signale le</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  {report.booking.user.firstName ?? report.booking.user.name ?? "—"}
                </TableCell>
                <TableCell>{report.booking.slot.mission.title}</TableCell>
                <TableCell>
                  {formatDateTime(new Date(report.booking.slot.startsAt))}
                </TableCell>
                <TableCell>
                  {formatDateTime(new Date(report.createdAt))}
                </TableCell>
                <TableCell className="max-w-xs text-sm text-muted-foreground">
                  {report.note ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
