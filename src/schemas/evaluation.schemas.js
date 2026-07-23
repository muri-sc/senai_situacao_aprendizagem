import { z } from "zod"

export const evaluateSchema = z.object({
    studentAnswers: z.record(
        z.string().regex(/^\d+$/),
        z.number().int().min(1)
    )
})
