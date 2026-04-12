"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, XCircle } from "lucide-react"

interface AdminAssociation {
  id: string
  name: string
  slug: string
  rnaNumber: string | null
  rnaVerified: boolean
  humanValidated: boolean
  arrondissement: number
  createdAt: string
  _count: { missions: number; members: number }
}

export default function AdminAssociationsPage() {
  const [associations, setAssociations] = useState<AdminAssociation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/associations")
      .then((r) => r.json())
      .then(setAssociations)
      .finally(() => setLoading(false))
  }, [])

  async function handleValidate(id: string, humanValidated: boolean) {
    const res = await fetch("/api/admin/associations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, humanValidated }),
    })

    if (res.ok) {
      setAssociations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, humanValidated } : a)),
      )
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Validation des associations ({associations.length})</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>RNA</TableHead>
            <TableHead>Arr.</TableHead>
            <TableHead>Missions</TableHead>
            <TableHead>Validee</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {associations.map((asso) => (
            <TableRow key={asso.id}>
              <TableCell className="font-medium">{asso.name}</TableCell>
              <TableCell className="font-mono text-xs">
                {asso.rnaNumber ?? "—"}
                {asso.rnaVerified && (
                  <CheckCircle2 className="ml-1 inline h-3 w-3 text-green-600" />
                )}
              </TableCell>
              <TableCell>{asso.arrondissement}e</TableCell>
              <TableCell>{asso._count.missions}</TableCell>
              <TableCell>
                {asso.humanValidated ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell>
                {!asso.humanValidated ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleValidate(asso.id, true)}
                    >
                      Valider
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-destructive"
                    onClick={() => handleValidate(asso.id, false)}
                  >
                    Retirer
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
