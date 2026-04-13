import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import { bookingKeys } from "@/lib/api/queries/bookings"

export interface MissionListItem {
  id: string
  title: string
  category: string
  durationMin: number
  address: string | null
  lat: number | null
  lng: number | null
  association: {
    name: string
    slug: string
    logoUrl: string | null
    arrondissement: number
  }
  nextSlot: {
    startsAt: string
    spotsRemaining: number
  } | null
}

export interface Slot {
  id: string
  startsAt: string
  endsAt: string
  spotsRemaining: number
  spotsTotal: number
  status: string
}

export interface MissionDetail {
  id: string
  title: string
  category: string
  description: string
  durationMin: number
  address: string | null
  association: {
    name: string
    slug: string
    logoUrl: string | null
    arrondissement: number
    humanValidated: boolean
    avgRating: number | null
    _count?: { missions: number }
  }
  slots: Slot[]
}

export interface MissionFilters {
  category?: string[]
  arrondissement?: string[]
  search?: string
}

export const missionKeys = {
  all: ["missions"] as const,
  lists: () => [...missionKeys.all, "list"] as const,
  list: (filters: MissionFilters) => [...missionKeys.lists(), filters] as const,
  details: () => [...missionKeys.all, "detail"] as const,
  detail: (id: string) => [...missionKeys.details(), id] as const,
  slots: (missionId: string) =>
    [...missionKeys.all, "slots", missionId] as const,
}

function missionsSearchParams(filters: MissionFilters) {
  const params: Record<string, string> = {}
  if (filters.category?.length) params.category = filters.category.join(",")
  if (filters.arrondissement?.length)
    params.arrondissement = filters.arrondissement.join(",")
  if (filters.search) params.search = filters.search
  return params
}

export function useMissions(filters: MissionFilters = {}) {
  return useQuery({
    queryKey: missionKeys.list(filters),
    queryFn: () =>
      api.get<MissionListItem[]>("/api/missions", {
        searchParams: missionsSearchParams(filters),
      }),
  })
}

export function useMission(id: string) {
  return useQuery({
    queryKey: missionKeys.detail(id),
    queryFn: () => api.get<MissionDetail>(`/api/missions/${id}`),
    enabled: !!id,
  })
}

export function useMissionSlots(missionId: string) {
  return useQuery({
    queryKey: missionKeys.slots(missionId),
    queryFn: () => api.get<Slot[]>(`/api/missions/${missionId}/slots`),
    enabled: !!missionId,
  })
}

export function useBookSlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slotId: string) =>
      api.post<{ id: string }>("/api/bookings", { slotId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionKeys.all })
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}

export interface CreateMissionInput {
  title: string
  description: string
  category: string
  address?: string
  durationMin: number
  maxVolunteers: number
}

export function useCreateMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateMissionInput) =>
      api.post<{ id: string }>("/api/missions", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionKeys.all })
    },
  })
}

export interface CreateSlotInput {
  startsAt: string // ISO
  endsAt: string // ISO
  spotsTotal: number
}

export function useCreateSlot(missionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateSlotInput) =>
      api.post<Slot>(`/api/missions/${missionId}/slots`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: missionKeys.slots(missionId),
      })
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(missionId) })
    },
  })
}
