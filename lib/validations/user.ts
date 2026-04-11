import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
})

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caracteres"),
  firstName: z.string().min(2, "Prenom requis"),
  arrondissement: z.number().int().min(1).max(20).optional(),
})

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  arrondissement: z.number().int().min(1).max(20).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
