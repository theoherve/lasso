"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Map, { Marker, Popup } from "react-map-gl/mapbox"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/utils"
import Link from "next/link"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapMission {
  id: string
  title: string
  category: string
  durationMin: number
  lat: number | null
  lng: number | null
  association: {
    name: string
    arrondissement: number
  }
  nextSlot: {
    startsAt: string
    spotsRemaining: number
  } | null
}

interface MissionMapProps {
  missions: MapMission[]
  className?: string
}

const PARIS_CENTER = { latitude: 48.8566, longitude: 2.3522 }

export function MissionMap({ missions, className }: MissionMapProps) {
  const [selected, setSelected] = useState<MapMission | null>(null)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  const geoMissions = missions.filter((m) => m.lat != null && m.lng != null)

  if (!token) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-accent ${className}`}>
        <p className="text-sm text-muted-foreground">
          Configurez NEXT_PUBLIC_MAPBOX_TOKEN pour activer la carte
        </p>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          ...PARIS_CENTER,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        {geoMissions.map((mission) => (
          <Marker
            key={mission.id}
            latitude={mission.lat!}
            longitude={mission.lng!}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setSelected(mission)
            }}
          >
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110">
              <MapPin className="h-4 w-4" />
            </div>
          </Marker>
        ))}

        {selected && selected.lat && selected.lng && (
          <Popup
            latitude={selected.lat}
            longitude={selected.lng}
            anchor="bottom"
            offset={32}
            onClose={() => setSelected(null)}
            closeOnClick={false}
            className="[&_.mapboxgl-popup-content]:rounded-lg [&_.mapboxgl-popup-content]:p-0 [&_.mapboxgl-popup-content]:shadow-lg"
          >
            <div className="w-56 p-3">
              <h3 className="mb-1 text-sm font-semibold leading-tight">
                {selected.title}
              </h3>
              <p className="mb-2 text-xs text-muted-foreground">
                {selected.association.name}
              </p>
              <div className="mb-3 flex gap-1.5">
                <Badge variant="secondary" className="text-xs">
                  {selected.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formatDuration(selected.durationMin)}
                </Badge>
              </div>
              {selected.nextSlot && (
                <p className="mb-2 text-xs text-muted-foreground">
                  {selected.nextSlot.spotsRemaining} place
                  {selected.nextSlot.spotsRemaining > 1 ? "s" : ""} disponible
                  {selected.nextSlot.spotsRemaining > 1 ? "s" : ""}
                </p>
              )}
              <Button size="sm" className="w-full text-xs" render={<Link href={`/mission/${selected.id}`} />}>
                Voir la mission
              </Button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
