"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { EmptyState } from "@/components/lasso/EmptyState"
import { CalendarDays, Clock, MapPin } from "lucide-react"

const upcomingMissions = [
  {
    id: "1",
    title: "Distribution de repas aux sans-abris",
    association: "Les Restos du Coeur",
    date: "15 avr. 2026 - 09h00",
    location: "3e arr.",
    status: "CONFIRMED" as const,
    durationMin: 120,
  },
  {
    id: "2",
    title: "Nettoyage des berges du Canal Saint-Martin",
    association: "Clean Walk Paris",
    date: "16 avr. 2026 - 10h00",
    location: "11e arr.",
    status: "PENDING" as const,
    durationMin: 180,
  },
]

const pastMissions = [
  {
    id: "3",
    title: "Soutien scolaire college",
    association: "AFEV Paris",
    date: "8 avr. 2026 - 14h00",
    location: "20e arr.",
    status: "COMPLETED" as const,
    durationMin: 90,
  },
]

interface MissionItem {
  id: string
  title: string
  association: string
  date: string
  location: string
  status: string
  durationMin: number
}

function MissionList({ missions }: { missions: MissionItem[] }) {
  if (missions.length === 0) {
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
      {missions.map((mission) => (
        <Card key={mission.id}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div className="space-y-1.5">
              <h3 className="font-semibold leading-tight">{mission.title}</h3>
              <p className="text-sm text-muted-foreground">
                {mission.association}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {mission.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {mission.durationMin} min
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {mission.location}
                </span>
              </div>
            </div>
            <StatusBadge status={mission.status} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function MissionsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes missions</h2>

      <Tabs defaultValue={0}>
        <TabsList className="w-full">
          <TabsTrigger value={0}>A venir</TabsTrigger>
          <TabsTrigger value={1}>Passees</TabsTrigger>
        </TabsList>
        <TabsContent value={0} className="mt-4">
          <MissionList missions={upcomingMissions} />
        </TabsContent>
        <TabsContent value={1} className="mt-4">
          <MissionList missions={pastMissions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
