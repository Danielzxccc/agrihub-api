import { z } from 'zod'

export const ListFarmSchema = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
  }),
})

/**
 * @openapi
 * components:
 *   schemas:
 *     NewFarmRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the farm
 *         location:
 *           type: string
 *           description: The location of the farm
 *         description:
 *           type: string
 *           description: A description of the farm
 *         farm_head:
 *           type: string
 *           description: The head of the farm
 *         district:
 *           type: string
 *           description: The district where the farm is located
 *         size:
 *           type: number
 *           description: The size of the farm (optional)
 *         cover_photo:
 *           type: string
 *           format: binary
 *           description: Binary data of the cover photo (required)
 *       required:
 *         - name
 *         - location
 *         - description
 *         - farm_head
 *         - district
 *         - cover_photo
 *
 *     NewFarmResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the success of the registration
 *         data:
 *           $ref: "#/components/schemas/FarmData"
 *
 *     FarmData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the farm
 *         name:
 *           type: string
 *           description: The name of the farm
 *         location:
 *           type: string
 *           description: The location of the farm
 *         description:
 *           type: string
 *           description: A description of the farm
 *         farm_head:
 *           type: string
 *           description: The head of the farm
 *         district:
 *           type: string
 *           description: The district where the farm is located
 *         size:
 *           type: number
 *           description: The size of the farm (optional)
 *         cover_photo:
 *           type: string
 *           description: The filename of the cover photo
 *         createdat:
 *           type: string
 *           description: The timestamp when the farm was created
 *         updatedat:
 *           type: string
 *           description: The timestamp when the farm was last updated
 */

export const NewFarmSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    location: z.string({ required_error: 'location is required' }),
    description: z.string({ required_error: 'description is required' }),
    farm_head: z.string({ required_error: 'farm_head is required' }),
    district: z.string({ required_error: 'district is required' }),
    size: z.number().optional(),
  }),
})

export const NewSubFarmSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
  params: z.object({
    farmid: z.string({ required_error: 'id is requred' }),
    head: z.string({ required_error: 'farm head is required' }),
  }),
})
