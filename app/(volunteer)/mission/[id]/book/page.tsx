import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // id available for future use (e.g. fetching mission details)
  void id

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-confirmed-bg">
            <CheckCircle2 className="h-10 w-10 text-status-confirmed" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">C&apos;est reserve !</h2>
            <p className="text-lg">
              Tu vas faire quelque chose de bien.{" "}
              <span role="img" aria-label="coeur">
                ❤️
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Tu recevras un rappel avant ta mission. Pense a prevenir si tu ne
              peux plus venir.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Button className="w-full" render={<Link href="/missions" />}>
              Voir mes missions
            </Button>
            <Button variant="outline" className="w-full" render={<Link href="/feed" />}>
              Retour au feed
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
