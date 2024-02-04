import { z } from 'zod'

export const ListFarmSchema = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    filter: z
      .union([
        z.literal('pending'),
        z.literal('approved'),
        z.literal('rejected'),
      ])
      .optional()
      .default('pending'),
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

export const NewFarmApplication = z.object({
  body: z.object({
    farm_name: z.string(),
    farm_size: z.string().transform((arg) => Number(arg)),
    district: z.string(),
    id_type: z.string(),
    location: z.string(),
    proof: z.string(),
    type_of_farm: z.string(),
  }),
})

export const UpdateFarmApplication = z.object({
  body: z.object({
    farm_name: z.string().optional(),
    farm_size: z
      .string()
      .transform((arg) => Number(arg))
      .optional(),
    district: z.string().optional(),
    original_farm_images: z.string().array().optional(),
    deleted_farm_images: z.string().array().optional(),
    id_type: z.string().optional(),
    location: z.string().optional(),
  }),
})

export type NewFarmApplicationT = z.infer<typeof NewFarmApplication>
export type UpdateFarmApplicationT = z.infer<typeof UpdateFarmApplication>

export const NewCommunityFarmGallery = z.object({
  body: z.object({
    description: z.string().optional().default(''),
  }),
})

export const CommunityFarms = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z.string().optional().default(''),
  }),
})

export const NewFarmerInvitaion = z.object({
  body: z.object({
    userid: z.string(),
    expiresat: z.string(),
  }),
})

export const UpdateCommunityFarm = z.object({
  body: z.object({
    farm_name: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    disctrict: z.string().optional(),
    size: z.string().optional(),
  }),
})

export type UpdateCommunityFarmT = z.infer<typeof UpdateCommunityFarm>

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
 *         isyield:
 *           type: boolean
 *           description: Indicates whether the crop yields
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
 *         - isyield
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

