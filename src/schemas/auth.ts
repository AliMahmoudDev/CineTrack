import { z } from "zod"

// step 1 - email + password
export const signUpStep1Schema = z.object({
  email: z
    .string()
    .min(1, "email is required")
    .email("enter a valid email"),
  password: z
    .string()
    .min(6, "password must be at least 6 chars")
    .max(50, "password too long"),
  confirmPassword: z
    .string()
    .min(1, "confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwords don't match",
  path: ["confirmPassword"],
})

// step 2 - name + age + preferences
export const signUpStep2Schema = z.object({
  name: z
    .string()
    .min(2, "name must be at least 2 chars")
    .max(50, "name too long"),
  age: z
    .number({ invalid_type_error: "enter a valid age" })
    .min(10, "you must be at least 10")
    .max(120, "enter a valid age"),
  favoriteGenres: z
    .array(z.number())
    .min(1, "pick at least one genre")
    .max(5, "max 5 genres"),
})

// login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "email is required")
    .email("enter a valid email"),
  password: z
    .string()
    .min(1, "password is required"),
})

export type SignUpStep1Data = z.infer<typeof signUpStep1Schema>
export type SignUpStep2Data = z.infer<typeof signUpStep2Schema>
export type LoginData = z.infer<typeof loginSchema>
