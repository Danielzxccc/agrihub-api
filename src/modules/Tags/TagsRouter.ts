import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
import * as TagsController from './TagsController'
import express from 'express'

export const TagsRouter = express.Router()

/**
 * @openapi
 * /api/tags/search:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Search tags
 *     parameters:
 *       - name: key
 *         in: query
 *         description: Search key
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TagsSchema"
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

TagsRouter.get('/search', TagsController.findTags)

/**
 * @openapi
 * /api/tags:
 *   get:
 *     summary: Get a list of tags
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for tags (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number (optional)
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of tags per page (optional)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Sorting filter for tags (optional, default 'name')
 *     responses:
 *       "200":
 *         description: Success. Returns a list of tags.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TagList"
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */
TagsRouter.get('/', TagsController.getTags)

TagsRouter.post(
  '/create',
  UserGuard(['admin', 'asst_admin']),
  TagsController.createTag
)

TagsRouter.get('/:id', TagsController.viewTag)

TagsRouter.delete(
  '/:id',
  AccessGuard('forums'),
  UserGuard(['asst_admin', 'admin']),
  TagsController.deleteTag
)

export default TagsRouter
