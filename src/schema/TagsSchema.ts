import { z } from 'zod'

export const Tags = z.object({
  query: z.object({
    key: z.string().optional(),
  }),
})
