import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, MapPin } from "lucide-react"
import { formatArrondissement } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Associations partenaires",
  description: "Decouvrez les associations parisiennes partenaires de Lasso.",
}

const mockAssociations = [
  {
    slug: "restos-du-coeur-paris",
    name: "Les Restos du Coeur",
    category: "aide_personne",
    arrondissement: 11,
    humanValidated: true,
    description: "Distribution de repas et aide alimentaire pour les plus demunis.",
    missionsCount: 5,
  },
  {
    slug: "emmaus-solidarite",
    name: "Emmaus Solidarite",
    category: "aide_personne",
    arrondissement: 18,
    humanValidated: true,
    description: "Hebergement, insertion et accompagnement social.",
    missionsCount: 3,
  },
  {
    slug: "secours-populaire-paris",
    name: "Secours Populaire Paris",
    category: "aide_personne",
    arrondissement: 3,
    humanValidated: true,
    description: "Solidarite contre la pauvrete et l'exclusion.",
    missionsCount: 4,
  },
]

export default function AssociationsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Associations partenaires</h1>
      <p className="mb-8 text-muted-foreground">
        Decouvrez les associations parisiennes qui comptent sur vous.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {mockAssociations.map((asso) => (
          <Link key={asso.slug} href={`/associations/${asso.slug}`}>
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm-lg)]">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <span className="text-sm font-bold">{asso.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-semibold">{asso.name}</h2>
                      {asso.humanValidated && (
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {formatArrondissement(asso.arrondissement)}
                    </div>
                  </div>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  {asso.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{asso.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {asso.missionsCount} mission{asso.missionsCount > 1 ? "s" : ""} actives
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
