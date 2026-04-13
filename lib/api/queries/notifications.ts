import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
}

/**
 * Notifications are polled every 30 s while the tab is visible.
 * The SW pass-through rule for /api/notifications ensures they are never
 * served stale from the SW cache.
 */
export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => api.get<NotificationsResponse>("/api/notifications"),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.patch("/api/notifications", { all: true }),
    onSuccess: () => {
      queryClient.setQueryData<NotificationsResponse>(
        notificationKeys.list(),
        (prev) =>
          prev
            ? {
                notifications: prev.notifications.map((n) => ({
                  ...n,
                  read: true,
                })),
                unreadCount: 0,
              }
            : prev,
      )
    },
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch("/api/notifications", { ids: [id] }),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<NotificationsResponse>(
        notificationKeys.list(),
        (prev) => {
          if (!prev) return prev
          const wasUnread = prev.notifications.some(
            (n) => n.id === id && !n.read,
          )
          return {
            notifications: prev.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n,
            ),
            unreadCount: wasUnread
              ? Math.max(0, prev.unreadCount - 1)
              : prev.unreadCount,
          }
        },
      )
    },
  })
}
