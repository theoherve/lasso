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
