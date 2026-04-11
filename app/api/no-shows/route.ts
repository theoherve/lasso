import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    // TODO: verify the booking belongs to a slot owned by the user's association
    // TODO: verify the slot date has passed before allowing no-show report
    const noShow = await prisma.noShowReport.create({
      data: {
        bookingId: parsed.data.bookingId,
        note: parsed.data.note,
        reportedBy: session.user.id,
      },
    })

    return NextResponse.json(noShow, { status: 201 })
  } catch (error) {
    console.error("[NO_SHOWS_POST]", error)
    return NextResponse.json(
      { error: "Erreur lors du signalement de l'absence" },
      { status: 500 },
    )
  }
}
