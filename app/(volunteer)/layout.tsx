import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { BottomTabNav } from "@/components/layouts/BottomTabNav"

export default async function VolunteerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const isLoggedIn = !!session?.user
  const firstName = session?.user?.name?.split(" ")[0] ?? null
  const initials = firstName ? firstName[0].toUpperCase() : null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Link href="/feed" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Lasso" width={28} height={28} />
            <h1 className="text-xl font-bold tracking-tight text-primary">
              Lasso
            </h1>
          </Link>

          {!isLoggedIn && (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="cursor-pointer">S&apos;inscrire</Button>
              </Link>
            </div>
          )}

          {isLoggedIn && initials && (
            <Link
              href="/profile"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-opacity duration-200 hover:opacity-90"
            >
              {initials}
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 lg:px-8">{children}</main>

      <BottomTabNav isLoggedIn={isLoggedIn} />
    </div>
  )
}
