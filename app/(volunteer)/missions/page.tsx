"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { EmptyState } from "@/components/lasso/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, Clock, MapPin, X, Star } from "lucide-react"
import { formatDateTime, formatDuration, formatArrondissement } from "@/lib/utils"
import {
  useMyBookings,
  useCancelBooking,
  useRateBooking,
  type BookingItem,
} from "@/lib/api/queries/bookings"

function RatingStars({
  bookingId,
  existingScore,
}: {
  bookingId: string
  existingScore: number | null
}) {
  const [hovering, setHovering] = useState(0)
  const rate = useRateBooking()
  const score = existingScore

  function handleRate(value: number) {
    if (score || rate.isPending) return
    rate.mutate({ bookingId, score: value })
  }

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHovering(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!!score || rate.isPending}
          onClick={() => handleRate(i)}
          onMouseEnter={() => !score && setHovering(i)}
          className="p-0.5 disabled:cursor-default"
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              i <= (score ?? hovering)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
      {score && (
        <span className="ml-1 text-xs text-muted-foreground">Note</span>
      )}
    </div>
  )
}

function BookingList({
  bookings,
  onCancel,
  showCancel,
  showRating,
}: {
  bookings: BookingItem[]
  onCancel?: (id: string) => void
  showCancel?: boolean
  showRating?: boolean
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
          <CardContent className="flex items-start justify-between gap-4">
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
              {showRating &&
                (booking.status === "COMPLETED" || booking.status === "CONFIRMED") && (
                  <RatingStars
                    bookingId={booking.id}
                    existingScore={booking.rating?.score ?? null}
                  />
                )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function MissionsPage() {
  const upcomingQ = useMyBookings("upcoming")
  const pastQ = useMyBookings("past")
  const cancel = useCancelBooking()

  const upcoming = upcomingQ.data ?? []
  const past = pastQ.data ?? []
  const loading = upcomingQ.isLoading || pastQ.isLoading

  function handleCancel(bookingId: string) {
    cancel.mutate(bookingId)
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
          <BookingList bookings={past} showRating />
        </TabsContent>
      </Tabs>
    </div>
  )
}
