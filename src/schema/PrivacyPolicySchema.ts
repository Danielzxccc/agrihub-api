import { z } from 'zod'

export const UpdatePrivacyPolicy = z.object({
  body: z.object({
    content: z.string().optional(),
  }),
})
