"use client"

import { useEffect, useState } from "react"
import { Download, Share, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "lasso-install-prompt-dismissed"
const DISMISS_DAYS = 7

function wasRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false
  const raw = window.localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  const ts = Number(raw)
  if (!Number.isFinite(ts)) return false
  return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000
}

function persistDismiss() {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    // storage unavailable — silently ignore
  }
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        // iOS Safari non-standard flag
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true,
    )
    setIsIOS(
      /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
        !(window as unknown as { MSStream?: unknown }).MSStream,
    )
    setDismissed(wasRecentlyDismissed())

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  if (isStandalone || dismissed) return null

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (outcome === "dismissed") {
      persistDismiss()
      setDismissed(true)
    }
  }

  function handleDismiss() {
    persistDismiss()
    setDismissed(true)
  }

  // Android / Chrome / Edge — native install prompt
  if (deferredPrompt) {
    return (
      <div
        role="dialog"
        aria-label="Installer Lasso"
        className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-3 rounded-xl border bg-card p-3 shadow-warm-lg md:left-auto md:right-4 md:max-w-sm"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Installer Lasso</p>
          <p className="text-xs text-muted-foreground">
            Accès direct depuis votre écran d&apos;accueil.
          </p>
        </div>
        <Button size="sm" onClick={handleInstall}>
          Installer
        </Button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer"
          className="rounded-md p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  // iOS — manual instructions (no beforeinstallprompt support)
  if (isIOS) {
    return (
      <div
        role="dialog"
        aria-label="Installer Lasso sur iOS"
        className="fixed inset-x-3 bottom-3 z-40 flex items-start gap-3 rounded-xl border bg-card p-3 shadow-warm-lg md:left-auto md:right-4 md:max-w-sm"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Share className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0 text-xs leading-relaxed">
          <p className="text-sm font-semibold">Installer Lasso</p>
          <p className="text-muted-foreground">
            Appuyez sur <Share className="inline h-3.5 w-3.5 align-text-bottom" />
            {" puis « Sur l'écran d'accueil »."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer"
          className="rounded-md p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return null
}
