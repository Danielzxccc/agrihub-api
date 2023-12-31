import { z } from 'zod'

export const ListFarmSchema = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
  }),
})

export const NewFarmSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    location: z.string({ required_error: 'location is required' }),
    description: z.string({ required_error: 'description is required' }),
    farm_head: z.string({ required_error: 'farm_head is required' }),
    district: z.string({ required_error: 'district is required' }),
    size: z
      .string()
      .transform((arg) => Number(arg))
      .optional(),
  }),
  file: z.object({
    filename: z.string({ required_error: 'avatar is required' }),
  }),
})

// export const ViewSubFarmSchema = z.object({})

export const NewSubFarmSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
  params: z.object({
    farmid: z.string({ required_error: 'id is requred' }),
    head: z.string({ required_error: 'farm head is required' }),
  }),
})

export const NewCropSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is requred' }),
    description: z.string({ required_error: 'description is requred' }),
    seedling_season: z.string({ required_error: 'seedling_season is requred' }),
    planting_season: z.string({ required_error: 'planting_season is requred' }),
    harvest_season: z.string({ required_error: 'harvest_season is requred' }),
    isyield: z
      .string({ required_error: 'harvest_season is requred' })
      .transform((arg) => Boolean(arg)),
    growth_span: z.string({ required_error: 'growth_span is requred' }),
  }),
  file: z.object({
    filename: z.string({ required_error: 'image is required' }),
  }),
})

export const NewCropReportSchema = z.object({
  body: z.object({
    crop_name: z.string().optional(),
    crop_id: z.string({ required_error: 'crop_id is required' }),
    planted_qty: z.string({ required_error: 'planted_qty is required' }),
    harvested_qty: z.string().optional(),
    yield: z.string().optional(),
    withered_crops: z.string().optional(),
    date_planted: z.string({ required_error: 'date_planted is required' }),
    expected_harvest: z.string({
      required_error: 'expected_harvest is required',
    }),
    date_harvested: z.string().optional(),
    notes: z.string({ required_error: 'notes are required' }),
  }),
  params: z.object({
    farmid: z.string(),
    userid: z.string(),
  }),
})

/**@LIST_FAMRS */
/**
 * @openapi
 * components:
 *   schemas:
 *     FarmListResponse:
 *       type: object
 *       properties:
 *         farms:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/FarmData"
 *           description: List of farms
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     NewFarmResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the success of the registration
 *         data:
 *           $ref: "#/components/schemas/FarmData"
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
 *         avatar:
 *           type: string
 *           format: binary
 *           description: The size of the farm (optional)
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
 *           description: The size of the farm
 *         cover_photo:
 *           type: string
 *           description: The filename of the cover photo
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the farm was created
 *         updatedat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the farm was last updated
 *         avatar:
 *           type: string
 *           description: The URL of the farm's avatar image
 *
 *     PaginationData:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: The current page number
 *         per_page:
 *           type: integer
 *           description: The number of records per page
 *         total_pages:
 *           type: integer
 *           description: The total number of pages
 *         total_records:
 *           type: integer
 *           description: The total number of records
 */

/**@CROP_INFORMATION */
/**
 * @openapi
 * components:
 *   schemas:
 *     CropData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the crop
 *         name:
 *           type: string
 *           description: The name of the crop
 *         description:
 *           type: string
 *           description: A description of the crop
 *         image:
 *           type: string
 *           description: The filename of the crop image
 *         seedling_season:
 *           type: string
 *           description: The seedling season of the crop
 *         planting_season:
 *           type: string
 *           description: The planting season of the crop
 *         harvest_season:
 *           type: string
 *           description: The harvest season of the crop
 *         isyield:
 *           type: boolean
 *           description: Indicates whether the crop yields
 *         growth_span:
 *           type: string
 *           description: The growth span of the crop
 *         createdat:
 *           type: string
 *           description: The timestamp when the crop was created
 *         updatedat:
 *           type: string
 *           description: The timestamp when the crop was last updated
 */

