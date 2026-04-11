"use client"

import { useState } from "react"
import { FilterChips } from "@/components/lasso/FilterChips"
import { MissionCard } from "@/components/lasso/MissionCard"

const categoryOptions = [
  { value: "aide_personne", label: "Aide a la personne" },
  { value: "environnement", label: "Environnement" },
  { value: "education", label: "Education" },
  { value: "autre", label: "Autre" },
]

const arrondissementOptions = [
  { value: "3", label: "3e" },
  { value: "5", label: "5e" },
  { value: "11", label: "11e" },
  { value: "18", label: "18e" },
  { value: "20", label: "20e" },
]

const mockMissions = [
  {
    id: "1",
    title: "Distribution de repas aux sans-abris",
    category: "aide_personne",
    durationMin: 120,
    address: "12 rue du Faubourg Saint-Martin",
    association: { name: "Les Restos du Coeur", logoUrl: null, arrondissement: 3 },
    nextSlot: {
      startsAt: "2026-04-15T09:00:00Z",
      spotsRemaining: 4,
    },
  },
  {
    id: "2",
    title: "Nettoyage des berges du Canal Saint-Martin",
    category: "environnement",
    durationMin: 180,
    address: "Quai de Valmy",
    association: { name: "Clean Walk Paris", logoUrl: null, arrondissement: 11 },
    nextSlot: {
      startsAt: "2026-04-16T10:00:00Z",
      spotsRemaining: 8,
    },
  },
  {
    id: "3",
    title: "Soutien scolaire college",
    category: "education",
    durationMin: 90,
    address: "45 rue de Belleville",
    association: { name: "AFEV Paris", logoUrl: null, arrondissement: 20 },
    nextSlot: {
      startsAt: "2026-04-17T14:00:00Z",
      spotsRemaining: 2,
    },
  },
  {
    id: "4",
    title: "Maraude de nuit - Gare du Nord",
    category: "aide_personne",
    durationMin: 240,
    address: "Gare du Nord",
    association: { name: "Utopia 56", logoUrl: null, arrondissement: 18 },
    nextSlot: {
      startsAt: "2026-04-18T20:00:00Z",
      spotsRemaining: 6,
    },
  },
]

export default function FeedPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedArrondissements, setSelectedArrondissements] = useState<string[]>([])

  const filteredMissions = mockMissions.filter((mission) => {
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(mission.category)
    const matchArrondissement =
      selectedArrondissements.length === 0 ||
      selectedArrondissements.includes(String(mission.association.arrondissement))
    return matchCategory && matchArrondissement
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Missions disponibles</h2>

      <div className="space-y-3">
        <FilterChips
          options={categoryOptions}
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />
        <FilterChips
          options={arrondissementOptions}
          selected={selectedArrondissements}
          onChange={setSelectedArrondissements}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>

      {filteredMissions.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          Aucune mission ne correspond a tes filtres.
        </p>
      )}
    </div>
  )
}
