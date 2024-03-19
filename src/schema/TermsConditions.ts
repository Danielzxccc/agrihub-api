import { z } from 'zod'

export const UpdateTermsConditions = z.object({
  body: z.object({
    content: z.string().optional(),
  }),
})
