import { z } from "zod"

// create list form schema
export const createListSchema = z.object({
  name: z
    .string()
    .min(1, "list name is required")
    .max(50, "name too long, keep it under 50 chars"),
  description: z
    .string()
    .max(200, "description too long")
    .default(""),
})

export type CreateListFormData = z.infer<typeof createListSchema>
