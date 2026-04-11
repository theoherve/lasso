import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/lasso/StatusBadge"

const kpis = [
  { label: "Missions actives", value: 12 },
  { label: "Benevoles inscrits ce mois", value: 47 },
  { label: "Heures completees", value: 186 },
  { label: "Prochain creneau", value: "Demain 14h" },
]

const recentBookings = [
  { id: "1", benevole: "Marie Dupont", mission: "Maraude Paris 11e", date: "10 avr. 2026", status: "CONFIRMED" },
  { id: "2", benevole: "Lucas Martin", mission: "Tri alimentaire", date: "9 avr. 2026", status: "PENDING" },
  { id: "3", benevole: "Camille Bernard", mission: "Aide aux devoirs", date: "8 avr. 2026", status: "COMPLETED" },
  { id: "4", benevole: "Hugo Petit", mission: "Distribution repas", date: "7 avr. 2026", status: "NO_SHOW" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Vue d&apos;ensemble</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservations recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Benevole</TableHead>
                <TableHead>Mission</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.benevole}</TableCell>
                  <TableCell>{booking.mission}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
