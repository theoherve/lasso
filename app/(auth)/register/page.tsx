"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const arrondissements = Array.from({ length: 20 }, (_, i) => i + 1)

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [arrondissement, setArrondissement] = useState<string>("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string
    const firstName = form.get("firstName") as string

    const body: Record<string, unknown> = { email, password, firstName }
    if (arrondissement) body.arrondissement = Number(arrondissement)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Erreur lors de la creation du compte")
        setLoading(false)
        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        router.push("/login")
        return
      }

      router.push("/feed")
      router.refresh()
    } catch {
      setError("Erreur reseau")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold">Inscription</h2>
          <p className="text-sm text-muted-foreground">
            Rejoins la communaute des benevoles parisiens
          </p>
        </div>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="firstName">Prenom</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Ton prenom"
              required
              minLength={2}
            />
          </div>

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
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="8 caracteres minimum"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrondissement">Arrondissement</Label>
            <Select value={arrondissement} onValueChange={(v) => setArrondissement(v ?? "")}>
              <SelectTrigger id="arrondissement" className="w-full">
                <SelectValue placeholder="Ton arrondissement" />
              </SelectTrigger>
              <SelectContent>
                {arrondissements.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n === 1 ? "1er" : `${n}e`} arrondissement
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            C&apos;est parti !
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Deja un compte ?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
