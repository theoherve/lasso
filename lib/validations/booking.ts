import { z } from "zod"

export const createBookingSchema = z.object({
  slotId: z.string().cuid(),
})

export const cancelBookingSchema = z.object({
  reason: z.string().max(500).optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>
