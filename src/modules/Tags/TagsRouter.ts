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
