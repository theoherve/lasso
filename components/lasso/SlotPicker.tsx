"use client"

import { cn, formatDateTime } from "@/lib/utils"
import { Users, Clock } from "lucide-react"

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
    <div className="space-y-2">
      {slots.map((slot) => {
        const startsAt =
          typeof slot.startsAt === "string" ? new Date(slot.startsAt) : slot.startsAt
        const isDisabled = slot.status === "FULL" || slot.status === "CANCELLED"
        const isSelected = selectedId === slot.id

        return (
          <button
            key={slot.id}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelect?.(slot.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all",
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/50 hover:bg-accent",
              isDisabled && "cursor-not-allowed opacity-50",
            )}
          >
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatDateTime(startsAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>
                {slot.spotsRemaining}/{slot.spotsTotal}
              </span>
            </div>
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
