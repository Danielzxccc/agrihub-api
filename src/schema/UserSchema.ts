import { z } from 'zod'

export const UserProfile = z.object({
  params: z.object({
    username: z.string({ required_error: 'id is required' }),
  }),
})

export const UpdateProfile = z.object({
  params: z.object({
    id: z.string({ required_error: 'id parameter is required' }),
  }),
  body: z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    birthdate: z.date().optional(),
    present_address: z.string().optional(),
    zipcode: z.string().optional(),
    district: z.string().optional(),
    municipality: z.string().optional(),
    verification_level: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
  }),
})
