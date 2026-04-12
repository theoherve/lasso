"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, MapPin, Clock, Loader2, Star, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AssociationBadge } from "@/components/lasso/AssociationBadge"
import { SlotPicker } from "@/components/lasso/SlotPicker"
import { CategoryIcon } from "@/components/lasso/CategoryIcon"
import {
  getCategoryLabel,
  formatDuration,
  formatArrondissement,
} from "@/lib/utils"

interface Slot {
  id: string
  startsAt: string
  endsAt: string
  spotsRemaining: number
  spotsTotal: number
  status: string
}

interface MissionDetail {
  id: string
  title: string
  category: string
  description: string
  durationMin: number
  address: string | null
  association: {
    name: string
    slug: string
    logoUrl: string | null
    arrondissement: number
    humanValidated: boolean
    avgRating: number | null
    _count?: { missions: number }
  }
  slots: Slot[]
}

function RatingDisplay({ rating, count }: { rating: number | null; count?: number }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-1.5">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  )
}

export default function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  const [mission, setMission] = useState<MissionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/missions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found")
        return res.json()
      })
      .then(setMission)
      .catch(() => setMission(null))
      .finally(() => setLoading(false))
  }, [id])

  async function handleBook() {
    if (!selectedSlot) return

    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/mission/${id}`)
      return
    }

    setBooking(true)
    setError(null)

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: selectedSlot }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Erreur lors de la reservation")
        return
      }

      router.push(`/mission/${id}/book?slotId=${selectedSlot}`)
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    )
  }

  if (!mission) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Mission introuvable.</p>
        <Button variant="outline" className="mt-4 cursor-pointer" render={<Link href="/feed" />}>
          Retour au feed
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      {/* Two-column on desktop */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-10">
        {/* Left column: mission info */}
        <div className="space-y-6 lg:col-span-3">
          {/* Category icon */}
          <CategoryIcon category={mission.category} size="lg" />

          {/* Title + badges */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold leading-tight md:text-3xl">{mission.title}</h2>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {getCategoryLabel(mission.category)}
              </Badge>
              <Badge variant="outline" className="text-primary">
                <Clock className="mr-1 h-3 w-3" />
                {formatDuration(mission.durationMin)}
              </Badge>
              <Badge variant="outline">
                <MapPin className="mr-1 h-3 w-3" />
                {formatArrondissement(mission.association.arrondissement)}
              </Badge>
            </div>
          </div>

          {/* Association + rating */}
          <Card>
            <CardContent className="flex items-center justify-between">
              <AssociationBadge
                association={mission.association}
                size="lg"
                showVerified
              />
              <RatingDisplay
                rating={mission.association.avgRating}
                count={mission.association._count?.missions}
              />
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
              {mission.description}
            </p>
          </div>

          {/* Address */}
          {mission.address && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Adresse</h3>
              <Card>
                <CardContent className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{mission.address}</span>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right column: slots + CTA (sticky on desktop) */}
        <div className="mt-6 space-y-4 lg:col-span-2 lg:mt-0">
          <div className="lg:sticky lg:top-20">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Creneaux disponibles</h3>
              <SlotPicker
                slots={mission.slots}
                selectedId={selectedSlot}
                onSelect={setSelectedSlot}
              />
            </div>

            {error && (
              <p className="mt-3 text-sm text-destructive">{error}</p>
            )}

            {/* CTA */}
            <div className="sticky bottom-20 z-30 -mx-4 mt-4 bg-linear-to-t from-background via-background to-background/0 px-4 pb-4 pt-6 md:static md:mx-0 md:bg-none md:p-0 md:pt-4">
              {selectedSlot ? (
                <Button
                  className="w-full cursor-pointer"
                  size="lg"
                  onClick={handleBook}
                  disabled={booking}
                >
                  {booking ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isLoggedIn ? (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  ) : null}
                  {isLoggedIn ? "Je reserve ce creneau" : "Se connecter pour reserver"}
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Choisis un creneau
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
