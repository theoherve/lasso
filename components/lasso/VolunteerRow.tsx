import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { ReliabilityScore } from "@/components/lasso/ReliabilityScore"

interface VolunteerRowProps {
  user: {
    id: string
    firstName?: string | null
    name?: string | null
    avatarUrl?: string | null
    reliabilityScore: number
  }
  booking: {
    status: string
  }
}

export function VolunteerRow({ user, booking }: VolunteerRowProps) {
  const displayName = user.firstName ?? user.name ?? "Benevole"

  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={displayName} />}
          <AvatarFallback className="text-xs">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{displayName}</p>
          <ReliabilityScore score={user.reliabilityScore} size="sm" />
        </div>
      </div>
      <StatusBadge status={booking.status} />
    </div>
  )
}
