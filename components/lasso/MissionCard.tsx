import Link from "next/link"
import { Clock, MapPin, Users, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CategoryIcon } from "@/components/lasso/CategoryIcon"
import {
  cn,
  formatDuration,
  formatDate,
  formatArrondissement,
  getCategoryLabel,
} from "@/lib/utils"

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
  const spotsRemaining = mission.nextSlot?.spotsRemaining ?? 0
  const isUrgent = spotsRemaining > 0 && spotsRemaining <= 2

  return (
    <Link href={`/mission/${mission.id}`} className="group cursor-pointer">
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-200",
          "hover:-translate-y-0.5 hover:shadow-(--shadow-warm-lg)",
        )}
      >
        <CardContent className="flex h-full flex-col gap-3">
          {/* Top row: icon + title + duration */}
          <div className="flex items-start gap-3">
            <CategoryIcon category={mission.category} size={compact ? "sm" : "md"} />
            <div className="min-w-0 flex-1">
              <h3 className={cn("font-semibold leading-tight", compact ? "text-sm" : "text-base")}>
                {mission.title}
              </h3>
              {showAssociation && mission.association && (
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {mission.association.name}
                </p>
              )}
            </div>
            <Badge className="shrink-0 bg-primary/10 text-primary hover:bg-primary/10">
              <Clock className="mr-1 h-3 w-3" />
              {formatDuration(mission.durationMin)}
            </Badge>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {getCategoryLabel(mission.category)}
            </Badge>
            {mission.association && (
              <Badge variant="outline" className="text-xs">
                <MapPin className="mr-1 h-3 w-3" />
                {formatArrondissement(mission.association.arrondissement)}
              </Badge>
            )}
          </div>

          {/* Bottom row: next slot + spots — pushed to bottom */}
          <div className="mt-auto flex items-center justify-between border-t border-border pt-2.5 text-sm">
            {mission.nextSlot ? (
              <>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Prochain creneau : {formatDate(
                    typeof mission.nextSlot.startsAt === "string"
                      ? new Date(mission.nextSlot.startsAt)
                      : mission.nextSlot.startsAt,
                  )}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 font-medium",
                    isUrgent ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                  {spotsRemaining} place{spotsRemaining > 1 ? "s" : ""}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">Aucun creneau a venir</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
