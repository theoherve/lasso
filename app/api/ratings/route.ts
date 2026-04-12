import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createRatingSchema = z.object({
  bookingId: z.string().cuid(),
  score: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const body: unknown = await request.json()
    const parsed = createRatingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parsed.data.bookingId },
      include: {
        slot: { select: { endsAt: true } },
        rating: { select: { id: true } },
      },
    })

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Reservation introuvable" },
        { status: 404 },
      )
    }

    if (booking.slot.endsAt > new Date()) {
      return NextResponse.json(
        { error: "Tu ne peux noter qu'apres la fin du creneau" },
        { status: 400 },
      )
    }

    if (booking.rating) {
      return NextResponse.json(
        { error: "Tu as deja note cette mission" },
        { status: 409 },
      )
    }

    const rating = await prisma.rating.create({
      data: {
        bookingId: parsed.data.bookingId,
        score: parsed.data.score,
        comment: parsed.data.comment,
        fromType: "volunteer",
        fromId: session.user.id,
      },
    })

    return NextResponse.json(rating, { status: 201 })
  } catch (error) {
    console.error("[RATINGS_POST]", error)
    return NextResponse.json(
      { error: "Erreur lors de la creation de l'evaluation" },
      { status: 500 },
    )
  }
}
