"use client"

import { useState, type ReactNode } from "react"
import {
  QueryClient,
  QueryClientProvider,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Serve cached data instantly, revalidate in background.
        staleTime: 60_000,
        // Keep cached data in memory (and in storage) for 24h so it survives offline sessions.
        gcTime: 1000 * 60 * 60 * 24,
        // Network-aware retry: don't keep retrying when offline.
        retry: (failureCount, error) => {
          if (typeof navigator !== "undefined" && !navigator.onLine) return false
          const status = (error as { status?: number })?.status
          if (status && status >= 400 && status < 500) return false
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new client
    return makeQueryClient()
  }
  // Browser: reuse singleton so state isn't lost between renders
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()

    const persister = createSyncStoragePersister({
      storage: window.localStorage,
      key: "lasso-query-cache",
      throttleTime: 1000,
    })

    persistQueryClient({
      queryClient: browserQueryClient,
      persister,
      maxAge: 1000 * 60 * 60 * 24, // 24h
      dehydrateOptions: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) &&
          // Do not persist auth-sensitive queries by default.
          !(query.queryKey[0] === "auth"),
      },
    })
  }
  return browserQueryClient
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  )
}
