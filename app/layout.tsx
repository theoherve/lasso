import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { PostHogProvider } from "@/components/providers/PostHogProvider"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: {
    default: "Lasso — bénévolat à Paris",
    template: "%s | Lasso",
  },
  description:
    "Trouvez des missions de bénévolat ponctuel à Paris. 1 heure pour changer quelque chose.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SessionProvider>
          <PostHogProvider>{children}</PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
