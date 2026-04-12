"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { VolunteerRow } from "@/components/lasso/VolunteerRow"
import { Skeleton } from "@/components/ui/skeleton"

interface VolunteerBooking {
  id: string
  status: string
  user: {
    id: string
    firstName: string | null
    name: string | null
    avatarUrl: string | null
    reliabilityScore: number
  }
}

const statuses = ["Tous", "CONFIRMED", "COMPLETED", "NO_SHOW", "CANCELLED"] as const

export default function VolunteersPage() {
  const [filter, setFilter] = useState<string>("Tous")
  const [bookings, setBookings] = useState<VolunteerBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/associations/me/bookings")
        if (res.ok) setBookings(await res.json())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s === "Tous" ? "Tous" : s.replace("_", " ")}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {uniqueByUser.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucun benevole pour ce filtre.
          </p>
        )}
        {uniqueByUser.map((v) => (
          <VolunteerRow key={v.user.id} user={v.user} booking={v.booking} />
        ))}
      </div>
    </div>
  )
}
