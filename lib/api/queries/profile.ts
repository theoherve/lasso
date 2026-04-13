import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"

export interface UserProfile {
  id: string
  firstName: string | null
  name: string | null
  email: string
  arrondissement: number | null
  avatarUrl: string | null
  bio: string | null
  reliabilityScore: number
  _count?: { bookings: number }
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

export interface BadgesResponse {
  badges: Badge[]
  stats: { missionsCompleted: number; totalHours: number }
}

export const profileKeys = {
  me: ["profile", "me"] as const,
  myBadges: ["profile", "me", "badges"] as const,
}

export function useMe() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: () => api.get<UserProfile>("/api/users/me"),
  })
}

export function useMyBadges() {
  return useQuery({
    queryKey: profileKeys.myBadges,
    queryFn: () => api.get<BadgesResponse>("/api/users/me/badges"),
  })
}

export interface UpdateMeInput {
  firstName?: string
  name?: string
  bio?: string
  arrondissement?: number
}

export function useUpdateMe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateMeInput) =>
      api.patch<UserProfile>("/api/users/me", input),
    onSuccess: (updated) => {
      queryClient.setQueryData(profileKeys.me, updated)
    },
  })
}
