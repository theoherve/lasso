import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const reports = await prisma.noShowReport.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          include: {
            user: { select: { id: true, firstName: true, name: true } },
            slot: {
              select: {
                startsAt: true,
                mission: { select: { title: true } },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("[ADMIN_NOSHOWS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des signalements" },
      { status: 500 },
    )
  }
}
