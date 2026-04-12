import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <Link href="/" className="flex flex-col items-center gap-3">
          <Image src="/logo.svg" alt="Lasso" width={56} height={56} />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Lasso
            </h1>
            <p className="text-sm text-muted-foreground">
              Engage-toi pour Paris
            </p>
          </div>
        </Link>
        {children}
      </div>
    </div>
  )
}
