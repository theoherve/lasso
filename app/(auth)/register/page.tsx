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

const arrondissements = Array.from({ length: 20 }, (_, i) => i + 1)

export default function RegisterPage() {
  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold">Inscription</h2>
          <p className="text-sm text-muted-foreground">
            Rejoins la communaute des benevoles parisiens
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prenom</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Ton prenom"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ton@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="8 caracteres minimum"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrondissement">Arrondissement</Label>
            <Select>
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

          <Button type="submit" className="w-full">
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
