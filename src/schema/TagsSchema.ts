import { z } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     TagsSchema:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *           tag_name:
 *             type: string
 *           details:
 *             type: string
 */
export const Tags = z.object({
  query: z.object({
    key: z.string().optional(),
  }),
})

/**
 * @openapi
 * components:
 *   schemas:
 *     TagList:
 *       type: object
 *       properties:
 *         tags:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Tag"
 *         pagination:
 *           $ref: "#/components/schemas/Pagination"
 *
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the tag
 *         tag_name:
 *           type: string
 *           description: The name of the tag
 *         details:
 *           type: string
 *           description: Details about the tag
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the tag was created
 *         count:
 *           type: string
 *           description: The count associated with the tag
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: The current page number
 *         per_page:
 *           type: integer
 *           description: Number of tags per page
 *         total_pages:
 *           type: integer
 *           description: Total number of pages
 *         total_records:
 *           type: integer
 *           description: Total number of tags across all pages
 */
export const SearchTags = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z.string().optional().default('name'),
  }),
})

export const NewTag = z.object({
  body: z.object({
    id: z.string().optional(),
    details: z.string(),
    tag_name: z.string(),
  }),
})
