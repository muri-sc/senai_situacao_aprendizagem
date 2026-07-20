import { z } from "zod"

export const registerUserSchema = z.object({
    name: z
        .string()
        .min(2)
        .max(255),
    email: z
        .email()
        .min(8)
        .max(255),
    password: z
        .string()
        .min(8)
        .max(255)
})

export const loginUserSchema = z.object({
    email: z
        .email()
        .min(8)
        .max(255),
    password: z
        .string()
        .min(8)
        .max(255)
})

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(2)
        .max(255),
    email: z
        .email()
        .min(8)
        .max(255),
    password: z
        .string()
        .min(8)
        .max(255)
})