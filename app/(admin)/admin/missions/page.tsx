"use client"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/lasso/StatusBadge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const missions = [
  { id: "1", title: "Maraude Paris 11e", association: "Les Restos du Coeur", status: "ACTIVE", date: "12 avr. 2026" },
  { id: "2", title: "Tri alimentaire Belleville", association: "Solidarites Nouvelles", status: "OPEN", date: "15 avr. 2026" },
  { id: "3", title: "Aide aux devoirs", association: "Emmaues Paris", status: "ACTIVE", date: "18 avr. 2026" },
  { id: "4", title: "Distribution repas Gare du Nord", association: "Action contre la Faim", status: "COMPLETED", date: "5 avr. 2026" },
  { id: "5", title: "Nettoyage berges Canal Saint-Martin", association: "Secours Populaire 75", status: "PENDING", date: "20 avr. 2026" },
]

export default function AdminMissionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Moderation des missions</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Association</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missions.map((mission) => (
            <TableRow key={mission.id}>
              <TableCell className="font-medium">{mission.title}</TableCell>
              <TableCell>{mission.association}</TableCell>
              <TableCell>
                <StatusBadge status={mission.status} />
              </TableCell>
              <TableCell>{mission.date}</TableCell>
              <TableCell>
                <Button size="sm" variant="destructive">
                  Masquer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
