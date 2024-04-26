import { z } from 'zod'

export const FarmQuestion = z.object({
  body: z.array(
    z.object({
      id: z.string().optional(),
      farmid: z.string().optional(),
      question: z.string(),
    })
  ),
})

export type FarmQuestionSchema = z.infer<typeof FarmQuestion>
