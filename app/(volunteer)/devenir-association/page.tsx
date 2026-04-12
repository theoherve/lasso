"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Building2, CheckCircle2, Loader2 } from "lucide-react"

const arrondissements = Array.from({ length: 20 }, (_, i) => i + 1)

export default function DevenirAssociationPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [category, setCategory] = useState("")
  const [arrondissement, setArrondissement] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(e.currentTarget)

    const body: Record<string, unknown> = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      address: form.get("address") as string,
      category,
      arrondissement: Number(arrondissement),
    }

    const rna = (form.get("rnaNumber") as string)?.trim()
    if (rna) body.rnaNumber = rna

    const website = (form.get("website") as string)?.trim()
    if (website) body.website = website

    try {
      const res = await fetch("/api/associations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Erreur lors de la creation")
        return
      }

      setSuccess(true)
      // Refresh session to get the new ASSOCIATION role
      setTimeout(() => {
        router.push("/association/dashboard")
        router.refresh()
      }, 2000)
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">Association creee !</h2>
            <p className="text-sm text-muted-foreground">
              Votre association est en attente de validation par l&apos;equipe Lasso.
              Vous pouvez deja acceder a votre backoffice.
            </p>
            <p className="text-xs text-muted-foreground">
              Redirection en cours...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
            <Building2 className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Inscrire mon association</h2>
            <p className="text-sm text-muted-foreground">
              Rejoignez Lasso et publiez vos missions de bénévolat
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l&apos;association *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex : Les Restos du Cœur - Paris 11e"
                required
                minLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rnaNumber">Numéro RNA</Label>
              <Input
                id="rnaNumber"
                name="rnaNumber"
                placeholder="W123456789"
                pattern="^W\d{9}$"
              />
              <p className="text-xs text-muted-foreground">
                Optionnel. Format : W suivi de 9 chiffres. Vérifié automatiquement auprès du RNA.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                minLength={10}
                placeholder="Décrivez l'activité de votre association..."
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Categorie *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "")} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aide_personne">Aide à la personne</SelectItem>
                  <SelectItem value="environnement">Environnement</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse du siège *</Label>
              <Input
                id="address"
                name="address"
                placeholder="Ex : 42 rue du Faubourg Saint-Antoine, 75011 Paris"
                required
                minLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Arrondissement *</Label>
              <Select value={arrondissement} onValueChange={(v) => setArrondissement(v ?? "")} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un arrondissement" />
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

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://www.mon-association.org"
              />
            </div>

            <div className="rounded-lg bg-accent p-4 text-sm text-muted-foreground">
              <p>
                Après soumission, votre association sera <strong>en attente de validation</strong> par
                l&apos;équipe Lasso. Vous pourrez accéder à votre backoffice immédiatement
                pour préparer vos missions.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Inscrire mon association
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
