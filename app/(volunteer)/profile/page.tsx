import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ReliabilityScore } from "@/components/lasso/ReliabilityScore"
import { CalendarDays, Clock, MapPin } from "lucide-react"

const mockUser = {
  firstName: "Camille",
  lastName: "Dupont",
  email: "camille.dupont@email.com",
  arrondissement: 11,
  avatarUrl: null,
  bio: "Passionnee par l'entraide et l'engagement citoyen. Benevole depuis 2 ans sur Paris, je m'investis surtout dans l'aide alimentaire et le soutien scolaire.",
  reliabilityScore: 4.8,
  stats: {
    missionsCompleted: 23,
    hoursGiven: 68,
  },
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mon profil</h2>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              {mockUser.avatarUrl && (
                <AvatarImage src={mockUser.avatarUrl} alt={mockUser.firstName} />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {mockUser.firstName.charAt(0)}
                {mockUser.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">
                  {mockUser.firstName} {mockUser.lastName}
                </h3>
                <ReliabilityScore score={mockUser.reliabilityScore} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground">{mockUser.email}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {mockUser.arrondissement}e arrondissement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <CalendarDays className="mb-2 h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-primary">
              {mockUser.stats.missionsCompleted}
            </span>
            <span className="text-sm text-muted-foreground">
              Missions realisees
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Clock className="mb-2 h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-primary">
              {mockUser.stats.hoursGiven}h
            </span>
            <span className="text-sm text-muted-foreground">
              Heures donnees
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-2 font-semibold">A propos</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {mockUser.bio}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
