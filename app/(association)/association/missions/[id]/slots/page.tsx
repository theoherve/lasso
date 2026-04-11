"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/lasso/StatusBadge"

const mockSlots = [
  { id: "s1", date: "12 avr. 2026", heure: "14:00 - 15:30", status: "OPEN", inscrits: 3, places: 8 },
  { id: "s2", date: "14 avr. 2026", heure: "18:00 - 19:30", status: "FULL", inscrits: 8, places: 8 },
  { id: "s3", date: "16 avr. 2026", heure: "10:00 - 11:30", status: "OPEN", inscrits: 1, places: 8 },
  { id: "s4", date: "19 avr. 2026", heure: "14:00 - 15:30", status: "OPEN", inscrits: 5, places: 8 },
]

export default function SlotsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des creneaux</h1>
        <Button>Ajouter un creneau</Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Mission #{id} &mdash; Gerez les creneaux disponibles pour cette mission.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {mockSlots.map((slot) => (
          <Card key={slot.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{slot.date}</span>
                <StatusBadge status={slot.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Horaire : </span>
                {slot.heure}
              </p>
              <p>
                <span className="text-muted-foreground">Inscrits : </span>
                {slot.inscrits} / {slot.places}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
