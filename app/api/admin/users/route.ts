import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }
    if (!session.user.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    // TODO: add pagination, search, role filtering
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des utilisateurs" },
      { status: 500 },
    )
  }
}
