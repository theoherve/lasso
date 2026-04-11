import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const approveAssociationSchema = z.object({
  id: z.string().cuid(),
  approved: z.boolean(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }
    if (!session.user.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    // TODO: add pagination, filtering by status (pending, approved, rejected)
    const associations = await prisma.association.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(associations)
  } catch (error) {
    console.error("[ADMIN_ASSOCIATIONS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des associations" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }
    if (!session.user.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = approveAssociationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // TODO: update status field and optionally grant ASSOCIATION role to owner
    const association = await prisma.association.update({
      where: { id: parsed.data.id },
      data: {
        // TODO: set approved/rejected status based on parsed.data.approved
      },
    })

    return NextResponse.json(association)
  } catch (error) {
    console.error("[ADMIN_ASSOCIATIONS_PATCH]", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de l'association" },
      { status: 500 },
    )
  }
}
