"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FilterChips } from "@/components/lasso/FilterChips"
import { MissionCard } from "@/components/lasso/MissionCard"
import { Skeleton } from "@/components/ui/skeleton"

const categoryOptions = [
  { value: "aide_personne", label: "Aide a la personne" },
  { value: "environnement", label: "Environnement" },
  { value: "education", label: "Education" },
  { value: "autre", label: "Autre" },
]

const arrondissementOptions = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}e`,
}))

interface Mission {
  id: string
  title: string
  category: string
  durationMin: number
  address: string | null
  association: {
    name: string
    slug: string
    logoUrl: string | null
    arrondissement: number
  }
  nextSlot: {
    startsAt: string
    spotsRemaining: number
  } | null
}

function FeedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCategories = searchParams.get("category")?.split(",").filter(Boolean) ?? []
  const selectedArrondissements = searchParams.get("arrondissement")?.split(",").filter(Boolean) ?? []

  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  function updateParams(key: string, values: string[]) {
    const params = new URLSearchParams(searchParams.toString())
    if (values.length > 0) {
      params.set(key, values.join(","))
    } else {
      params.delete(key)
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const fetchMissions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","))
      if (selectedArrondissements.length > 0) params.set("arrondissement", selectedArrondissements.join(","))

      const res = await fetch(`/api/missions?${params.toString()}`)
      if (res.ok) {
        setMissions(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }, [searchParams.toString()])

  useEffect(() => {
    fetchMissions()
  }, [fetchMissions])

  return (
    <>
      <div className="space-y-3">
        <FilterChips
          options={categoryOptions}
          selected={selectedCategories}
          onChange={(v) => updateParams("category", v)}
        />
        <FilterChips
          options={arrondissementOptions}
          selected={selectedArrondissements}
          onChange={(v) => updateParams("arrondissement", v)}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}

      {!loading && missions.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          Aucune mission ne correspond a tes filtres.
        </p>
      )}
    </>
  )
}

function FeedFallback() {
  return (
    <>
      <div className="space-y-3">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-56 rounded-lg" />
        ))}
      </div>
    </>
  )
}

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Missions disponibles</h2>
      <Suspense fallback={<FeedFallback />}>
        <FeedContent />
      </Suspense>
    </div>
  )
}
