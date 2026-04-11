import { BottomTabNav } from "@/components/layouts/BottomTabNav"

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <h1 className="text-xl font-bold tracking-tight text-primary">
            Lasso
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-6">{children}</main>

      <BottomTabNav />
    </div>
  )
}
