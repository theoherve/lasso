import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateAssociationSchema } from "@/lib/validations/association"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    // TODO: include missions, member count, etc.
    const association = await prisma.association.findUnique({
      where: { id },
    })

    if (!association) {
      return NextResponse.json(
        { error: "Association introuvable" },
        { status: 404 },
      )
    }

    return NextResponse.json(association)
  } catch (error) {
    console.error("[ASSOCIATION_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de l'association" },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }
    if (!session.user.roles.includes("ASSOCIATION")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const { id } = await params
    const body: unknown = await request.json()
    const parsed = updateAssociationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // TODO: verify the association belongs to the current user
    const association = await prisma.association.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(association)
  } catch (error) {
    console.error("[ASSOCIATION_PATCH]", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de l'association" },
      { status: 500 },
    )
  }
}
