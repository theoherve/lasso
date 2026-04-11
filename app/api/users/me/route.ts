import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateProfileSchema } from "@/lib/validations/user"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    // TODO: select only the fields needed for the profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 },
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("[USER_ME_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation du profil" },
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

    const body: unknown = await request.json()
    const parsed = updateProfileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[USER_ME_PATCH]", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du profil" },
      { status: 500 },
    )
  }
}
