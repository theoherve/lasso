import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    // TODO: add pagination, filtering (upcoming/past), and include slot+mission details
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[USER_BOOKINGS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des reservations" },
      { status: 500 },
    )
  }
}
