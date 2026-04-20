import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { PostHogProvider } from "@/components/providers/PostHogProvider"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator"
import { InstallPrompt } from "@/components/pwa/InstallPrompt"
import { ServiceWorkerGuard } from "@/components/pwa/ServiceWorkerGuard"
import { NativeBootstrap } from "@/components/pwa/NativeBootstrap"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const APP_NAME = "Lasso"
const APP_DESCRIPTION =
  "Trouvez des missions de bénévolat ponctuel à Paris. 1 heure pour changer quelque chose."

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: "Lasso — bénévolat à Paris",
    template: "%s | Lasso",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-196.png", sizes: "196x196", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: "Lasso — bénévolat à Paris",
    description: APP_DESCRIPTION,
    locale: "fr_FR",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C4622D" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1612" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
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
          <QueryProvider>
            <PostHogProvider>
              <ServiceWorkerGuard />
              <NativeBootstrap />
              <OfflineIndicator />
              {children}
              <InstallPrompt />
            </PostHogProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
