type CapacitorGlobal = {
  isNativePlatform?: () => boolean
  getPlatform?: () => "ios" | "android" | "web"
}

function getCapacitor(): CapacitorGlobal | undefined {
  if (typeof window === "undefined") return undefined
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor
}

export function isNative(): boolean {
  return getCapacitor()?.isNativePlatform?.() === true
}

export function getPlatform(): "ios" | "android" | "web" {
  return getCapacitor()?.getPlatform?.() ?? "web"
}

export function isNativeIOS(): boolean {
  return getPlatform() === "ios"
}

export function isNativeAndroid(): boolean {
  return getPlatform() === "android"
}

/* ------------------------------------------------------------------ */
/* Storage — Preferences (native) with localStorage fallback (web)    */
/* ------------------------------------------------------------------ */

export const storage = {
  async get(key: string): Promise<string | null> {
    if (isNative()) {
      const { Preferences } = await import("@capacitor/preferences")
      const { value } = await Preferences.get({ key })
      return value ?? null
    }
    if (typeof window === "undefined") return null
    return window.localStorage.getItem(key)
  },
  async set(key: string, value: string): Promise<void> {
    if (isNative()) {
      const { Preferences } = await import("@capacitor/preferences")
      await Preferences.set({ key, value })
      return
    }
    if (typeof window === "undefined") return
    window.localStorage.setItem(key, value)
  },
  async remove(key: string): Promise<void> {
    if (isNative()) {
      const { Preferences } = await import("@capacitor/preferences")
      await Preferences.remove({ key })
      return
    }
    if (typeof window === "undefined") return
    window.localStorage.removeItem(key)
  },
}

/* ------------------------------------------------------------------ */
/* Haptics — no-op on web                                             */
/* ------------------------------------------------------------------ */

type HapticsImpact = "light" | "medium" | "heavy"
type HapticsNotification = "success" | "warning" | "error"

export const haptics = {
  async impact(style: HapticsImpact = "medium"): Promise<void> {
    if (!isNative()) return
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics")
    const map = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy }
    try {
      await Haptics.impact({ style: map[style] })
    } catch {}
  },
  async notification(type: HapticsNotification = "success"): Promise<void> {
    if (!isNative()) return
    const { Haptics, NotificationType } = await import("@capacitor/haptics")
    const map = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    }
    try {
      await Haptics.notification({ type: map[type] })
    } catch {}
  },
  async selection(): Promise<void> {
    if (!isNative()) return
    const { Haptics } = await import("@capacitor/haptics")
    try {
      await Haptics.selectionStart()
      await Haptics.selectionChanged()
      await Haptics.selectionEnd()
    } catch {}
  },
}

/* ------------------------------------------------------------------ */
/* Share — native share sheet, clipboard fallback on web              */
/* ------------------------------------------------------------------ */

type ShareOptions = { title?: string; text?: string; url?: string; dialogTitle?: string }

export async function share(options: ShareOptions): Promise<boolean> {
  if (isNative()) {
    const { Share } = await import("@capacitor/share")
    try {
      const { value } = await Share.canShare()
      if (!value) return false
      await Share.share(options)
      return true
    } catch {
      return false
    }
  }
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share(options)
      return true
    } catch {
      return false
    }
  }
  return false
}

/* ------------------------------------------------------------------ */
/* Browser — open external URLs (OAuth flows, marketing links)        */
/* ------------------------------------------------------------------ */

export async function openBrowser(url: string): Promise<void> {
  if (isNative()) {
    const { Browser } = await import("@capacitor/browser")
    await Browser.open({ url, presentationStyle: "popover" })
    return
  }
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer")
  }
}
