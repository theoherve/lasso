"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { nativeSignIn } from "@/lib/native-auth"

const appleEnabled = process.env.NEXT_PUBLIC_APPLE_AUTH_ENABLED === "true"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Email ou mot de passe incorrect")
      return
    }

    router.push("/feed")
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold">Connexion</h2>
          <p className="text-sm text-muted-foreground">
            Content de te revoir !
          </p>
        </div>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ton@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">
            Ou continuer avec
          </span>
          <Separator className="flex-1" />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => nativeSignIn("google", { callbackUrl: "/feed" })}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        {appleEnabled && (
          <Button
            variant="outline"
            className="w-full bg-black text-white hover:bg-black/90 hover:text-white"
            onClick={() => nativeSignIn("apple", { callbackUrl: "/feed" })}
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.05 12.536c-.03-3.015 2.46-4.463 2.573-4.534-1.403-2.05-3.587-2.33-4.366-2.362-1.855-.188-3.622 1.09-4.562 1.09-.94 0-2.39-1.063-3.934-1.032-2.022.029-3.89 1.177-4.93 2.986-2.103 3.645-.537 9.04 1.505 12.003 1 1.45 2.185 3.073 3.743 3.015 1.506-.06 2.074-.975 3.892-.975 1.82 0 2.33.975 3.924.946 1.62-.029 2.646-1.472 3.633-2.93 1.148-1.68 1.62-3.31 1.648-3.395-.036-.014-3.16-1.213-3.192-4.812zm-3.02-8.836c.833-1.012 1.395-2.417 1.242-3.822-1.2.048-2.658.8-3.52 1.813-.772.896-1.447 2.33-1.266 3.707 1.34.104 2.71-.68 3.544-1.698z" />
            </svg>
            Continuer avec Apple
          </Button>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Creer un compte
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
