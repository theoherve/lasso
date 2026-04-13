import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"

export interface BookingItem {
  id: string
  status: string
  rating: { id: string; score: number } | null
  slot: {
    startsAt: string
    endsAt: string
    mission: {
      id: string
      title: string
      durationMin: number
      association: {
        name: string
        arrondissement: number
      }
    }
  }
}

export const bookingKeys = {
  all: ["bookings"] as const,
  myBookings: (period: "upcoming" | "past") =>
    [...bookingKeys.all, "me", period] as const,
}

export function useMyBookings(period: "upcoming" | "past") {
  return useQuery({
    queryKey: bookingKeys.myBookings(period),
    queryFn: () =>
      api.get<BookingItem[]>("/api/users/me/bookings", {
        searchParams: { period },
      }),
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingId: string) =>
      api.delete<{ success: true }>(`/api/bookings/${bookingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}

export function useRateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, score }: { bookingId: string; score: number }) =>
      api.post<{ id: string; score: number }>("/api/ratings", {
        bookingId,
        score,
      }),
    onSuccess: (_data, { bookingId, score }) => {
      queryClient.setQueriesData<BookingItem[]>(
        { queryKey: bookingKeys.all },
        (prev) =>
          prev?.map((b) =>
            b.id === bookingId ? { ...b, rating: { id: "new", score } } : b,
          ),
      )
    },
  })
}
