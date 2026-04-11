"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { VolunteerRow } from "@/components/lasso/VolunteerRow"

const mockVolunteers = [
  { user: { id: "v1", firstName: "Marie", name: "Dupont", avatarUrl: null, reliabilityScore: 92 }, booking: { status: "CONFIRMED" } },
  { user: { id: "v2", firstName: "Lucas", name: "Martin", avatarUrl: null, reliabilityScore: 88 }, booking: { status: "CONFIRMED" } },
  { user: { id: "v3", firstName: "Camille", name: "Bernard", avatarUrl: null, reliabilityScore: 75 }, booking: { status: "PENDING" } },
  { user: { id: "v4", firstName: "Hugo", name: "Petit", avatarUrl: null, reliabilityScore: 95 }, booking: { status: "COMPLETED" } },
  { user: { id: "v5", firstName: "Lea", name: "Moreau", avatarUrl: null, reliabilityScore: 60 }, booking: { status: "NO_SHOW" } },
]

const statuses = ["Tous", "CONFIRMED", "PENDING", "COMPLETED", "NO_SHOW"] as const

export default function VolunteersPage() {
  const [filter, setFilter] = useState<string>("Tous")

  const filtered =
    filter === "Tous"
      ? mockVolunteers
      : mockVolunteers.filter((v) => v.booking.status === filter)

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
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucun benevole pour ce filtre.
          </p>
        )}
        {filtered.map((v) => (
          <VolunteerRow key={v.user.id} user={v.user} booking={v.booking} />
        ))}
      </div>
    </div>
  )
}
