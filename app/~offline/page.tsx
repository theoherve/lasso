import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Hors ligne",
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted text-3xl">
        🌐
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Vous êtes hors ligne
        </h1>
        <p className="text-muted-foreground max-w-sm">
          Cette page n&apos;est pas disponible sans connexion. Vérifiez votre réseau,
          puis réessayez. Les pages déjà consultées restent accessibles.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/" className={buttonVariants()}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  )
}
