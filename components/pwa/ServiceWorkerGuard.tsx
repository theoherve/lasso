"use client"

import { useEffect } from "react"
import { getPlatform, isNative } from "@/lib/platform"

export function ServiceWorkerGuard() {
  useEffect(() => {
    if (!isNative()) return

    const html = document.documentElement
    html.classList.add("capacitor-native", `capacitor-${getPlatform()}`)

    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((r) => r.unregister())))
        .then(() => {
          if (typeof caches !== "undefined") {
            return caches
              .keys()
              .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
          }
        })
        .catch(() => {})
    }
  }, [])

  return null
}
