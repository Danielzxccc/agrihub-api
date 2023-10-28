import { z } from 'zod'

export const UserAuthSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
})

export const UserRegisterSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'email is required' }).email(),
    password: z
      .string({ required_error: 'password is required' })
      .min(8, { message: 'minimum of 8 characters' }),
    confirmPassword: z
      .string({ required_error: 'password is required' })
      .min(8, { message: 'minimum of 8 characters' }),
  }),
})

export const verifyLevelOne = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
})

export const verifyLevelTwo = z.object({
  body: z.object({
    firstname: z.string({ required_error: 'firstname is required' }),
    lastname: z.string({ required_error: 'lastname is required' }),
    birthdate: z.string({ required_error: 'birthdate is required' }),
    present_address: z.string({
      required_error: 'present address is required',
    }),
    zipcode: z.string({ required_error: 'zipcode is required' }),
    district: z.string({ required_error: 'district is required' }),
    municipality: z.string({ required_error: 'municipality is required' }),
  }),
})

export type RegisterUser = z.infer<typeof UserRegisterSchema>
export type VerifyLevelTwo = z.infer<typeof verifyLevelTwo>
