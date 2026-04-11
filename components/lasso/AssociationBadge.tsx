import { CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AssociationBadgeProps {
  association: {
    name: string
    logoUrl?: string | null
    humanValidated?: boolean
  }
  size?: "sm" | "md" | "lg"
  showVerified?: boolean
}

export function AssociationBadge({
  association,
  size = "md",
  showVerified = true,
}: AssociationBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar
        className={cn(
          size === "sm" && "h-6 w-6",
          size === "md" && "h-8 w-8",
          size === "lg" && "h-10 w-10",
        )}
      >
        {association.logoUrl && <AvatarImage src={association.logoUrl} alt={association.name} />}
        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
          {association.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "font-medium",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base",
        )}
      >
        {association.name}
      </span>
      {showVerified && association.humanValidated && (
        <CheckCircle2 className="h-4 w-4 text-secondary" />
      )}
    </div>
  )
}
