import { Inbox, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  title = "Rien a afficher",
  description = "Aucune mission pour l'instant — revenez bientot !",
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && action.href ? (
        <a href={action.href}>
          <Button className="mt-6">{action.label}</Button>
        </a>
      ) : action ? (
        <Button className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}
