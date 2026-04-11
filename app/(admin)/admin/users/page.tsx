import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const users = [
  { id: "1", name: "Marie Dupont", email: "marie@example.com", roles: ["VOLUNTEER"], date: "12 janv. 2026" },
  { id: "2", name: "Lucas Martin", email: "lucas@example.com", roles: ["VOLUNTEER", "ASSO_ADMIN"], date: "3 fev. 2026" },
  { id: "3", name: "Camille Bernard", email: "camille@example.com", roles: ["VOLUNTEER"], date: "18 mars 2026" },
  { id: "4", name: "Hugo Petit", email: "hugo@example.com", roles: ["ASSO_ADMIN"], date: "22 mars 2026" },
  { id: "5", name: "Lea Moreau", email: "lea@example.com", roles: ["ADMIN"], date: "1 janv. 2026" },
  { id: "6", name: "Nathan Roux", email: "nathan@example.com", roles: ["VOLUNTEER"], date: "5 avr. 2026" },
]

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Date d&apos;inscription</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{user.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
