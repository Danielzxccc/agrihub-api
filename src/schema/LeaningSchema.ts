import { z } from 'zod'

export const NewLearningMaterial = z.object({
  body: z.object({}),
})
