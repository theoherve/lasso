import { z } from "zod"

export const createAssociationSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  rnaNumber: z.string().regex(/^W\d{9}$/, "Numero RNA invalide (format: W + 9 chiffres)").optional(),
  description: z.string().min(10).optional(),
  address: z.string().min(5, "Adresse requise"),
  arrondissement: z.number().int().min(1).max(20),
  category: z.enum(["aide_personne", "environnement", "education", "autre"]),
  website: z.string().url().optional(),
})

export const updateAssociationSchema = createAssociationSchema.partial()

export type CreateAssociationInput = z.infer<typeof createAssociationSchema>
export type UpdateAssociationInput = z.infer<typeof updateAssociationSchema>
