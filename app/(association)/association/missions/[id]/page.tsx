import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import { VolunteerRow } from "@/components/lasso/VolunteerRow"

const mockMission = {
  id: "1",
  title: "Maraude Paris 11e",
  status: "ACTIVE",
  description:
    "Maraude de nuit dans le 11e arrondissement de Paris. Distribution de repas chauds et orientation vers les structures d'hebergement.",
  address: "Place de la Republique, 75011 Paris",
  duration: "90 min",
  spots: 10,
  category: "Maraude",
}

const mockVolunteers = [
  { user: { id: "v1", firstName: "Marie", name: "Dupont", avatarUrl: null, reliabilityScore: 92 }, booking: { status: "CONFIRMED" } },
  { user: { id: "v2", firstName: "Lucas", name: "Martin", avatarUrl: null, reliabilityScore: 88 }, booking: { status: "CONFIRMED" } },
  { user: { id: "v3", firstName: "Camille", name: "Bernard", avatarUrl: null, reliabilityScore: 75 }, booking: { status: "PENDING" } },
  { user: { id: "v4", firstName: "Hugo", name: "Petit", avatarUrl: null, reliabilityScore: 95 }, booking: { status: "COMPLETED" } },
]

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{mockMission.title}</h1>
          <StatusBadge status={mockMission.status} />
        </div>
        <Button variant="outline" render={<Link href={`/missions/${id}/slots`} />}>
          Gerer les creneaux
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Categorie : </span>
              {mockMission.category}
            </div>
            <div>
              <span className="text-muted-foreground">Adresse : </span>
              {mockMission.address}
            </div>
            <div>
              <span className="text-muted-foreground">Duree : </span>
              {mockMission.duration}
            </div>
            <div>
              <span className="text-muted-foreground">Places : </span>
              {mockVolunteers.length} / {mockMission.spots}
            </div>
            <p className="pt-2 text-muted-foreground">{mockMission.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benevoles inscrits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockVolunteers.map((v) => (
              <VolunteerRow key={v.user.id} user={v.user} booking={v.booking} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
