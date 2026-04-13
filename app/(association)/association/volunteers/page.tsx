"use client"

import { useState } from "react"
import { useAssociationVolunteers } from "@/lib/api/queries/associations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VolunteerRow } from "@/components/lasso/VolunteerRow"
import { Skeleton } from "@/components/ui/skeleton"
import { Users } from "lucide-react"

const statuses = ["Tous", "CONFIRMED", "COMPLETED", "NO_SHOW", "CANCELLED"] as const
const statusLabels: Record<string, string> = {
  Tous: "Tous",
  CONFIRMED: "Confirmes",
  COMPLETED: "Termines",
  NO_SHOW: "Absents",
  CANCELLED: "Annules",
}

export default function VolunteersPage() {
  const [filter, setFilter] = useState<string>("Tous")
  const { data: bookings = [], isLoading: loading } = useAssociationVolunteers()

  const filtered =
    filter === "Tous"
      ? bookings
      : bookings.filter((b) => b.status === filter)

  const uniqueByUser = Array.from(
    new Map(
      filtered.map((b) => [
        b.user.id,
        { user: b.user, booking: { status: b.status } },
      ]),
    ).values(),
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Benevoles inscrits</h1>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {statusLabels[s]}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {uniqueByUser.length} benevole{uniqueByUser.length > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {uniqueByUser.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Aucun benevole pour ce filtre.
              </p>
            </div>
          ) : (
            uniqueByUser.map((v) => (
              <VolunteerRow key={v.user.id} user={v.user} booking={v.booking} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
