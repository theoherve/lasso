import type { Role } from "@/lib/generated/prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      roles: Role[]
      email: string
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    id?: string
    roles?: Role[]
    email?: string
    name?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    roles: Role[]
  }
}

export type { Role } from "@/lib/generated/prisma/client"
export { MissionStatus, SlotStatus, BookingStatus } from "@/lib/generated/prisma/client"
