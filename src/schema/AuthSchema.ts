import { z } from 'zod'

export const UserAuthSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
})

export const UserRegisterSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'username is required' }),
    password: z
      .string({ required_error: 'password is required' })
      .min(8, { message: 'minimum of 8 characters' }),
    email: z.string({ required_error: 'email is required' }).email(),
    firstname: z.string({ required_error: 'firstname is required' }),
  }),
})
