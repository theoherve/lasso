import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MapPin, Globe, Clock } from "lucide-react"
import { formatArrondissement, formatDuration } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

async function getAssociation(slug: string) {
  return prisma.association.findUnique({
    where: { slug },
    include: {
      missions: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          durationMin: true,
          category: true,
        },
      },
    },
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const association = await getAssociation(slug)

  if (!association) {
    return { title: "Association introuvable" }
  }

  return {
    title: `${association.name} — Association partenaire`,
    description: `Decouvrez ${association.name} et ses missions de benevolat a Paris ${formatArrondissement(association.arrondissement)}.`,
    openGraph: {
      title: association.name,
      description: association.description ?? undefined,
      url: `/associations/${slug}`,
    },
  }
}

export default async function AssociationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const association = await getAssociation(slug)

  if (!association) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <span className="text-2xl font-bold">
              {association.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{association.name}</h1>
              {association.humanValidated && (
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {formatArrondissement(association.arrondissement)}
              </span>
              <Badge variant="secondary">{association.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="mb-3 text-lg font-semibold">A propos</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {association.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {association.address}
            </span>
            {association.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {association.website}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Missions */}
      <h2 className="mb-4 text-lg font-semibold">
        Missions disponibles ({association.missions.length})
      </h2>
      {association.missions.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Aucune mission active pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {association.missions.map((mission) => (
            <Link key={mission.id} href={`/mission/${mission.id}`}>
              <Card className="transition-all hover:shadow-(--shadow-warm)">
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
      )}
    </div>
  )
}
