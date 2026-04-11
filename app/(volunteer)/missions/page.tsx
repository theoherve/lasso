"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { EmptyState } from "@/components/lasso/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, Clock, MapPin, X } from "lucide-react"
import { formatDateTime, formatDuration, formatArrondissement } from "@/lib/utils"

interface BookingItem {
  id: string
  status: string
  slot: {
    startsAt: string
    endsAt: string
    mission: {
      id: string
      title: string
      durationMin: number
      association: {
        name: string
        arrondissement: number
      }
    }
  }
}

function BookingList({
  bookings,
  onCancel,
  showCancel,
}: {
  bookings: BookingItem[]
  onCancel?: (id: string) => void
  showCancel?: boolean
}) {
  if (bookings.length === 0) {
    return (
      <EmptyState
        title="Aucune mission"
        description="Tu n'as pas encore de mission ici. Explore le feed pour en trouver !"
        action={{ label: "Voir les missions", href: "/feed" }}
      />
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <Link href={`/mission/${booking.slot.mission.id}`} className="flex-1 space-y-1.5">
              <h3 className="font-semibold leading-tight">
                {booking.slot.mission.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {booking.slot.mission.association.name}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDateTime(new Date(booking.slot.startsAt))}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(booking.slot.mission.durationMin)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {formatArrondissement(booking.slot.mission.association.arrondissement)}
                </span>
              </div>
            </Link>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={booking.status} />
              {showCancel && booking.status === "CONFIRMED" && onCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() => onCancel(booking.id)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Annuler
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function MissionsPage() {
  const [upcoming, setUpcoming] = useState<BookingItem[]>([])
  const [past, setPast] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchBookings() {
    setLoading(true)
    try {
      const [upRes, pastRes] = await Promise.all([
        fetch("/api/users/me/bookings?period=upcoming"),
        fetch("/api/users/me/bookings?period=past"),
      ])
      if (upRes.ok) setUpcoming(await upRes.json())
      if (pastRes.ok) setPast(await pastRes.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  async function handleCancel(bookingId: string) {
    const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" })
    if (res.ok) {
      setUpcoming((prev) => prev.filter((b) => b.id !== bookingId))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes missions</h2>

      <Tabs defaultValue={0}>
        <TabsList className="w-full">
          <TabsTrigger value={0}>
            A venir {upcoming.length > 0 && `(${upcoming.length})`}
          </TabsTrigger>
          <TabsTrigger value={1}>
            Passees {past.length > 0 && `(${past.length})`}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={0} className="mt-4">
          <BookingList bookings={upcoming} onCancel={handleCancel} showCancel />
        </TabsContent>
        <TabsContent value={1} className="mt-4">
          <BookingList bookings={past} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
