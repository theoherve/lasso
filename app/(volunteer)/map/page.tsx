"use client"

import { MissionMap } from "@/components/lasso/MissionMap"
import { Skeleton } from "@/components/ui/skeleton"
import { useMissions } from "@/lib/api/queries/missions"

export default function MapPage() {
  const { data: missions = [], isLoading: loading } = useMissions()

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
