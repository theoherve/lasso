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

const associations = [
  { id: "1", name: "Les Restos du Coeur - Paris 11", rna: "W751234567", status: "CONFIRMED" },
  { id: "2", name: "Solidarites Nouvelles", rna: "W751237890", status: "PENDING" },
  { id: "3", name: "Emmaues Paris", rna: "W751230001", status: "CONFIRMED" },
  { id: "4", name: "Action contre la Faim - IDF", rna: "W751239876", status: "PENDING" },
  { id: "5", name: "Secours Populaire 75", rna: "W751235555", status: "CONFIRMED" },
]

export default function AdminAssociationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Validation des associations</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>RNA</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {associations.map((asso) => (
            <TableRow key={asso.id}>
              <TableCell className="font-medium">{asso.name}</TableCell>
              <TableCell className="font-mono text-xs">{asso.rna}</TableCell>
              <TableCell>
                <StatusBadge status={asso.status} />
              </TableCell>
              <TableCell>
                {asso.status === "PENDING" ? (
                  <div className="flex gap-2">
                    <Button size="sm">Valider</Button>
                    <Button size="sm" variant="destructive">
                      Rejeter
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Validee</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
