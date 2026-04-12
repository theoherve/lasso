import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Clock, MapPin, Users, ArrowRight, Building2 } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="space-y-10 py-4">
      {/* Hero */}
      <section className="text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Heart className="h-4 w-4" />
          Paris, ville solidaire
        </div>

        <h1 className="mx-auto max-w-lg text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
          Donnez <span className="text-primary">1 à 2 heures</span> pour
          changer des vies
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">
          Lasso connecte les Parisiens à des missions de bénévolat courtes
          auprès d&apos;associations de votre quartier. Simple, ponctuel,
          impactant.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/feed">
            <Button size="lg" className="cursor-pointer text-base font-semibold">
              Voir les missions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/associations">
            <Button size="lg" variant="outline" className="cursor-pointer text-base">
              Voir les associations
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-2xl bg-card p-6 ring-1 ring-foreground/5 sm:p-8">
        <h2 className="mb-8 text-center text-xl font-bold">
          Comment ca marche ?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <StepCard
            icon={MapPin}
            step="1"
            title="Trouvez"
            description="Des missions a cote de chez vous, dans votre arrondissement."
          />
          <StepCard
            icon={Clock}
            step="2"
            title="Reservez"
            description="Choisissez un creneau qui vous convient. 1h, 1h30 ou 2h max."
          />
          <StepCard
            icon={Users}
            step="3"
            title="Agissez"
            description="Rejoignez l'association le jour J et faites la difference."
          />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        <StatCard value="50+" label="associations partenaires" />
        <StatCard value="200+" label="missions par mois" />
        <StatCard value="1 500+" label="benevoles actifs" />
      </section>

      {/* CTA Associations */}
      <Card className="bg-secondary/5 ring-1 ring-secondary/10">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
            <Building2 className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Vous etes une association ?</h2>
            <p className="mt-2 text-muted-foreground">
              Inscrivez votre association sur Lasso et publiez vos missions
              pour trouver des benevoles motives.
            </p>
          </div>
          <Link href="/devenir-association">
            <Button size="lg" variant="outline" className="cursor-pointer text-base">
              Inscrire mon association
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground">
        <p>Lasso — Paris 2026 — Benevolat ponctuel pour tous</p>
      </footer>
    </div>
  )
}

function StepCard({
  icon: Icon,
  step,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  step: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
        Etape {step}
      </span>
      <h3 className="mb-1.5 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-4 text-center">
        <p className="text-2xl font-extrabold text-primary">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
