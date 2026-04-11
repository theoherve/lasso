"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AssociationBadge } from "@/components/lasso/AssociationBadge"
import { SlotPicker } from "@/components/lasso/SlotPicker"

const mockMission = {
  id: "1",
  title: "Distribution de repas aux sans-abris",
  category: "aide_personne",
  description:
    "Rejoins notre equipe pour distribuer des repas chauds aux personnes en situation de precarite dans le 3e arrondissement. Nous fournissons tout le materiel necessaire. Viens avec le sourire et de bonnes chaussures !",
  durationMin: 120,
  address: "12 rue du Faubourg Saint-Martin, 75003 Paris",
  association: {
    name: "Les Restos du Coeur",
    logoUrl: null,
    humanValidated: true,
  },
  slots: [
    {
      id: "slot-1",
      startsAt: "2026-04-15T09:00:00Z",
      endsAt: "2026-04-15T11:00:00Z",
      spotsRemaining: 4,
      spotsTotal: 10,
      status: "OPEN",
    },
    {
      id: "slot-2",
      startsAt: "2026-04-16T09:00:00Z",
      endsAt: "2026-04-16T11:00:00Z",
      spotsRemaining: 1,
      spotsTotal: 10,
      status: "OPEN",
    },
    {
      id: "slot-3",
      startsAt: "2026-04-17T09:00:00Z",
      endsAt: "2026-04-17T11:00:00Z",
      spotsRemaining: 0,
      spotsTotal: 10,
      status: "FULL",
    },
  ],
}

export default function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  // In a real app, fetch mission by id
  const mission = mockMission

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

      {selectedSlot ? (
        <Button className="w-full" size="lg" render={<Link href={`/mission/${id}/book?slot=${selectedSlot}`} />}>
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
