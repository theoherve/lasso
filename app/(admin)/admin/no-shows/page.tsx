import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const reports = [
  { id: "1", benevole: "Hugo Petit", mission: "Maraude Paris 11e", date: "7 avr. 2026", note: "Ne s'est pas presente sans prevenir" },
  { id: "2", benevole: "Nathan Roux", mission: "Tri alimentaire Belleville", date: "5 avr. 2026", note: "Absence non justifiee" },
  { id: "3", benevole: "Lea Moreau", mission: "Aide aux devoirs", date: "3 avr. 2026", note: "A prevenu 10 min avant le creneau" },
  { id: "4", benevole: "Hugo Petit", mission: "Distribution repas", date: "1 avr. 2026", note: "Deuxieme absence ce mois" },
]

export default function AdminNoShowsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Signalements no-show</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Benevole</TableHead>
            <TableHead>Mission</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.benevole}</TableCell>
              <TableCell>{report.mission}</TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell className="max-w-xs text-muted-foreground">
                {report.note}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
