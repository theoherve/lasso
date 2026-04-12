"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Plus } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

interface Slot {
  id: string
  startsAt: string
  endsAt: string
  spotsTotal: number
  spotsRemaining: number
  status: string
}

export default function SlotsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchSlots() {
    setLoading(true)
    try {
      const res = await fetch(`/api/missions/${id}/slots`)
      if (res.ok) setSlots(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [id])

  async function handleAddSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const startsAt = (form.get("startsAt") as string)
    const endsAt = (form.get("endsAt") as string)
    const spotsTotal = Number(form.get("spotsTotal"))

    try {
      const res = await fetch(`/api/missions/${id}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString(),
          spotsTotal,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Erreur lors de la creation")
        return
      }

      setShowForm(false)
      fetchSlots()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des creneaux</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 h-4 w-4" />
          Ajouter un creneau
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau creneau</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startsAt">Debut</Label>
                  <Input
                    id="startsAt"
                    name="startsAt"
                    type="datetime-local"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endsAt">Fin</Label>
                  <Input
                    id="endsAt"
                    name="endsAt"
                    type="datetime-local"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="spotsTotal">Nombre de places</Label>
                <Input
                  id="spotsTotal"
                  name="spotsTotal"
                  type="number"
                  min={1}
                  max={50}
                  defaultValue={10}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Creer le creneau
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Aucun creneau. Ajoutez-en un pour que les benevoles puissent s&apos;inscrire.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {slots.map((slot) => {
            const booked = slot.spotsTotal - slot.spotsRemaining
            return (
              <Card key={slot.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm">
                      {formatDateTime(new Date(slot.startsAt))}
                    </span>
                    <StatusBadge
                      status={booked >= slot.spotsTotal ? "FULL" : slot.status}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Fin : </span>
                    {formatDateTime(new Date(slot.endsAt))}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Inscrits : </span>
                    {booked} / {slot.spotsTotal}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
