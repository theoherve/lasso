"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryIcon } from "@/components/lasso/CategoryIcon"
import {
  CheckCircle2,
  CalendarPlus,
  ArrowRight,
  MapPin,
  Clock,
  CalendarDays,
  Bell,
} from "lucide-react"
import {
  formatFullDate,
  formatTime,
  generateGoogleCalendarUrl,
} from "@/lib/utils"

interface MissionDetail {
  id: string
  title: string
  category: string
  description: string
  durationMin: number
  address: string | null
  association: {
    name: string
  }
  slots: {
    id: string
    startsAt: string
    endsAt: string
  }[]
}

export default function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const slotId = searchParams.get("slotId")
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] ?? "Toi"

  const [mission, setMission] = useState<MissionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/missions/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found")
        return r.json()
      })
      .then(setMission)
      .catch(() => setMission(null))
      .finally(() => setLoading(false))
  }, [id])

  const bookedSlot = mission?.slots.find((s) => s.id === slotId) ?? mission?.slots[0]
  const startsAt = bookedSlot ? new Date(bookedSlot.startsAt) : null
  const endsAt = bookedSlot ? new Date(bookedSlot.endsAt) : null

  const calendarUrl =
    mission && startsAt && endsAt
      ? generateGoogleCalendarUrl({
          title: `${mission.title} — Lasso`,
          startDate: startsAt,
          endDate: endsAt,
          location: mission.address ?? undefined,
          description: `Mission benevole avec ${mission.association.name}`,
        })
      : null

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="mt-6 h-8 w-48" />
        <Skeleton className="mt-4 h-40 w-full max-w-md rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      {/* Success icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-confirmed-bg">
        <CheckCircle2 className="h-10 w-10 text-status-confirmed" />
      </div>

      {/* Title */}
      <h2 className="mt-6 text-2xl font-bold">C&apos;est reserve !</h2>
      <p className="mt-2 text-center text-muted-foreground">
        {firstName}, tu vas faire quelque chose de bien
      </p>

      {/* Mission summary card */}
      {mission && (
        <Card className="mt-8 w-full max-w-md">
          <CardContent className="space-y-4">
            {/* Mission header */}
            <div className="flex items-center gap-3">
              <CategoryIcon category={mission.category} size="md" />
              <div>
                <h3 className="font-semibold">{mission.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {mission.association.name}
                </p>
              </div>
            </div>

            {/* Details */}
            {startsAt && (
              <div className="space-y-2.5 border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Date
                  </span>
                  <span className="font-medium capitalize">
                    {formatFullDate(startsAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Heure
                  </span>
                  <span className="font-medium">{formatTime(startsAt)}</span>
                </div>
                {mission.address && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Adresse
                    </span>
                    <span className="max-w-50 text-right font-medium">
                      {mission.address}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reminder */}
      <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Bell className="h-4 w-4" />
        Tu recevras un rappel 24h avant
      </p>

      {/* Actions */}
      <div className="mt-6 flex w-full max-w-md flex-col gap-3">
        {calendarUrl && (
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            render={<a href={calendarUrl} target="_blank" rel="noopener noreferrer" />}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Ajouter au calendrier
          </Button>
        )}
        <Button className="w-full cursor-pointer" render={<Link href="/missions" />}>
          Voir mes missions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
