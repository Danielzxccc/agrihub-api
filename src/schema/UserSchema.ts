import { z } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     ListUserResponse:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ListUser"
 *         pagination:
 *           $ref: "#/components/schemas/Pagination"
 *
 *     ListUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the user
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         birthdate:
 *           type: string
 *           format: date-time
 *         present_address:
 *           type: string
 *         avatar:
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
 *           type: null
 *         role:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         isbanned:
 *           type: boolean
 *         farm_id:
 *           type: string
 *           nullable: true
 */
export const ListUserSchema = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z.string().optional().default(''),
  }),
})

export const ListAdminSchema = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z
      .union([z.literal('banned'), z.literal('active')])
      .default('active'),
  }),
})

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
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    birthdate: z
      .string()
      .transform((arg) => new Date(arg))
      .optional(),
    present_address: z.string().optional(),
    zipcode: z.string().optional(),
    district: z.string().optional(),
    municipality: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
  }),
})

export const NewReportedUser = z.object({
  body: z.object({
    reported: z.string(),
    reason: z.string(),
  }),
  files: z.array(z.any()),
})

/**
 * @openapi
 * components:
 *   schemas:
 *     ListMemberResponse:
 *       type: object
 *       properties:
 *         members:
 *           $ref: "#/components/schemas/Members"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     Members:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Member"
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         avatar:
 *           type: string
 *           format: uri
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *       required:
 *         - id
 *         - avatar
 *         - firstname
 *         - lastname
 *         - username
 *         - email
 */
