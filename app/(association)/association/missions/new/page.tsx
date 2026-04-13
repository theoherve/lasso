"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateMission } from "@/lib/api/queries/missions"
import { ApiError } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function NewMissionPage() {
  const router = useRouter()
  const createMission = useCreateMission()
  const [error, setError] = useState<string | null>(null)
  const saving = createMission.isPending

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = new FormData(e.currentTarget)

    const input = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      category: form.get("category") as string,
      address: (form.get("address") as string) || undefined,
      durationMin: Number(form.get("durationMin")),
      maxVolunteers: Number(form.get("maxVolunteers")) || 1,
    }

    try {
      const mission = await createMission.mutateAsync(input)
      router.push(`/association/missions/${mission.id}`)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? ((err.body as { error?: string })?.error ?? err.message)
          : "Erreur lors de la creation"
      setError(message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Creer une mission</h1>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Card>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" placeholder="Ex : Maraude Paris 11e" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                minLength={10}
                placeholder="Décrivez la mission, les objectifs et les consignes..."
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select name="category" required defaultValue="">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aide_personne">Aide à la personne</SelectItem>
                  <SelectItem value="environnement">Environnement</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" name="address" placeholder="Ex : 12 rue de la Roquette, 75011 Paris" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Durée (minutes)</Label>
                <Select name="durationMin" defaultValue="90">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                    <SelectItem value="180">180 minutes</SelectItem>
                    <SelectItem value="240">240 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxVolunteers">Places max</Label>
                <Input
                  id="maxVolunteers"
                  name="maxVolunteers"
                  type="number"
                  placeholder="10"
                  min={1}
                  max={50}
                  defaultValue={10}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publier la mission
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
