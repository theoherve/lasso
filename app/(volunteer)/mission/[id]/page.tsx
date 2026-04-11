"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AssociationBadge } from "@/components/lasso/AssociationBadge"
import { SlotPicker } from "@/components/lasso/SlotPicker"

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
  }
  slots: Slot[]
}

export default function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
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

      router.push(`/mission/${id}/book`)
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    )
  }

  if (!mission) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Mission introuvable.</p>
        <Button variant="outline" className="mt-4" render={<Link href="/feed" />}>
          Retour au feed
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href="/feed"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div className="space-y-4">
        <div className="space-y-2">
          <Badge variant="secondary">{mission.category}</Badge>
          <h2 className="text-2xl font-bold">{mission.title}</h2>
        </div>

        <AssociationBadge
          association={mission.association}
          size="lg"
          showVerified
        />
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{mission.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Duree : {mission.durationMin} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>
              {mission.slots.reduce((acc, s) => acc + s.spotsRemaining, 0)}{" "}
              places restantes au total
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {mission.description}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Choisis ton creneau</h3>
        <SlotPicker
          slots={mission.slots}
          selectedId={selectedSlot}
          onSelect={setSelectedSlot}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {selectedSlot ? (
        <Button className="w-full" size="lg" onClick={handleBook} disabled={booking}>
          {booking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Je reserve
        </Button>
      ) : (
        <Button className="w-full" size="lg" disabled>
          Selectionne un creneau
        </Button>
      )}
    </div>
  )
}
