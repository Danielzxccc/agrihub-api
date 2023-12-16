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

export const SearchTags = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z.string().optional().default('name'),
  }),
})
