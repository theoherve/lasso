import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Heures ce mois", value: "186 h" },
  { label: "Participants uniques", value: 34 },
  { label: "Taux de completion", value: "87 %" },
]

export default function StatsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Statistiques</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">
            Graphiques disponibles prochainement
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
