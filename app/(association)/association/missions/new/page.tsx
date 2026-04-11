"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NewMissionPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Creer une mission</h1>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="titre">Titre</Label>
          <Input id="titre" placeholder="Ex : Maraude Paris 11e" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            placeholder="Decrivez la mission, les objectifs et les consignes..."
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>

        <div className="space-y-2">
          <Label>Categorie</Label>
          <Select defaultValue="">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir une categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maraude">Maraude</SelectItem>
              <SelectItem value="alimentaire">Aide alimentaire</SelectItem>
              <SelectItem value="scolaire">Soutien scolaire</SelectItem>
              <SelectItem value="administratif">Accompagnement administratif</SelectItem>
              <SelectItem value="environnement">Environnement</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Input id="adresse" placeholder="Ex : 12 rue de la Roquette, 75011 Paris" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Duree</Label>
            <Select defaultValue="90">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Duree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="places">Places max</Label>
            <Input id="places" type="number" placeholder="10" min={1} />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Publier la mission
        </Button>
      </form>
    </div>
  )
}
