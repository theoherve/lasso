import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"

export interface AdminUser {
  id: string
  email: string
  name: string | null
  firstName: string | null
  roles: string[]
  reliabilityScore: number
  noShowCount: number
  createdAt: string
}

export interface AdminMission {
  id: string
  title: string
  status: string
  category: string
  createdAt: string
  association: { name: string }
  _count: { slots: number }
}

export interface AdminAssociation {
  id: string
  name: string
  slug: string
  rnaNumber: string | null
  rnaVerified: boolean
  humanValidated: boolean
  arrondissement: number
  createdAt: string
  _count: { missions: number; members: number }
}

export interface AdminNoShowReport {
  id: string
  note: string | null
  createdAt: string
  booking: {
    user: { firstName: string | null; name: string | null }
    slot: {
      startsAt: string
      mission: { title: string }
    }
  }
}

export const adminKeys = {
  all: ["admin"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  missions: () => [...adminKeys.all, "missions"] as const,
  associations: () => [...adminKeys.all, "associations"] as const,
  noShows: () => [...adminKeys.all, "no-shows"] as const,
}

// Users

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: () => api.get<AdminUser[]>("/api/admin/users"),
  })
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      api.patch<AdminUser>("/api/admin/users", { userId, roles }),
    onSuccess: (updated) => {
      queryClient.setQueryData<AdminUser[]>(adminKeys.users(), (prev) =>
        prev?.map((u) =>
          u.id === updated.id ? { ...u, roles: updated.roles } : u,
        ),
      )
    },
  })
}

// Missions

export function useAdminMissions() {
  return useQuery({
    queryKey: adminKeys.missions(),
    queryFn: () => api.get<AdminMission[]>("/api/admin/missions"),
  })
}

export function useUpdateMissionStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch<AdminMission>("/api/admin/missions", { id, status }),
    onSuccess: (_data, { id, status }) => {
      queryClient.setQueryData<AdminMission[]>(adminKeys.missions(), (prev) =>
        prev?.map((m) => (m.id === id ? { ...m, status } : m)),
      )
    },
  })
}

// Associations

export function useAdminAssociations() {
  return useQuery({
    queryKey: adminKeys.associations(),
    queryFn: () => api.get<AdminAssociation[]>("/api/admin/associations"),
  })
}

export function useValidateAssociation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      humanValidated,
    }: {
      id: string
      humanValidated: boolean
    }) =>
      api.patch<AdminAssociation>("/api/admin/associations", {
        id,
        humanValidated,
      }),
    onSuccess: (_data, { id, humanValidated }) => {
      queryClient.setQueryData<AdminAssociation[]>(
        adminKeys.associations(),
        (prev) =>
          prev?.map((a) => (a.id === id ? { ...a, humanValidated } : a)),
      )
    },
  })
}

// No-shows

export function useAdminNoShows() {
  return useQuery({
    queryKey: adminKeys.noShows(),
    queryFn: () => api.get<AdminNoShowReport[]>("/api/admin/no-shows"),
  })
}
