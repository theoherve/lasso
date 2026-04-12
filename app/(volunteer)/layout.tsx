import Image from "next/image"
import Link from "next/link"
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
          <Link href="/feed" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Lasso" width={28} height={28} />
            <h1 className="text-xl font-bold tracking-tight text-primary">
              Lasso
            </h1>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-6">{children}</main>

      <BottomTabNav />
    </div>
  )
}
