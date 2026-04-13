import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"

export interface AssociationVolunteerBooking {
  id: string
  status: string
  user: {
    id: string
    firstName: string | null
    name: string | null
    avatarUrl: string | null
    reliabilityScore: number
  }
}

export const associationKeys = {
  all: ["associations"] as const,
  myBookings: () => [...associationKeys.all, "me", "bookings"] as const,
}

export function useAssociationVolunteers() {
  return useQuery({
    queryKey: associationKeys.myBookings(),
    queryFn: () =>
      api.get<AssociationVolunteerBooking[]>("/api/associations/me/bookings"),
  })
}

export interface CreateAssociationInput {
  name: string
  description: string
  address: string
  category: string
  arrondissement: number
  rnaNumber?: string
  website?: string
}

export function useCreateAssociation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAssociationInput) =>
      api.post<{ id: string; slug: string }>("/api/associations", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: associationKeys.all })
    },
  })
}
