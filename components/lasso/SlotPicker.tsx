"use client"

import { cn, formatDate, formatTime } from "@/lib/utils"
import { Users, CalendarDays, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Slot {
  id: string
  startsAt: Date | string
  endsAt: Date | string
  spotsRemaining: number
  spotsTotal: number
  status: string
}

interface SlotPickerProps {
  slots: Slot[]
  selectedId?: string | null
  onSelect?: (slotId: string) => void
}

export function SlotPicker({ slots, selectedId, onSelect }: SlotPickerProps) {
  return (
    <div className="space-y-3">
      {slots.map((slot) => {
        const startsAt =
          typeof slot.startsAt === "string" ? new Date(slot.startsAt) : slot.startsAt
        const endsAt =
          typeof slot.endsAt === "string" ? new Date(slot.endsAt) : slot.endsAt
        const isDisabled = slot.status === "FULL" || slot.status === "CANCELLED"
        const isSelected = selectedId === slot.id
        const isUrgent = slot.spotsRemaining > 0 && slot.spotsRemaining <= 2

        return (
          <button
            key={slot.id}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelect?.(slot.id)}
            className={cn(
              "w-full cursor-pointer text-left",
              isDisabled && "cursor-not-allowed",
            )}
          >
            <Card
              className={cn(
                "transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:border-primary/50 hover:bg-accent",
                isDisabled && "opacity-50",
              )}
            >
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold capitalize">
                      {formatDate(startsAt)}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(startsAt)} - {formatTime(endsAt)}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium",
                    isUrgent
                      ? "text-destructive"
                      : slot.spotsRemaining <= 3
                        ? "text-amber-600"
                        : "text-muted-foreground",
                  )}
                >
                  <Users className="h-4 w-4" />
                  <span>
                    {slot.spotsRemaining} place
                    {slot.spotsRemaining > 1 ? "s" : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          </button>
        )
      })}
      {slots.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Aucun creneau disponible pour le moment.
        </p>
      )}
    </div>
  )
}
