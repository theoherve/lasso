import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Clock, MapPin, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-extrabold text-primary">Lasso</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">S&apos;inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          style={{ animation: "fade-in 0.6s ease-out" }}
        >
          <Heart className="h-4 w-4 fill-current" />
          Paris, ville solidaire
        </div>

        <h1
          className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
          style={{ animation: "slide-up 0.8s ease-out" }}
        >
          Donnez <span className="text-primary">1 a 2 heures</span> pour
          changer des vies
        </h1>

        <p
          className="mt-6 max-w-xl text-lg text-muted-foreground"
          style={{ animation: "slide-up 1s ease-out" }}
        >
          Lasso connecte les Parisiens a des missions de benevolat courtes
          aupres d&apos;associations de votre quartier. Simple, ponctuel,
          impactant.
        </p>

        <div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animation: "fade-in 1.2s ease-out" }}
        >
          <Link href="/register">
            <Button size="lg" className="text-base font-semibold">
              C&apos;est parti !
            </Button>
          </Link>
          <Link href="/associations">
            <Button size="lg" variant="outline" className="text-base">
              Voir les associations
            </Button>
          </Link>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-2xl font-bold">
            Comment ca marche ?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <ValueProp
              icon={MapPin}
              title="Trouvez"
              description="Des missions a cote de chez vous, dans votre arrondissement."
            />
            <ValueProp
              icon={Clock}
              title="Reservez"
              description="Choisissez un creneau qui vous convient. 1h, 1h30 ou 2h max."
            />
            <ValueProp
              icon={Users}
              title="Agissez"
              description="Rejoignez l'association le jour J et faites la difference."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-12 px-4">
          <Stat value="50+" label="associations partenaires" />
          <Stat value="200+" label="missions par mois" />
          <Stat value="1 500+" label="benevoles actifs" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>Lasso — Paris 2026 — Benevolat ponctuel pour tous</p>
      </footer>
    </div>
  )
}

function ValueProp({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
