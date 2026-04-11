import Link from "next/link"
import { Clock, MapPin, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDuration, formatDate, formatArrondissement } from "@/lib/utils"

interface MissionCardProps {
  mission: {
    id: string
    title: string
    category: string
    durationMin: number
    address?: string | null
    association?: {
      name: string
      logoUrl?: string | null
      arrondissement: number
    }
    nextSlot?: {
      startsAt: Date | string
      spotsRemaining: number
    } | null
  }
  showAssociation?: boolean
  compact?: boolean
}

export function MissionCard({
  mission,
  showAssociation = true,
  compact = false,
}: MissionCardProps) {
  return (
    <Link href={`/mission/${mission.id}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-200 hover:-translate-y-0.5",
          "hover:shadow-[var(--shadow-warm-lg)]",
        )}
      >
        {!compact && (
          <div className="relative h-32 bg-gradient-to-br from-primary/80 to-secondary/60">
            <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground">
              {formatDuration(mission.durationMin)}
            </Badge>
            {showAssociation && mission.association && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-xs font-bold text-primary shadow-sm">
                  {mission.association.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-primary-foreground drop-shadow-sm">
                  {mission.association.name}
                </span>
              </div>
            )}
          </div>
        )}

        <CardContent className={cn("space-y-2", compact ? "p-3" : "p-4")}>
          <h3 className={cn("font-semibold leading-tight", compact ? "text-sm" : "text-base")}>
            {mission.title}
          </h3>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {mission.category}
            </Badge>
            {mission.association && (
              <Badge variant="outline" className="text-xs">
                <MapPin className="mr-1 h-3 w-3" />
                {formatArrondissement(mission.association.arrondissement)}
              </Badge>
            )}
          </div>

          {mission.nextSlot && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(
                  typeof mission.nextSlot.startsAt === "string"
                    ? new Date(mission.nextSlot.startsAt)
                    : mission.nextSlot.startsAt,
                )}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {mission.nextSlot.spotsRemaining} place
                {mission.nextSlot.spotsRemaining > 1 ? "s" : ""}
              </span>
            </div>
          )}

          {compact && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDuration(mission.durationMin)}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
