import { z } from "zod"

export const createStudyPlanSchema = z.object({
    theme: z
        .string()
        .min(2)
        .max(255),
    details: z
        .string()
        .min(2)
        .max(255),
    difficulty: z.union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
    ]),
})