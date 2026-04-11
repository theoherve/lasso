import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/lasso/StatusBadge"

const missions = [
  { id: "1", title: "Maraude Paris 11e", status: "ACTIVE", benevoles: 8, date: "12 avr. 2026" },
  { id: "2", title: "Tri alimentaire Belleville", status: "OPEN", benevoles: 3, date: "15 avr. 2026" },
  { id: "3", title: "Aide aux devoirs - College Voltaire", status: "FULL", benevoles: 12, date: "18 avr. 2026" },
  { id: "4", title: "Distribution repas Gare du Nord", status: "COMPLETED", benevoles: 6, date: "5 avr. 2026" },
]

export default function MissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Missions</h1>
        <Button render={<Link href="/missions/new" />}>
          Creer une mission
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Benevoles</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missions.map((mission) => (
            <TableRow key={mission.id}>
              <TableCell>
                <Link
                  href={`/missions/${mission.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {mission.title}
                </Link>
              </TableCell>
              <TableCell>
                <StatusBadge status={mission.status} />
              </TableCell>
              <TableCell>{mission.benevoles}</TableCell>
              <TableCell>{mission.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
