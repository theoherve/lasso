import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Utilisateurs", value: 1_243 },
  { label: "Associations", value: 58 },
  { label: "Missions actives", value: 94 },
  { label: "Signalements", value: 7 },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Tableau de bord admin</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString("fr-FR")
                  : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
