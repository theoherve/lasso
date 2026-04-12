import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations/user"

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe deja avec cet email" },
        { status: 409 },
      )
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12)

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        password: hashedPassword,
        firstName: parsed.data.firstName,
        name: parsed.data.firstName,
        arrondissement: parsed.data.arrondissement,
        roles: ["VOLUNTEER"],
      },
    })

    return NextResponse.json(
      { id: user.id, email: user.email },
      { status: 201 },
    )
  } catch (error) {
    console.error("[REGISTER]", error)
    return NextResponse.json(
      { error: "Erreur lors de la creation du compte" },
      { status: 500 },
    )
  }
}
