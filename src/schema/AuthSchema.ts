import { z } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     UserLoginSchema:
 *       type: object
 *       required:
 *         - user
 *         - password
 *       properties:
 *         user:
 *           type: string
 *           default: daniel1234
 *         password:
 *           type: string
 *           default: qweR123$
 *
 *     UserRegisterSchema:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         confirmPassword:
 *           type: string
 *
 *     UserCompletionSchema:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - birthdate
 *         - present_address
 *         - zipcode
 *         - district
 *         - municipality
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         birthdate:
 *           type: string
 *         present_address:
 *           type: string
 *         zipcode:
 *           type: string
 *         district:
 *           type: string
 *         municipality:
 *           type: string
 *
 *     UserSchema:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - email
 *         - firstname
 *         - lastname
 *         - district
 *         - verification_level
 *         - createdat
 *         - updatedat
 *         - avatar
 *         - role
 *         - bio
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         birthdate:
 *           type: string
 *         present_address:
 *           type: string
 *         zipcode:
 *           type: string
 *         district:
 *           type: string
 *         municipality:
 *           type: string
 *         verification_level:
 *           type: string
 *         createdat:
 *           type: string
 *         updatedat:
 *           type: string
 *         avatar:
 *           type: string
 *         role:
 *           type: string
 *         bio:
 *           type: string
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         avatar:
 *           type: string
 *           format: binary
 *         username:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *
 *     UserUpdateProfile:
 *       type: object
 *       properties:
 *         avatar:
 *           type: string
 *           format: binary
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         birthdate:
 *           type: string
 *           format: date
 *         present_address:
 *           type: string
 *         zipcode:
 *           type: string
 *         district:
 *           type: string
 *         municipality:
 *           type: string
 *         verification_level:
 *           type: string
 *         bio:
 *           type: string
 *
 *     UserAuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: "#/components/schemas/UserSchema"
 *
 *     ZodValidationError:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         expected:
 *           type: string
 *         received:
 *           type: string
 *         path:
 *           type: array
 *           items:
 *             type: string
 *         message:
 *           type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: boolean
 *           default: true
 *         message:
 *           type: string
 *         validationErrors:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ZodValidationError"
 *
 *     ServerError:
 *       type: object
 *       properties:
 *         error:
 *           type: boolean
 *           default: true
 *         message:
 *           type: string
 *           default: Server Error
 */

export const UserAuthSchema = z.object({
  body: z.object({
    user: z.string(),
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

export const SetupUsernameTags = z.object({
  body: z.object({
    username: z.string().min(4),
    tags: z.string().array(),
  }),
})
export type RegisterUser = z.infer<typeof UserRegisterSchema>
export type ProfileCompletion = z.infer<typeof verifyLevelTwo>
