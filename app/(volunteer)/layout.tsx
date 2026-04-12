import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { BottomTabNav } from "@/components/layouts/BottomTabNav"
import { ProfileDropdown } from "@/components/layouts/ProfileDropdown"
import { NotificationBell } from "@/components/layouts/NotificationBell"

export default async function VolunteerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const isLoggedIn = !!session?.user
  const firstName = session?.user?.name?.split(" ")[0] ?? null
  const initials = firstName ? firstName[0].toUpperCase() : null
  const roles = session?.user?.roles ?? []
  const email = session?.user?.email ?? ""

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Link href="/feed" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Lasso" width={28} height={28} />
            <h1 className="text-xl font-extrabold tracking-tight text-foreground" style={{ letterSpacing: '-0.04em' }}>
              las<span className="text-primary">s</span>o
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
            <div className="flex items-center gap-1">
              <NotificationBell />
              <ProfileDropdown
                initials={initials}
                name={firstName ?? ""}
                email={email}
                roles={roles}
              />
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 lg:px-8">{children}</main>

      <BottomTabNav isLoggedIn={isLoggedIn} />
    </div>
  )
}
