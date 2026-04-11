import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MapPin, Globe, Clock } from "lucide-react"
import { formatArrondissement, formatDuration } from "@/lib/utils"
import Link from "next/link"

const mockAssociation = {
  name: "Les Restos du Coeur",
  slug: "restos-du-coeur-paris",
  description:
    "Les Restos du Coeur est une association loi de 1901, reconnue d'utilite publique, qui a pour but d'aider et d'apporter une assistance benevole aux personnes demunies, notamment dans le domaine alimentaire.",
  category: "aide_personne",
  arrondissement: 11,
  address: "42 rue du Faubourg Saint-Antoine, 75011 Paris",
  humanValidated: true,
  website: "https://www.restosducoeur.org",
  missions: [
    {
      id: "1",
      title: "Distribution de repas chauds",
      durationMin: 120,
      category: "aide_personne",
    },
    {
      id: "2",
      title: "Tri de vetements solidaires",
      durationMin: 90,
      category: "aide_personne",
    },
  ],
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${mockAssociation.name} — Association partenaire`,
    description: `Decouvrez ${mockAssociation.name} et ses missions de benevolat a Paris ${formatArrondissement(mockAssociation.arrondissement)}.`,
    openGraph: {
      title: mockAssociation.name,
      description: mockAssociation.description,
      url: `/associations/${slug}`,
    },
  }
}

export default async function AssociationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await params

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <span className="text-2xl font-bold">
              {mockAssociation.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{mockAssociation.name}</h1>
              {mockAssociation.humanValidated && (
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {formatArrondissement(mockAssociation.arrondissement)}
              </span>
              <Badge variant="secondary">{mockAssociation.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="mb-3 text-lg font-semibold">A propos</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {mockAssociation.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {mockAssociation.address}
            </span>
            {mockAssociation.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {mockAssociation.website}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Missions */}
      <h2 className="mb-4 text-lg font-semibold">
        Missions disponibles ({mockAssociation.missions.length})
      </h2>
      <div className="space-y-3">
        {mockAssociation.missions.map((mission) => (
          <Link key={mission.id} href={`/mission/${mission.id}`}>
            <Card className="transition-all hover:shadow-[var(--shadow-warm)]">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-medium">{mission.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDuration(mission.durationMin)}
                    <Badge variant="outline" className="text-xs">
                      {mission.category}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Voir la mission
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
