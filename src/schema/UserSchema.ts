import { z } from 'zod'

export const UserProfile = z.object({
  params: z.object({
    username: z.string({ required_error: 'id is required' }),
  }),
})
