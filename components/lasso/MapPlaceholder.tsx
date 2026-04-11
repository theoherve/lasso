import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface MapPlaceholderProps {
  height?: string
  className?: string
}

export function MapPlaceholder({ height = "h-64", className }: MapPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg bg-accent",
        height,
        className,
      )}
    >
      <MapPin className="mb-2 h-10 w-10 text-muted-foreground" />
      <p className="text-sm font-medium text-muted-foreground">
        Carte interactive — Mapbox
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Disponible prochainement</p>
    </div>
  )
}
