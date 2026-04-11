import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const { id } = await params

    // Verify the booking belongs to the current user
    const booking = await prisma.booking.findUnique({
      where: { id },
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Reservation introuvable" },
        { status: 404 },
      )
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    // TODO: add cancellation policy checks (e.g. cannot cancel < 24h before slot)
    await prisma.booking.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[BOOKING_DELETE]", error)
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de la reservation" },
      { status: 500 },
    )
  }
}
