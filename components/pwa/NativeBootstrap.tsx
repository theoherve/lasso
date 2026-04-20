"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getPlatform, isNative } from "@/lib/platform"

type PluginListener = { remove: () => Promise<void> }

export function NativeBootstrap() {
  const router = useRouter()

  useEffect(() => {
    if (!isNative()) return

    let appUrlListener: PluginListener | null = null
    let backListener: PluginListener | null = null
    let cancelled = false

    void (async () => {
      const [{ SplashScreen }, { StatusBar, Style }, { App }] = await Promise.all([
        import("@capacitor/splash-screen"),
        import("@capacitor/status-bar"),
        import("@capacitor/app"),
      ])

      if (cancelled) return

      try {
        await StatusBar.setStyle({ style: Style.Default })
        if (getPlatform() === "android") {
          await StatusBar.setBackgroundColor({ color: "#F3EDE2" })
          await StatusBar.setOverlaysWebView({ overlay: false })
        }
      } catch {}

      try {
        await SplashScreen.hide({ fadeOutDuration: 200 })
      } catch {}

      appUrlListener = await App.addListener("appUrlOpen", (event) => {
        try {
          const url = new URL(event.url)
          const target = `${url.pathname}${url.search}${url.hash}` || "/"
          router.push(target)
        } catch {}
      })

      backListener = await App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back()
        } else {
          App.exitApp().catch(() => {})
        }
      })
    })()

    return () => {
      cancelled = true
      appUrlListener?.remove().catch(() => {})
      backListener?.remove().catch(() => {})
    }
  }, [router])

  return null
}
