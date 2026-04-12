"use client"

import { useEffect, useState } from "react"
import { MissionMap } from "@/components/lasso/MissionMap"
import { Skeleton } from "@/components/ui/skeleton"

export default function MapPage() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/missions")
      .then((r) => r.json())
      .then(setMissions)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Carte des missions</h2>
      {loading ? (
        <Skeleton className="h-[calc(100vh-12rem)] rounded-lg" />
      ) : (
        <MissionMap
          missions={missions}
          className="h-[calc(100vh-12rem)]"
        />
      )}
    </div>
  )
}
