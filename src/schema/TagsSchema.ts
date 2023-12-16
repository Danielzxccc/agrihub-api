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
