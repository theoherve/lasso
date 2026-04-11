import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createBookingSchema } from "@/lib/validations/booking"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const body: unknown = await request.json()
    const parsed = createBookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // TODO: use prisma.$transaction to atomically:
    // 1. Check the slot exists and has available spots (spotsTotal - current bookings > 0)
    // 2. Check the user hasn't already booked this slot
    // 3. Create the booking
    // This prevents race conditions on slot capacity.
    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUniqueOrThrow({
        where: { id: parsed.data.slotId },
        include: { _count: { select: { bookings: true } } },
      })

      // TODO: compare slot._count.bookings < slot.spotsTotal
      // TODO: check for duplicate booking by session.user.id + slotId

      return tx.booking.create({
        data: {
          slotId: parsed.data.slotId,
          userId: session.user.id,
        },
      })
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("[BOOKINGS_POST]", error)
    return NextResponse.json(
      { error: "Erreur lors de la reservation" },
      { status: 500 },
    )
  }
}