/**
 * @openapi
 * components:
 *   schemas:
 *     NewFarmApplication:
 *       type: object
 *       required:
 *         - farm_name
 *         - farm_size
 *         - district
 *         - proof
 *         - farm_actual_images
 *         - id_type
 *         - valid_id
 *         - location
 *       properties:
 *         farm_name:
 *           type: string
 *           description: The name of the farm
 *         farm_size:
 *           type: string
 *           description: The size of the farm
 *         district:
 *           type: string
 *           description: The district of the farm
 *         id_type:
 *           type: string
 *           description: The type of ID used for application
 *         location:
 *           type: string
 *           description: The type of ID used for application
 *         valid_id:
 *           type: string
 *           format: binary
 *           description: The proof image file
 *         proof:
 *           type: string
 *           description: Type of farm
 *         type_of_farm:
 *           type: string
 *           description: Type of farm community
 *         farm_actual_images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: An array of actual farm image files
 *
 *     FarmApplicationData:
 *       type: object
 *       required:
 *         - id
 *         - farm_name
 *         - farm_size
 *         - district
 *         - proof
 *         - farm_actual_images
 *         - id_type
 *         - valid_id
 *         - location
 *         - selfie
 *         - applicant
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the farm application
 *         farm_name:
 *           type: string
 *           description: The name of the farm
 *         farm_size:
 *           type: string
 *           description: The size of the farm
 *         district:
 *           type: string
 *           description: The district of the farm
 *         proof:
 *           type: string
 *           description: The proof image for the application
 *         farm_actual_images:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of actual farm image URLs
 *         id_type:
 *           type: string
 *           description: The type of ID used for application
 *         valid_id:
 *           type: string
 *           description: The image of the valid ID
 *         location:
 *           type: string
 *           description: The location of the Farm
 *         selfie:
 *           type: string
 *           description: The selfie image of the applicant
 *         applicant:
 *           type: string
 *           description: The ID of the applicant
 *         status:
 *           type: string
 *           description: The status of the application
 *
 *     FarmApplicationResponse:
 *       type: object
 *       required:
 *         - message
 *         - data
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the result of the operation
 *         data:
 *           $ref: "#/components/schemas/FarmApplicationData"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     FarmApplicationsResponse:
 *       type: object
 *       required:
 *         - applications
 *         - pagination
 *       properties:
 *         applications:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/FarmApplicationData"
 *           description: The array of farm applications
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *
 *     FarmApplicationData:
 *       type: object
 *       required:
 *         - id
 *         - farm_name
 *         - farm_size
 *         - district
 *         - location
 *         - proof
 *         - farm_actual_images
 *         - id_type
 *         - valid_id
 *         - selfie
 *         - status
 *         - createdat
 *         - updatedat
 *         - applicant
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the farm application
 *         farm_name:
 *           type: string
 *           description: The name of the farm
 *         farm_size:
 *           type: string
 *           description: The size of the farm
 *         district:
 *           type: string
 *           description: The district of the farm
 *         location:
 *           type: string
 *           description: The location of the farm
 *         proof:
 *           type: string
 *           description: The proof image for the application
 *         farm_actual_images:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of actual farm image URLs
 *         id_type:
 *           type: string
 *           description: The type of ID used for application
 *         valid_id:
 *           type: string
 *           description: The image of the valid ID
 *         selfie:
 *           type: string
 *           description: The selfie image of the applicant
 *         status:
 *           type: string
 *           description: The status of the application
 *         createdat:
 *           type: string
 *           description: The timestamp when the application was created
 *         updatedat:
 *           type: string
 *           description: The timestamp when the application was last updated
 *         applicant:
 *           $ref: "#/components/schemas/ApplicantData"
 *
 *     ApplicantData:
 *       type: object
 *       required:
 *         - avatar
 *         - email
 *         - firstname
 *         - id
 *         - lastname
 *         - username
 *       properties:
 *         avatar:
 *           type: string
 *           description: The URL of the applicant's avatar
 *         email:
 *           type: string
 *           description: The email of the applicant
 *         firstname:
 *           type: string
 *           description: The first name of the applicant
 *         id:
 *           type: string
 *           description: The ID of the applicant
 *         lastname:
 *           type: string
 *           description: The last name of the applicant
 *         username:
 *           type: string
 *           description: The username of the applicant
 *
 *     PaginationData:
 *       type: object
 *       required:
 *         - page
 *         - per_page
 *         - total_pages
 *         - total_records
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

/**
 * @openapi
 * components:
 *   schemas:
 *     CheckExistingApplicationResponse:
 *       type: object
 *       required:
 *         - message
 *         - data
 *       properties:
 *         message:
 *           type: string
 *           description: A success message
 *         data:
 *           $ref: "#/components/schemas/FarmApplicationData"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AcceptFarmApplicationResponse:
 *       type: object
 *       required:
 *         - message
 *         - data
 *       properties:
 *         message:
 *           type: string
 *           description: A success message
 *         data:
 *           $ref: "#/components/schemas/AcceptedFarmApplicationData"
 *
 *     AcceptedFarmApplicationData:
 *       type: object
 *       required:
 *         - id
 *         - farm_name
 *         - location
 *         - farm_head
 *         - district
 *         - size
 *         - application_id
 *         - createdat
 *         - updatedat
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the accepted farm application
 *         farm_name:
 *           type: string
 *           description: The name of the farm
 *         location:
 *           type: string
 *           description: The location of the farm
 *         description:
 *           type: string
 *           description: The description of the farm
 *         farm_head:
 *           type: string
 *           description: The ID of the farm head
 *         district:
 *           type: string
 *           description: The district of the farm
 *         size:
 *           type: string
 *           description: The size of the farm
 *         avatar:
 *           type: string
 *           description: The URL of the farm's avatar
 *         cover_photo:
 *           type: string
 *           description: The URL of the farm's cover photo
 *         application_id:
 *           type: string
 *           description: The ID of the associated farm application
 *         createdat:
 *           type: string
 *           description: The timestamp when the farm was created
 *         updatedat:
 *           type: string
 *           description: The timestamp when the farm was last updated
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AddFarmCropResponse:
 *       type: object
 *       required:
 *         - id
 *         - farm_id
 *         - crop_id
 *         - createdat
 *         - updatedat
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the added crop in the community farm
 *         farm_id:
 *           type: string
 *           description: The ID of the community farm
 *         crop_id:
 *           type: string
 *           description: The ID of the crop
 *         createdat:
 *           type: string
 *           description: The timestamp when the crop was added
 *         updatedat:
 *           type: string
 *           description: The timestamp when the crop was last updated
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CommunityFarmResponse:
 *       type: object
 *       required:
 *         - id
 *         - farm_name
 *         - location
 *         - farm_head
 *         - district
 *         - size
 *         - application_id
 *         - createdat
 *         - updatedat
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the community farm
 *         farm_name:
 *           type: string
 *           description: The name of the community farm
 *         location:
 *           type: string
 *           description: The location of the community farm
 *         description:
 *           type: string
 *           description: The description of the community farm
 *         farm_head:
 *           type: string
 *           description: The ID of the farm head
 *         district:
 *           type: string
 *           description: The district of the community farm
 *         size:
 *           type: string
 *           description: The size of the community farm
 *         avatar:
 *           type: string
 *           description: The URL of the farm's avatar
 *         cover_photo:
 *           type: string
 *           description: The URL of the farm's cover photo
 *         application_id:
 *           type: string
 *           description: The ID of the farm's application
 *         createdat:
 *           type: string
 *           description: The timestamp when the community farm was created
 *         updatedat:
 *           type: string
 *           description: The timestamp when the community farm was last updated
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CropItem:
 *       type: object
 *       required:
 *         - id
 *         - updatedat
 *         - createdat
 *         - name
 *         - description
 *         - image
 *         - seedling_season
 *         - planting_season
 *         - harvest_season
 *         - isyield
 *         - growth_span
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the crop
 *         updatedat:
 *           type: string
 *           description: The timestamp when the crop was last updated
 *         createdat:
 *           type: string
 *           description: The timestamp when the crop was created
 *         name:
 *           type: string
 *           description: The name of the crop
 *         description:
 *           type: string
 *           description: The description of the crop
 *         image:
 *           type: string
 *           description: The URL of the crop's image
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
 *           description: Indicates whether the crop is a yield
 *         growth_span:
 *           type: string
 *           description: The growth span of the crop
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CropGalleryItem:
 *       type: object
 *       required:
 *         - id
 *         - farm_id
 *         - imagesrc
 *         - description
 *         - createdat
 *         - updatedat
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the gallery item
 *         farm_id:
 *           type: string
 *           description: The ID of the community farm
 *         imagesrc:
 *           type: string
 *           description: The URL of the image
 *         description:
 *           type: string
 *           description: The description of the gallery item
 *         createdat:
 *           type: string
 *           description: The timestamp when the gallery item was created
 *         updatedat:
 *           type: string
 *           description: The timestamp when the gallery item was last updated
 *
 *     NewCommunityFarmGallery:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           description: The description of the gallery item
 *           optional: true
 *           default: ""
 *         image:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *             optional: true
 *
 *     DeleteSuccessMessage:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the success of the deletion
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CommunityFarmsResponse:
 *       type: object
 *       properties:
 *         farms:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/CommunityFarmData"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *
 *     CommunityFarmData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         farm_name:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 *         farm_head:
 *           type: string
 *         district:
 *           type: string
 *         size:
 *           type: string
 *         avatar:
 *           type: string
 *         cover_photo:
 *           type: string
 *         application_id:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     NewFarmerInvitationRequest:
 *       type: object
 *       properties:
 *         userid:
 *           type: string
 *           description: ID of the user being invited
 *         expiresat:
 *           type: string
 *           description: Expiry date and time of the invitation
 *       required:
 *         - userid
 *         - expiresat
 *
 *     FarmerInvitationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         invitation:
 *           $ref: "#/components/schemas/FarmerInvitation"
 *       required:
 *         - message
 *         - invitation
 *
 *     FarmerInvitation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the invitation
 *         farmid:
 *           type: string
 *           description: ID of the farm
 *         userid:
 *           type: string
 *           description: ID of the user being invited
 *         expiresat:
 *           type: string
 *           description: Expiry date and time of the invitation
 *         isaccepted:
 *           type: boolean
 *           description: Flag indicating whether the invitation is accepted
 *         createdat:
 *           type: string
 *           description: Date and time of creation
 *         updatedat:
 *           type: string
 *           description: Date and time of last update
 *       required:
 *         - id
 *         - farmid
 *         - userid
 *         - expiresat
 *         - isaccepted
 *         - createdat
 *         - updatedat
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CancelInvitationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ViewInvitationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         expiresat:
 *           type: string
 *           format: date-time
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         userid:
 *           type: string
 *         farm_name:
 *           type: string
 *       required:
 *         - id
 *         - expiresat
 *         - createdat
 *         - updatedat
 *         - userid
 *         - farm_name
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ListInvitationsResponse:
 *       type: object
 *       properties:
 *         invitations:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/InvitationItem"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     InvitationItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         avatar:
 *           type: string
 *         email:
 *           type: string
 *         userid:
 *           type: string
 *       required:
 *         - id
 *         - firstname
 *         - lastname
 *         - avatar
 *         - email
 *         - userid
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ListFarmMembersResponse:
 *       type: object
 *       properties:
 *         members:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/FarmMember"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     FarmMember:
 *       type: object
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
 *           type: string
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
 *       required:
 *         - id
 *         - username
 *         - email
 *         - firstname
 *         - lastname
 *         - birthdate
 *         - present_address
 *         - avatar
 *         - zipcode
 *         - district
 *         - municipality
 *         - verification_level
 *         - role
 *         - createdat
 *         - updatedat
 *         - isbanned
 *         - farm_id
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateCommunityFarmRequest:
 *       type: object
 *       properties:
 *         farm_name:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 *         district:
 *           type: string
 *         size:
 *           type: string
 *         avatar:
 *           type: string
 *           format: binary
 *         cover_photo:
 *           type: string
 *           format: binary
 *
 *     UpdateCommunityFarmResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/CommunityFarm"
 *       required:
 *         - message
 *         - data
 *
 *     CommunityFarm:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         farm_name:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 *         farm_head:
 *           type: string
 *         district:
 *           type: string
 *         size:
 *           type: string
 *         avatar:
 *           type: string
 *         cover_photo:
 *           type: string
 *         application_id:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - farm_name
 *         - location
 *         - description
 *         - farm_head
 *         - district
 *         - size
 *         - avatar
 *         - cover_photo
 *         - application_id
 *         - createdat
 *         - updatedat
 */
