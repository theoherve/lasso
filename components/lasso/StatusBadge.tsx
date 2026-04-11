import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirme",
  CANCELLED: "Annule",
  COMPLETED: "Termine",
  NO_SHOW: "Absent\u00b7e",
  OPEN: "Ouvert",
  FULL: "Complet",
  PENDING: "En attente",
  ACTIVE: "Actif",
}

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        CONFIRMED: "bg-[var(--status-confirmed-bg)] text-[var(--status-confirmed)]",
        CANCELLED: "bg-[var(--status-noshow-bg)] text-[var(--status-noshow)]",
        COMPLETED: "bg-[var(--status-completed-bg)] text-[var(--status-completed)]",
        NO_SHOW: "bg-[var(--status-noshow-bg)] text-[var(--status-noshow)]",
        OPEN: "bg-[var(--status-open-bg)] text-[var(--status-open)]",
        FULL: "bg-[var(--status-full-bg)] text-[var(--status-full)]",
        PENDING: "bg-[var(--status-pending-bg)] text-[var(--status-pending)]",
        ACTIVE: "bg-[var(--status-confirmed-bg)] text-[var(--status-confirmed)]",
      },
    },
    defaultVariants: {
      status: "OPEN",
    },
  },
)

type StatusKey = "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "OPEN" | "FULL" | "PENDING" | "ACTIVE"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const validStatus = status as StatusKey
  return (
    <span
      className={cn(
        statusBadgeVariants({ status: validStatus }),
        className,
      )}
    >
      {statusLabels[validStatus] ?? status}
    </span>
  )
}
