import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReliabilityScoreProps {
  score: number
  size?: "sm" | "md"
}

export function ReliabilityScore({ score, size = "md" }: ReliabilityScoreProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 font-bold text-primary",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
      )}
    >
      <Star
        className={cn("fill-current", size === "sm" ? "h-3 w-3" : "h-4 w-4")}
      />
      {score.toFixed(1)}
    </span>
  )
}
