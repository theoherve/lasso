import { HandHeart, Leaf, GraduationCap, Package, Sparkles, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  aide_personne: HandHeart,
  environnement: Leaf,
  education: GraduationCap,
  logistique: Package,
  autre: Sparkles,
}

interface CategoryIconProps {
  category: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-14 w-14 rounded-2xl",
}

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
}

export function CategoryIcon({ category, size = "md", className }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[category] ?? Sparkles

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-primary/10",
        sizeClasses[size],
        className,
      )}
    >
      <Icon className={cn("text-primary", iconSizeClasses[size])} />
    </div>
  )
}
