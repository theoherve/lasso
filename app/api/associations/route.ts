import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAssociationSchema } from "@/lib/validations/association"
import { verifyRna } from "@/lib/rna"

export async function GET() {
  try {
    // TODO: add pagination, search, category filtering
    const associations = await prisma.association.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(associations)
  } catch (error) {
    console.error("[ASSOCIATIONS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des associations" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const body: unknown = await request.json()
    const parsed = createAssociationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // Verify RNA number if provided
    if (parsed.data.rnaNumber) {
      const rnaResult = await verifyRna(parsed.data.rnaNumber)
      if (!rnaResult) {
        return NextResponse.json(
          { error: "Numero RNA invalide ou introuvable" },
          { status: 400 },
        )
      }
    }

    // TODO: generate slug from name
    const slug = parsed.data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const association = await prisma.association.create({
      data: {
        name: parsed.data.name,
        slug,
        rnaNumber: parsed.data.rnaNumber,
        rnaVerified: !!parsed.data.rnaNumber,
        description: parsed.data.description,
        address: parsed.data.address,
        arrondissement: parsed.data.arrondissement,
        category: parsed.data.category,
        website: parsed.data.website,
        members: {
          create: {
            userId: session.user.id,
            isOwner: true,
          },
        },
      },
    })

    return NextResponse.json(association, { status: 201 })
  } catch (error) {
    console.error("[ASSOCIATIONS_POST]", error)
    return NextResponse.json(
      { error: "Erreur lors de la creation de l'association" },
      { status: 500 },
    )
  }
}
