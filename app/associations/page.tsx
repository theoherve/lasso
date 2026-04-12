import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, MapPin } from "lucide-react"
import { formatArrondissement } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Associations partenaires",
  description: "Decouvrez les associations parisiennes partenaires de Lasso.",
}

export default async function AssociationsPage() {
  const associations = await prisma.association.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { missions: { where: { status: "ACTIVE" } } },
      },
    },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Associations partenaires</h1>
      <p className="mb-8 text-muted-foreground">
        Decouvrez les associations parisiennes qui comptent sur vous.
      </p>

      {associations.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Aucune association pour le moment.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {associations.map((asso) => (
            <Link key={asso.slug} href={`/associations/${asso.slug}`}>
              <Card className="transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-warm-lg)">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <span className="text-sm font-bold">
                        {asso.name.charAt(0)}
                      </span>
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
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {asso.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{asso.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {asso._count.missions} mission
                      {asso._count.missions > 1 ? "s" : ""} active
                      {asso._count.missions > 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
