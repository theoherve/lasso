import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getMyAssociation } from "@/lib/auth-helpers"

const reportNoShowSchema = z.object({
  bookingId: z.string().cuid(),
  note: z.string().max(500).optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }
    if (!session.user.roles.includes("ASSOCIATION")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = reportNoShowSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const association = await getMyAssociation(session.user.id)
    if (!association) {
      return NextResponse.json(
        { error: "Aucune association liee" },
        { status: 403 },
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parsed.data.bookingId },
      include: {
        slot: {
          include: { mission: { select: { associationId: true } } },
        },
        noShowReport: { select: { id: true } },
      },
    })

    if (!booking || booking.slot.mission.associationId !== association.id) {
      return NextResponse.json(
        { error: "Reservation introuvable" },
        { status: 404 },
      )
    }

    if (booking.slot.startsAt > new Date()) {
      return NextResponse.json(
        { error: "Le creneau n'a pas encore eu lieu" },
        { status: 400 },
      )
    }

    if (booking.noShowReport) {
      return NextResponse.json(
        { error: "Ce no-show a deja ete signale" },
        { status: 409 },
      )
    }

    await prisma.$transaction([
      prisma.noShowReport.create({
        data: {
          bookingId: parsed.data.bookingId,
          note: parsed.data.note,
          reportedBy: session.user.id,
        },
      }),
      prisma.booking.update({
        where: { id: parsed.data.bookingId },
        data: { status: "NO_SHOW" },
      }),
      prisma.user.update({
        where: { id: booking.userId },
        data: {
          noShowCount: { increment: 1 },
          reliabilityScore: { decrement: 0.5 },
        },
      }),
    ])

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("[NO_SHOWS_POST]", error)
    return NextResponse.json(
      { error: "Erreur lors du signalement de l'absence" },
      { status: 500 },
    )
  }
}
