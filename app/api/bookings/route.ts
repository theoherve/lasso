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

    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUniqueOrThrow({
        where: { id: parsed.data.slotId },
      })

      if (slot.status !== "OPEN") {
        throw new Error("SLOT_NOT_OPEN")
      }

      const confirmedCount = await tx.booking.count({
        where: { slotId: slot.id, status: "CONFIRMED" },
      })

      if (confirmedCount >= slot.spotsTotal) {
        throw new Error("SLOT_FULL")
      }

      const existing = await tx.booking.findUnique({
        where: {
          userId_slotId: {
            userId: session.user.id,
            slotId: slot.id,
          },
        },
      })

      if (existing) {
        throw new Error("ALREADY_BOOKED")
      }

      return tx.booking.create({
        data: {
          slotId: slot.id,
          userId: session.user.id,
        },
        include: {
          slot: {
            include: { mission: { select: { id: true, title: true } } },
          },
        },
      })
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SLOT_NOT_OPEN") {
        return NextResponse.json(
          { error: "Ce creneau n'est plus disponible" },
          { status: 409 },
        )
      }
      if (error.message === "SLOT_FULL") {
        return NextResponse.json(
          { error: "Ce creneau est complet" },
          { status: 409 },
        )
      }
      if (error.message === "ALREADY_BOOKED") {
        return NextResponse.json(
          { error: "Tu as deja reserve ce creneau" },
          { status: 409 },
        )
      }
    }
    console.error("[BOOKINGS_POST]", error)
    return NextResponse.json(
      { error: "Erreur lors de la reservation" },
      { status: 500 },
    )
  }
}
