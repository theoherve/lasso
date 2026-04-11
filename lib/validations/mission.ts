import { z } from "zod"

export const createMissionSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caracteres"),
  description: z.string().min(10, "La description doit contenir au moins 10 caracteres"),
  category: z.string().min(1, "Categorie requise"),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  durationMin: z.number().int().min(30).max(240),
  maxVolunteers: z.number().int().min(1).max(50).default(1),
})

export const updateMissionSchema = createMissionSchema.partial()

export const createSlotSchema = z.object({
  missionId: z.string().cuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  spotsTotal: z.number().int().min(1).max(50),
})

export type CreateMissionInput = z.infer<typeof createMissionSchema>
export type UpdateMissionInput = z.infer<typeof updateMissionSchema>
export type CreateSlotInput = z.infer<typeof createSlotSchema>
