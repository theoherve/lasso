import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAssociationSchema } from "@/lib/validations/association"
import { verifyRna } from "@/lib/rna"

export async function GET() {
  try {
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

    // Check user doesn't already own an association
    const existingMembership = await prisma.associationMember.findFirst({
      where: { userId: session.user.id, isOwner: true },
    })
    if (existingMembership) {
      return NextResponse.json(
        { error: "Vous etes deja responsable d'une association" },
        { status: 409 },
      )
    }

    // Verify RNA if provided
    let rnaVerified = false
    let rnaName: string | undefined
    if (parsed.data.rnaNumber) {
      const rnaResult = await verifyRna(parsed.data.rnaNumber)
      if (!rnaResult.valid) {
        return NextResponse.json(
          { error: "Numero RNA invalide ou introuvable" },
          { status: 400 },
        )
      }
      rnaVerified = true
      rnaName = rnaResult.name
    }

    // Generate unique slug
    let baseSlug = parsed.data.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    let slug = baseSlug
    let counter = 1
    while (await prisma.association.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create association + membership + grant role in a transaction
    const association = await prisma.$transaction(async (tx) => {
      const asso = await tx.association.create({
        data: {
          name: rnaName ?? parsed.data.name,
          slug,
          rnaNumber: parsed.data.rnaNumber,
          rnaVerified,
          humanValidated: false,
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

      // Grant ASSOCIATION role to the user
      const user = await tx.user.findUniqueOrThrow({
        where: { id: session.user.id },
        select: { roles: true },
      })

      if (!user.roles.includes("ASSOCIATION")) {
        await tx.user.update({
          where: { id: session.user.id },
          data: { roles: [...user.roles, "ASSOCIATION"] },
        })
      }

      return asso
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
