/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { Serwist, NetworkFirst, CacheFirst, ExpirationPlugin } from "serwist"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const FALLBACK_OFFLINE_URL = "/~offline"

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  fallbacks: {
    entries: [
      {
        url: FALLBACK_OFFLINE_URL,
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
  runtimeCaching: [
    // --- Custom rules MUST come before defaultCache ---

    // Never cache auth flows, mutation APIs, Sentry tunnel, or auth session polls.
    // Serwist's default behavior (no match) = pass-through to network.
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/api/auth") ||
        url.pathname.startsWith("/monitoring") ||
        url.pathname === "/api/notifications",
      handler: new NetworkFirst({
        cacheName: "lasso-no-cache-passthrough",
        networkTimeoutSeconds: 10,
      }),
      method: "GET",
    },

    // GET /api/* — network-first with short cache, so offline shows last-known data.
    {
      matcher: ({ url, request }) =>
        request.method === "GET" && url.pathname.startsWith("/api/"),
      handler: new NetworkFirst({
        cacheName: "lasso-api",
        networkTimeoutSeconds: 6,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 120,
            maxAgeSeconds: 60 * 60 * 24, // 24h
          }),
        ],
      }),
      method: "GET",
    },

    // Static app icons & logo — cache-first, long-lived.
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/icons/") ||
        url.pathname === "/logo.svg" ||
        url.pathname === "/icon.svg",
      handler: new CacheFirst({
        cacheName: "lasso-static-icons",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 40,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30d
          }),
        ],
      }),
      method: "GET",
    },

    // Mapbox tiles — cache-first but capped to avoid blowing up storage.
    {
      matcher: ({ url }) =>
        url.hostname.endsWith("mapbox.com") || url.hostname.endsWith("tiles.mapbox.com"),
      handler: new CacheFirst({
        cacheName: "lasso-mapbox-tiles",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7d
            purgeOnQuotaError: true,
          }),
        ],
      }),
      method: "GET",
    },

    // Fallback to Serwist's defaults for Next.js assets (JS/CSS bundles, fonts, images).
    ...defaultCache,
  ],
})

serwist.addEventListeners()