/**@CROP_INFORMATION */
/**
 * @openapi
 * components:
 *   schemas:
 *     NewCropRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the crop
 *         description:
 *           type: string
 *           description: A description of the crop
 *         seedling_season:
 *           type: string
 *           description: The seedling season of the crop
 *         planting_season:
 *           type: string
 *           description: The planting season of the crop
 *         harvest_season:
 *           type: string
 *           description: The harvest season of the crop
 *         growth_span:
 *           type: string
 *           description: The growth span of the crop
 *         image:
 *           type: string
 *           format: binary
 *           description: Binary data of the crop image
 *       required:
 *         - name
 *         - description
 *         - seedling_season
 *         - planting_season
 *         - harvest_season
 *         - growth_span
 *         - image
 *
 *     NewCropResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the success of the crop creation
 *         data:
 *           $ref: "#/components/schemas/CropData"
 *
 *     CropData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the crop
 *         name:
 *           type: string
 *           description: The name of the crop
 *         description:
 *           type: string
 *           description: A description of the crop
 *         image:
 *           type: string
 *           description: The filename of the crop image
 *         seedling_season:
 *           type: string
 *           description: The seedling season of the crop
 *         planting_season:
 *           type: string
 *           description: The planting season of the crop
 *         harvest_season:
 *           type: string
 *           description: The harvest season of the crop
 *         growth_span:
 *           type: string
 *           description: The growth span of the crop
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the crop was created
 *         updatedat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the crop was last updated
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     NewCropReportRequest:
 *       type: object
 *       properties:
 *         crop_name:
 *           type: string
 *           description: The name of the crop
 *         crop_id:
 *           type: string
 *           description: The ID of the crop (required)
 *         planted_qty:
 *           type: string
 *           description: The quantity of crops planted (required)
 *         harvested_qty:
 *           type: string
 *           description: The quantity of crops harvested
 *         yield:
 *           type: string
 *           description: The yield of the crop
 *         withered_crops:
 *           type: string
 *           description: The quantity of withered crops
 *         date_planted:
 *           type: string
 *           description: The date when the crop was planted (required)
 *         expected_harvest:
 *           type: string
 *           description: The expected date of harvest (required)
 *         date_harvested:
 *           type: string
 *           description: The actual date of harvest (required)
 *         notes:
 *           type: string
 *           description: Additional notes for the crop report (required)
 *
 *     NewCropReportResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the success of the crop report creation
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the crop report
 *             farmid:
 *               type: string
 *               description: The ID of the farm
 *             userid:
 *               type: string
 *               description: The ID of the user
 *             crop_name:
 *               type: string
 *               description: The name of the crop
 *             crop_id:
 *               type: string
 *               description: The ID of the crop
 *             planted_qty:
 *               type: string
 *               description: The quantity of crops planted
 *             harvested_qty:
 *               type: string
 *               description: The quantity of crops harvested
 *             yield:
 *               type: string
 *               description: The yield of the crop
 *             withered_crops:
 *               type: string
 *               description: The quantity of withered crops
 *             date_planted:
 *               type: string
 *               format: date-time
 *               description: The date when the crop was planted
 *             expected_harvest:
 *               type: string
 *               format: date-time
 *               description: The expected date of harvest
 *             date_harvested:
 *               type: string
 *               format: date-time
 *               description: The actual date of harvest
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     SubfarmOverviewResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the subfarm
 *         name:
 *           type: string
 *           description: The name of the subfarm
 *         farm:
 *           type: object
 *           properties:
 *             avatar:
 *               type: string
 *               description: The URL of the farm's avatar
 *             cover_photo:
 *               type: string
 *               description: The URL of the farm's cover photo (null if not set)
 *             createdat:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the farm was created
 *             description:
 *               type: string
 *               description: The description of the farm
 *             district:
 *               type: string
 *               description: The district of the farm
 *             id:
 *               type: string
 *               description: The ID of the farm
 *             location:
 *               type: string
 *               description: The location of the farm
 *             name:
 *               type: string
 *               description: The name of the farm
 *             size:
 *               type: number
 *               description: The size of the farm
 *             updatedat:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the farm was last updated
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CropReport:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the crop report
 *         farmid:
 *           type: string
 *           description: The ID of the farm to which the crop report belongs
 *         userid:
 *           type: string
 *           description: The ID of the user who created the crop report
 *         crop_name:
 *           type: string
 *           description: The name of the crop (null if not set)
 *         crop_id:
 *           type: string
 *           description: The ID of the crop associated with the report
 *         planted_qty:
 *           type: string
 *           description: The quantity of crops planted
 *         harvested_qty:
 *           type: string
 *           description: The quantity of crops harvested (null if not set)
 *         yield:
 *           type: string
 *           description: The yield of the crop (null if not set)
 *         withered_crops:
 *           type: string
 *           description: The quantity of withered crops (null if not set)
 *         date_planted:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the crops were planted
 *         expected_harvest:
 *           type: string
 *           format: date-time
 *           description: The expected timestamp for harvest
 *         date_harvested:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the crops were harvested (null if not set)
 *         image:
 *           type: string
 *           description: The URL of the image associated with the crop report (null if not set)
 *         isharvested:
 *           type: boolean
 *           description: Indicates whether the crops have been harvested
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the crop report was created
 *         updatedat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the crop report was last updated
 *         notes:
 *           type: string
 *           description: Additional notes related to the crop report
 */
