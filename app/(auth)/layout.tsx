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
            <h1 className="text-4xl font-extrabold text-foreground" style={{ letterSpacing: '-0.05em' }}>
              las<span className="text-primary">s</span>o
            </h1>
            <p className="text-[9px] font-medium uppercase tracking-[2.5px] text-muted-foreground">
              1 heure pour changer quelque chose
            </p>
          </div>
        </Link>
        {children}
      </div>
    </div>
  )
}
